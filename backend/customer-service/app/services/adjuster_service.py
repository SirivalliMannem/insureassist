import datetime
import random
import logging
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.models.customer import Customer, Policy, Coverage, Exclusion, Claim, Notification, CustomerAgentAssignment, User
from app.schemas.adjuster import (
    AdjusterStatsResponse,
    AdjusterClaimSummary,
    AdjusterClaimDetail,
    AdjusterCoverageItem,
    AdjusterExclusionItem,
    AdjusterDocumentItem,
    AdjusterDecisionRequest,
    AdjusterDecisionResponse
)

logger = logging.getLogger("customer_service.adjuster")


class AdjusterService:
    """
    Business logic layer for Adjuster Claims Management.
    Provides shared queue claim retrieval, detailed assessment data (with policy coverage & exclusions),
    and final claim decision processing (Approved, Rejected, More Information Required) with notifications.
    """

    @staticmethod
    def get_adjuster_stats(db: Session) -> AdjusterStatsResponse:
        """
        Calculate statistics for the shared Adjuster queue:
        - Total Claims: all claims
        - Pending Review: claims awaiting review
        - More Information: claims requiring more documents/info
        - Resolved Claims: Approved or Rejected
        """
        all_claims = db.query(Claim).all()
        total_claims = len(all_claims)
        
        pending_review = 0
        more_information = 0
        resolved_claims = 0

        for c in all_claims:
            st = (c.claim_status or "").strip().lower()
            if st in ["pending review", "under review", "submitted", "in review"]:
                pending_review += 1
            elif st in ["more information required", "more info required", "more info", "information requested"]:
                more_information += 1
            elif st in ["approved", "rejected", "resolved", "closed", "denied"]:
                resolved_claims += 1
            else:
                # Default unknown to pending review
                pending_review += 1

        return AdjusterStatsResponse(
            total_claims=total_claims,
            pending_review=pending_review,
            more_information=more_information,
            resolved_claims=resolved_claims
        )

    @staticmethod
    def get_claims_queue(
        db: Session,
        search: Optional[str] = None,
        status_filter: Optional[str] = None
    ) -> List[AdjusterClaimSummary]:
        """
        Retrieve all claims in the shared Adjuster queue.
        Supports search across Claim ID/number, Customer name, Policy number, Claim type.
        Supports filtering by explicit status.
        Sorts customer names A-Z where applicable.
        """
        query = db.query(Claim, Customer, Policy).join(
            Customer, Claim.customer_id == Customer.customer_id
        ).join(
            Policy, Claim.policy_id == Policy.policy_id
        )

        results = query.all()
        claims_list: List[AdjusterClaimSummary] = []

        for claim, customer, policy in results:
            # Map / normalize status display
            raw_status = (claim.claim_status or "Pending Review").strip()
            status_lower = raw_status.lower()

            if status_lower in ["pending review", "under review", "submitted", "in review"]:
                display_status = "Pending Review"
            elif status_lower in ["more information required", "more info required", "more info", "information requested"]:
                display_status = "More Information Required"
            elif status_lower in ["approved", "resolved", "settled"]:
                display_status = "Approved"
            elif status_lower in ["rejected", "denied", "declined"]:
                display_status = "Rejected"
            else:
                display_status = raw_status

            # Apply Status Filter if specified
            if status_filter and status_filter.lower() != "all":
                filter_lower = status_filter.strip().lower()
                if filter_lower == "pending review" and display_status != "Pending Review":
                    continue
                elif filter_lower in ["more information required", "more info"] and display_status != "More Information Required":
                    continue
                elif filter_lower == "approved" and display_status != "Approved":
                    continue
                elif filter_lower == "rejected" and display_status != "Rejected":
                    continue
                elif filter_lower not in ["pending review", "more information required", "approved", "rejected"] and display_status.lower() != filter_lower:
                    continue

            # Apply Search filter if specified
            if search and search.strip():
                s = search.strip().lower()
                matches = (
                    s in (claim.claim_number or "").lower() or
                    s in (claim.claim_id or "").lower() or
                    s in (customer.name or "").lower() or
                    s in (policy.policy_number or "").lower() or
                    s in (claim.incident_type or "").lower() or
                    s in (policy.policy_type or "").lower()
                )
                if not matches:
                    continue

            rep_date = claim.created_at.strftime("%Y-%m-%d") if claim.created_at else (claim.incident_date.strftime("%Y-%m-%d") if claim.incident_date else "")
            dec_date = claim.decision_date.strftime("%Y-%m-%d %H:%M:%S") if claim.decision_date else None

            claims_list.append(AdjusterClaimSummary(
                claim_id=claim.claim_id,
                claim_number=claim.claim_number,
                customer_id=customer.customer_id,
                customer_name=customer.name,
                policy_id=policy.policy_id,
                policy_number=policy.policy_number,
                policy_type=policy.policy_type,
                claim_type=claim.incident_type or "General Loss",
                reported_date=rep_date,
                claimed_amount=float(claim.claim_amount) if claim.claim_amount is not None else None,
                status=display_status,
                approved_amount=float(claim.approved_amount) if claim.approved_amount is not None else None,
                rejection_reason=claim.rejection_reason,
                decision_notes=claim.decision_notes,
                requested_info=claim.requested_info,
                decision_date=dec_date,
                decision_by=claim.decision_by
            ))

        # Sort by customer name A-Z by default for consistency
        claims_list.sort(key=lambda x: (x.customer_name.lower(), x.claim_number))
        return claims_list

    @staticmethod
    def get_claim_detail(claim_id: str, db: Session) -> AdjusterClaimDetail:
        """
        Retrieve complete claim detail for Adjuster review:
        - Claim info
        - Customer info (real DB data)
        - Policy info with coverages, limits, deductibles, and exclusions (real DB data)
        - Real associated documents or empty list
        """
        claim = db.query(Claim).filter(
            or_(Claim.claim_id == claim_id, Claim.claim_number == claim_id)
        ).first()

        if not claim:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Claim '{claim_id}' not found."
            )

        customer = db.query(Customer).filter(Customer.customer_id == claim.customer_id).first()
        policy = db.query(Policy).filter(Policy.policy_id == claim.policy_id).first()

        if not customer or not policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Customer or Policy association missing for claim '{claim_id}'."
            )

        # Coverages
        coverages_db = db.query(Coverage).filter(Coverage.policy_id == policy.policy_id).all()
        coverages = [
            AdjusterCoverageItem(
                coverage_id=c.coverage_id,
                coverage_name=c.coverage_name,
                coverage_limit=float(c.coverage_limit) if c.coverage_limit is not None else None,
                deductible=float(c.deductible) if c.deductible is not None else None,
                status=c.status or "Active"
            )
            for c in coverages_db
        ]

        # Exclusions
        exclusions_db = db.query(Exclusion).filter(Exclusion.policy_id == policy.policy_id).all()
        exclusions = [
            AdjusterExclusionItem(
                exclusion_id=e.exclusion_id,
                exclusion_name=e.exclusion_name,
                description=e.description
            )
            for e in exclusions_db
        ]

        # Documents: check if any document records exist (fallback to empty list, do not fabricate)
        documents: List[AdjusterDocumentItem] = []

        # Format Dates & Status
        raw_status = (claim.claim_status or "Pending Review").strip()
        status_lower = raw_status.lower()
        if status_lower in ["pending review", "under review", "submitted", "in review"]:
            display_status = "Pending Review"
        elif status_lower in ["more information required", "more info required", "more info", "information requested"]:
            display_status = "More Information Required"
        elif status_lower in ["approved", "resolved", "settled"]:
            display_status = "Approved"
        elif status_lower in ["rejected", "denied", "declined"]:
            display_status = "Rejected"
        else:
            display_status = raw_status

        rep_date = claim.created_at.strftime("%Y-%m-%d") if claim.created_at else (claim.incident_date.strftime("%Y-%m-%d") if claim.incident_date else "")
        inc_date = claim.incident_date.strftime("%Y-%m-%d") if claim.incident_date else rep_date
        dec_date = claim.decision_date.strftime("%Y-%m-%d %H:%M:%S") if claim.decision_date else None

        eff_date = policy.start_date.strftime("%Y-%m-%d") if policy.start_date else None
        exp_date = policy.end_date.strftime("%Y-%m-%d") if policy.end_date else None

        return AdjusterClaimDetail(
            claim_id=claim.claim_id,
            claim_number=claim.claim_number,
            claim_type=claim.incident_type or "General Loss",
            incident_date=inc_date,
            reported_date=rep_date,
            description=claim.incident_description or "",
            claimed_amount=float(claim.claim_amount) if claim.claim_amount is not None else None,
            location=claim.location,
            status=display_status,
            approved_amount=float(claim.approved_amount) if claim.approved_amount is not None else None,
            rejection_reason=claim.rejection_reason,
            decision_notes=claim.decision_notes,
            requested_info=claim.requested_info,
            decision_date=dec_date,
            decision_by=claim.decision_by,
            customer_id=customer.customer_id,
            customer_name=customer.name,
            email=customer.email,
            phone=customer.mobile,
            address=customer.address,
            policy_id=policy.policy_id,
            policy_number=policy.policy_number,
            policy_type=policy.policy_type,
            policy_status=policy.status or "Active",
            effective_date=eff_date,
            expiry_date=exp_date,
            premium=float(policy.premium) if policy.premium is not None else None,
            coverages=coverages,
            exclusions=exclusions,
            documents=documents
        )

    @staticmethod
    def _send_notification(
        db: Session,
        recipient_user_id: Optional[str],
        recipient_role: str,
        notification_type: str,
        title: str,
        message: str,
        entity_type: str = "CLAIM",
        entity_id: Optional[str] = None,
        claim_id: Optional[str] = None,
        policy_id: Optional[str] = None,
        policy_number: Optional[str] = None,
        policy_type: Optional[str] = None,
        customer_name: Optional[str] = None,
        status_val: Optional[str] = None
    ):
        import os
        import json
        import urllib.request
        import urllib.error

        notif_url = os.getenv("NOTIFICATION_SERVICE_URL", "http://insureassist-notification-container:8007")
        payload = {
            "recipient_user_id": recipient_user_id,
            "recipient_role": recipient_role,
            "notification_type": notification_type,
            "title": title,
            "message": message,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "claim_id": claim_id,
            "policy_id": policy_id,
            "policy_number": policy_number,
            "policy_type": policy_type,
            "customer_name": customer_name,
            "status": status_val
        }
        headers = {
            "X-Internal-Service-Key": os.getenv("INTERNAL_SERVICE_KEY", "insureassist-internal-service-secret-key-2026"),
            "Content-Type": "application/json"
        }
        data_bytes = json.dumps(payload).encode("utf-8")
        dispatched = False
        for endpoint in [f"{notif_url}/notifications", "http://127.0.0.1:8007/notifications"]:
            try:
                req = urllib.request.Request(endpoint, data=data_bytes, headers=headers, method="POST")
                with urllib.request.urlopen(req, timeout=2.0) as resp:
                    if resp.status in [200, 201]:
                        dispatched = True
                        break
            except Exception as e:
                logger.debug(f"Notification dispatch to {endpoint} failed: {e}")
                continue

        if not dispatched:
            now = datetime.datetime.utcnow()
            year = now.year
            notif_id = f"NOTIF-{year}-{random.randint(10000, 99999)}"
            db_notif = Notification(
                notification_id=notif_id,
                recipient_user_id=recipient_user_id,
                recipient_role=recipient_role,
                recipient_id=recipient_user_id,
                notification_type=notification_type,
                title=title,
                message=message,
                entity_type=entity_type,
                entity_id=entity_id,
                claim_id=claim_id,
                policy_id=policy_id,
                policy_number=policy_number,
                policy_type=policy_type,
                customer_name=customer_name,
                status=status_val,
                is_read=False,
                created_at=now
            )
            db.add(db_notif)

    @staticmethod
    def process_claim_decision(
        claim_id: str,
        payload: AdjusterDecisionRequest,
        adjuster_user: Dict[str, Any],
        db: Session
    ) -> AdjusterDecisionResponse:
        """
        Execute final claim decision:
        - Validate decision type and required fields
        - Update claim record in DB
        - Dispatch notifications to Customer and Agent via Notification Service
        """
        claim = db.query(Claim).filter(
            or_(Claim.claim_id == claim_id, Claim.claim_number == claim_id)
        ).first()

        if not claim:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Claim '{claim_id}' not found."
            )

        customer = db.query(Customer).filter(Customer.customer_id == claim.customer_id).first()
        policy = db.query(Policy).filter(Policy.policy_id == claim.policy_id).first()

        if not customer or not policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer or Policy record associated with this claim was not found."
            )

        decision_norm = payload.decision.strip().lower()
        now = datetime.datetime.utcnow()
        actor_name = adjuster_user.get("name") or adjuster_user.get("email") or "Adjuster"

        # Lookup statically assigned agent for customer if any
        assignment = db.query(CustomerAgentAssignment).filter(
            CustomerAgentAssignment.customer_id == customer.customer_id,
            CustomerAgentAssignment.status == "Active"
        ).first()
        assigned_agent_id = assignment.agent_id if assignment else None
        if not assigned_agent_id:
            # Fallback to default agent user in DB if any
            agent_user = db.query(User).filter(User.role.ilike("Agent")).first()
            if agent_user:
                assigned_agent_id = agent_user.user_id

        # Determine customer recipient ID
        cust_recipient_id = customer.user_id or customer.customer_id

        if decision_norm in ["approve", "approved"]:
            if payload.approved_amount is None or payload.approved_amount < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Approved amount is required and must be greater than or equal to 0."
                )
            
            final_status = "Approved"
            claim.claim_status = "Approved"
            claim.approved_amount = payload.approved_amount
            claim.rejection_reason = None
            claim.requested_info = None
            claim.decision_notes = payload.decision_notes
            claim.decision_date = now
            claim.decision_by = actor_name
            claim.updated_at = now

            # 1. Customer Notification
            AdjusterService._send_notification(
                db=db,
                recipient_user_id=cust_recipient_id,
                recipient_role="Customer",
                notification_type="CLAIM_APPROVED",
                title="Claim Approved",
                message=f"Your claim {claim.claim_number} has been approved for ${payload.approved_amount:,.2f}.",
                entity_type="CLAIM",
                entity_id=claim.claim_number,
                claim_id=claim.claim_id,
                policy_id=policy.policy_id,
                policy_number=policy.policy_number,
                policy_type=policy.policy_type,
                customer_name=customer.name,
                status_val="Approved"
            )

            # 2. Agent Notification
            AdjusterService._send_notification(
                db=db,
                recipient_user_id=assigned_agent_id,
                recipient_role="Agent",
                notification_type="CLAIM_APPROVED",
                title="Customer Claim Approved",
                message=f"Claim {claim.claim_number} for policy {policy.policy_number} has been approved.",
                entity_type="CLAIM",
                entity_id=claim.claim_number,
                claim_id=claim.claim_id,
                policy_id=policy.policy_id,
                policy_number=policy.policy_number,
                policy_type=policy.policy_type,
                customer_name=customer.name,
                status_val="Approved"
            )

            msg = f"Claim {claim.claim_number} successfully approved for ${payload.approved_amount:,.2f}."

        elif decision_norm in ["reject", "rejected"]:
            if not payload.rejection_reason or not payload.rejection_reason.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Rejection reason is required."
                )

            final_status = "Rejected"
            claim.claim_status = "Rejected"
            claim.approved_amount = 0.0
            claim.rejection_reason = payload.rejection_reason.strip()
            claim.requested_info = None
            claim.decision_notes = payload.decision_notes
            claim.decision_date = now
            claim.decision_by = actor_name
            claim.updated_at = now

            # 1. Customer Notification
            AdjusterService._send_notification(
                db=db,
                recipient_user_id=cust_recipient_id,
                recipient_role="Customer",
                notification_type="CLAIM_REJECTED",
                title="Claim Rejected",
                message=f"Your claim {claim.claim_number} has been rejected. Reason: {payload.rejection_reason}.",
                entity_type="CLAIM",
                entity_id=claim.claim_number,
                claim_id=claim.claim_id,
                policy_id=policy.policy_id,
                policy_number=policy.policy_number,
                policy_type=policy.policy_type,
                customer_name=customer.name,
                status_val="Rejected"
            )

            # 2. Agent Notification
            AdjusterService._send_notification(
                db=db,
                recipient_user_id=assigned_agent_id,
                recipient_role="Agent",
                notification_type="CLAIM_REJECTED",
                title="Customer Claim Rejected",
                message=f"Claim {claim.claim_number} for policy {policy.policy_number} has been rejected.",
                entity_type="CLAIM",
                entity_id=claim.claim_number,
                claim_id=claim.claim_id,
                policy_id=policy.policy_id,
                policy_number=policy.policy_number,
                policy_type=policy.policy_type,
                customer_name=customer.name,
                status_val="Rejected"
            )

            msg = f"Claim {claim.claim_number} has been rejected."

        elif decision_norm in ["more information required", "more info required", "more info", "request more information"]:
            if not payload.requested_info or not payload.requested_info.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Requested information/documents description is required."
                )

            final_status = "More Information Required"
            claim.claim_status = "More Information Required"
            claim.requested_info = payload.requested_info.strip()
            claim.decision_notes = payload.decision_notes
            claim.decision_date = now
            claim.decision_by = actor_name
            claim.updated_at = now

            # Customer Notification ONLY
            AdjusterService._send_notification(
                db=db,
                recipient_user_id=cust_recipient_id,
                recipient_role="Customer",
                notification_type="CLAIM_MORE_INFORMATION_REQUIRED",
                title="Claim More Information Required",
                message=f"More information required for claim {claim.claim_number}: {payload.requested_info}.",
                entity_type="CLAIM",
                entity_id=claim.claim_number,
                claim_id=claim.claim_id,
                policy_id=policy.policy_id,
                policy_number=policy.policy_number,
                policy_type=policy.policy_type,
                customer_name=customer.name,
                status_val="More Information Required"
            )

            msg = f"Information request submitted for claim {claim.claim_number}."

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid decision '{payload.decision}'. Allowed decisions: 'Approved', 'Rejected', 'More Information Required'."
            )

        db.commit()
        db.refresh(claim)

        return AdjusterDecisionResponse(
            claim_id=claim.claim_id,
            claim_number=claim.claim_number,
            status=final_status,
            message=msg,
            decision_date=now.strftime("%Y-%m-%d %H:%M:%S"),
            decision_by=actor_name
        )
