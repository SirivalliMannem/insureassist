
import datetime
import json
import random
import re
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

import os
import urllib.request
import logging

from app.models.customer import Customer, Policy, Coverage, Exclusion, Claim, RenewalRequest, Notification, Application, CustomerAgentAssignment, User, ChatConversation, ChatMessage
from app.services.pdf_service import build_policy_pdf, build_application_doc_pdf, build_claim_pdf
from app.schemas.customer import (
    CustomerProfileResponse,
    PolicySummaryResponse,
    ClaimSummaryResponse,
    FNOLSubmissionRequest,
    FNOLSubmissionResponse,
    RenewalCreationRequest,
    RenewalResponse,
    RenewalApprovalResponse,
    NotificationResponse,
    PolicyApplicationRequest,
    PolicyApplicationResponse,
    ProvideMoreInfoRequest,
    AssignedAgentItem,
    CustomerAssignedAgentResponse,
    ChatMessageItem,
    ChatConversationItem,
    CreateConversationRequest,
    SendMessageRequest,
    CustomerChatResponse,
    GlossaryExplainRequest,
    GlossaryExplainResponse,
    CoverageCheckRequest,
    CoverageCheckResponse
)

logger = logging.getLogger("customer_service.chat")


def format_currency(value: Optional[float], suffix: str = "") -> str:
    """Helper to format numeric amounts to currency strings."""
    if value is None:
        return "$0" + suffix
    try:
        val_float = float(value)
        if val_float.is_integer():
            return f"${int(val_float):,}{suffix}"
        return f"${val_float:,.2f}{suffix}"
    except (ValueError, TypeError):
        return "$0" + suffix


def determine_category(policy_type: str) -> str:
    """Helper to classify policy into UI category."""
    pt_lower = (policy_type or "").lower()
    if any(k in pt_lower for k in ("auto", "vehicle", "car", "motor", "truck")):
        return "Vehicle"
    if any(k in pt_lower for k in ("umbrella", "excess", "liability")):
        return "Umbrella"
    if any(k in pt_lower for k in ("home", "property", "dwelling", "condo", "renter", "fire", "flood")):
        return "Property"
    if any(k in pt_lower for k in ("commercial", "business", "bop")):
        return "Commercial"
    return "Property"


class CustomerService:
    """
    Business logic layer for InsureAssist Customer microservice.
    Uses PostgreSQL database sessions to manage customer data, policies, claims, renewals, and notifications.
    """

    @staticmethod
    def _lookup_assigned_agent(customer_id: str, db: Session) -> tuple[Optional[AssignedAgentItem], str]:
        """
        Queries customer_agent_assignments table ONLY for static customer-agent assignment.
        DOES NOT infer assigned agent from applications.forwarded_by_agent_id or any transactional field.
        """
        assignment = db.query(CustomerAgentAssignment).filter(
            CustomerAgentAssignment.customer_id == customer_id,
            CustomerAgentAssignment.status == "Active"
        ).first()

        if assignment:
            agent_user = db.query(User).filter(User.user_id == str(assignment.agent_id)).first()
            assigned_item = AssignedAgentItem(
                agent_id=str(assignment.agent_id),
                name=agent_user.name if agent_user else f"Agent {assignment.agent_id}",
                email=agent_user.email if agent_user else "",
                phone="(555) 876-5432",
                role=agent_user.role if agent_user else "Agent"
            )
            return assigned_item, assignment.status or "Active"
        return None, "Unassigned"

    @staticmethod
    def get_profile(customer: Customer, db: Session) -> CustomerProfileResponse:
        """
        Retrieves profile and aggregated counts for the authenticated customer from PostgreSQL.
        Assigned agent is strictly derived from customer_agent_assignments.
        """
        active_policies_count = db.query(Policy).filter(
            Policy.customer_id == customer.customer_id,
            Policy.status.ilike("Active")
        ).count()

        open_claims_count = db.query(Claim).filter(
            Claim.customer_id == customer.customer_id,
            Claim.claim_status.notin_(["Closed", "Rejected", "Settled"])
        ).count()

        assigned_agent, assignment_status = CustomerService._lookup_assigned_agent(customer.customer_id, db)

        return CustomerProfileResponse(
            id=customer.customer_id,
            name=customer.name,
            email=customer.email,
            phone=customer.mobile or "(555) 000-0000",
            address=customer.address or "124 Grand Avenue, Suite 400, Chicago, IL 60611",
            active_policies_count=active_policies_count,
            open_claims_count=open_claims_count,
            assigned_agent=assigned_agent,
            assignment_status=assignment_status
        )

    @staticmethod
    def get_assigned_agent(customer: Customer, db: Session) -> CustomerAssignedAgentResponse:
        """
        Returns customer's assigned agent strictly from customer_agent_assignments.
        """
        assigned_agent, assignment_status = CustomerService._lookup_assigned_agent(customer.customer_id, db)
        return CustomerAssignedAgentResponse(
            customer_id=customer.customer_id,
            customer_name=customer.name,
            assigned_agent=assigned_agent,
            assignment_status=assignment_status
        )

    @staticmethod
    def get_assigned_agent_by_id(customer_id: str, db: Session) -> CustomerAssignedAgentResponse:
        """
        Returns assigned agent for a given customer_id strictly from customer_agent_assignments.
        """
        cust = db.query(Customer).filter(
            (Customer.customer_id == customer_id) | (Customer.user_id == customer_id)
        ).first()
        cust_name = cust.name if cust else f"Customer {customer_id}"
        actual_cust_id = cust.customer_id if cust else customer_id

        assigned_agent, assignment_status = CustomerService._lookup_assigned_agent(actual_cust_id, db)
        return CustomerAssignedAgentResponse(
            customer_id=actual_cust_id,
            customer_name=cust_name,
            assigned_agent=assigned_agent,
            assignment_status=assignment_status
        )

    @staticmethod
    def get_policies(customer: Customer, db: Session) -> List[PolicySummaryResponse]:
        """
        Retrieves all policies owned by the authenticated customer from PostgreSQL.
        """
        policies = db.query(Policy).filter(
            Policy.customer_id == customer.customer_id
        ).all()

        results = []
        for p in policies:
            # Find primary deductible from associated coverages
            deductible_str = "$1,000"
            if p.coverages:
                for cov in p.coverages:
                    if cov.deductible is not None and cov.deductible > 0:
                        deductible_str = format_currency(cov.deductible)
                        break

            results.append(PolicySummaryResponse(
                id=p.policy_id,
                policy_number=p.policy_number,
                type=p.policy_type,
                category=determine_category(p.policy_type),
                status=p.status or "Active",
                premium=format_currency(p.premium, suffix="/yr"),
                effective_date=str(p.start_date) if p.start_date else "2024-01-01",
                expiry_date=str(p.end_date) if p.end_date else "2025-01-01",
                deductible=deductible_str
            ))
        return results

    @staticmethod
    def get_claims(customer: Customer, db: Session) -> List[ClaimSummaryResponse]:
        """
        Retrieves all claims submitted by the authenticated customer from PostgreSQL.
        """
        claims = db.query(Claim).filter(
            Claim.customer_id == customer.customer_id
        ).order_by(Claim.created_at.desc()).all()

        results = []
        for c in claims:
            policy_title = c.policy.policy_type if c.policy else "InsureAssist Policy"
            results.append(ClaimSummaryResponse(
                id=c.claim_id,
                policy_id=c.policy_id,
                policy_name=policy_title,
                incident_date=str(c.incident_date),
                status=c.claim_status,
                estimated_amount=format_currency(c.claim_amount) if c.claim_amount is not None else "$0",
                incident_description=c.incident_description
            ))
        return results

    @staticmethod
    def submit_fnol(claim_in: FNOLSubmissionRequest, customer: Customer, db: Session) -> FNOLSubmissionResponse:
        """
        Validates customer ownership of the selected policy, creates a persistent Claim record,
        and saves it to PostgreSQL.
        """
        policy = db.query(Policy).filter(
            Policy.policy_id == claim_in.policy_id,
            Policy.customer_id == customer.customer_id
        ).first()

        if not policy:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Policy '{claim_in.policy_id}' does not belong to authenticated customer or does not exist."
            )

        inc_date = None
        if claim_in.incident_date:
            try:
                inc_date = datetime.datetime.strptime(claim_in.incident_date.strip(), "%Y-%m-%d").date()
            except ValueError:
                inc_date = datetime.date.today()
        else:
            inc_date = datetime.date.today()

        amount = None
        if claim_in.estimated_damage:
            clean_dmg = re.sub(r"[^\d.]", "", str(claim_in.estimated_damage))
            try:
                amount = float(clean_dmg) if clean_dmg else None
            except ValueError:
                amount = None

        year = datetime.datetime.utcnow().year
        rand_num = random.randint(1000, 9999)
        claim_id = f"CLM-{year}-{rand_num}"
        claim_number = f"CLM-{rand_num}"

        while db.query(Claim).filter(Claim.claim_id == claim_id).first():
            rand_num = random.randint(1000, 9999)
            claim_id = f"CLM-{year}-{rand_num}"
            claim_number = f"CLM-{rand_num}"

        now = datetime.datetime.utcnow()
        new_claim = Claim(
            claim_id=claim_id,
            customer_id=customer.customer_id,
            policy_id=policy.policy_id,
            claim_number=claim_number,
            incident_date=inc_date,
            incident_type=claim_in.incident_type or "General Loss",
            incident_description=claim_in.description,
            location=claim_in.location or "",
            claim_status="Under Review",
            claim_amount=amount,
            created_at=now,
            updated_at=now
        )

        db.add(new_claim)

        # Generate notifications for Customer and Agent
        cust_notif_id = f"NOTIF-{year}-{random.randint(10000, 99999)}"
        cust_notif = Notification(
            notification_id=cust_notif_id,
            recipient_role="Customer",
            recipient_id=customer.customer_id,
            title="FNOL Claim Submitted",
            message=f"Claim {claim_number} for {policy.policy_type} has been submitted and is under review.",
            policy_id=policy.policy_id,
            policy_number=policy.policy_number,
            policy_type=policy.policy_type,
            customer_name=customer.name,
            status="Under Review",
            is_read=False,
            created_at=now
        )
        db.add(cust_notif)

        agent_notif_id = f"NOTIF-{year}-{random.randint(10000, 99999)}"
        agent_notif = Notification(
            notification_id=agent_notif_id,
            recipient_role="Agent",
            recipient_id=None,
            title="New FNOL Claim Filed",
            message=f"Customer {customer.name} has submitted claim {claim_number} for {policy.policy_type}.",
            policy_id=policy.policy_id,
            policy_number=policy.policy_number,
            policy_type=policy.policy_type,
            customer_name=customer.name,
            status="Under Review",
            is_read=False,
            created_at=now
        )
        db.add(agent_notif)

        db.commit()
        db.refresh(new_claim)

        return FNOLSubmissionResponse(
            claim_id=new_claim.claim_id,
            status="Under Review",
            message=f"Claim {new_claim.claim_id} for {policy.policy_type} successfully filed and recorded.",
            submitted_at=new_claim.created_at.isoformat()
        )

    @staticmethod
    def request_renewal(renewal_in: RenewalCreationRequest, customer: Customer, db: Session) -> RenewalResponse:
        """
        Creates a RenewalRequest for the customer's policy and sends a notification to the Agent/Broker.
        """
        # Validate policy ownership
        policy = db.query(Policy).filter(
            or_(Policy.policy_id == renewal_in.policy_id, Policy.policy_number == renewal_in.policy_id),
            Policy.customer_id == customer.customer_id
        ).first()

        if not policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Policy '{renewal_in.policy_id}' not found for authenticated customer."
            )

        # Check if already has a Pending Approval request
        existing = db.query(RenewalRequest).filter(
            RenewalRequest.policy_id == policy.policy_id,
            RenewalRequest.customer_id == customer.customer_id,
            RenewalRequest.status == "Pending Approval"
        ).first()

        if existing:
            return RenewalResponse(
                renewal_id=existing.renewal_id,
                policy_id=existing.policy_id,
                policy_number=existing.policy_number,
                policy_type=existing.policy_type,
                customer_id=existing.customer_id,
                customer_name=existing.customer_name,
                renewal_date=str(existing.renewal_date) if existing.renewal_date else None,
                renewal_premium=format_currency(existing.renewal_premium, suffix="/yr"),
                status=existing.status,
                created_at=existing.created_at.isoformat(),
                updated_at=existing.updated_at.isoformat()
            )

        now = datetime.datetime.utcnow()
        year = now.year
        rand_num = random.randint(10000, 99999)
        renewal_id = f"REN-{year}-{rand_num}"

        while db.query(RenewalRequest).filter(RenewalRequest.renewal_id == renewal_id).first():
            rand_num = random.randint(10000, 99999)
            renewal_id = f"REN-{year}-{rand_num}"

        new_renewal = RenewalRequest(
            renewal_id=renewal_id,
            customer_id=customer.customer_id,
            policy_id=policy.policy_id,
            policy_number=policy.policy_number,
            policy_type=policy.policy_type,
            customer_name=customer.name,
            renewal_date=policy.end_date,
            renewal_premium=policy.premium,
            status="Pending Approval",
            created_at=now,
            updated_at=now
        )
        db.add(new_renewal)

        # Generate Agent/Broker Notification
        notif_id = f"NOTIF-{year}-{random.randint(10000, 99999)}"
        agent_notif = Notification(
            notification_id=notif_id,
            recipient_role="Agent",
            recipient_id=None,  # Available to assigned/portfolio agents
            title="Policy Renewal Approval Requested",
            message=f"Customer {customer.name} has confirmed renewal for {policy.policy_type} ({policy.policy_number}). Review and approval required.",
            policy_id=policy.policy_id,
            policy_number=policy.policy_number,
            policy_type=policy.policy_type,
            customer_name=customer.name,
            renewal_id=renewal_id,
            renewal_date=policy.end_date,
            renewal_premium=policy.premium,
            status="Pending Approval",
            is_read=False,
            created_at=now
        )
        db.add(agent_notif)

        db.commit()
        db.refresh(new_renewal)

        return RenewalResponse(
            renewal_id=new_renewal.renewal_id,
            policy_id=new_renewal.policy_id,
            policy_number=new_renewal.policy_number,
            policy_type=new_renewal.policy_type,
            customer_id=new_renewal.customer_id,
            customer_name=new_renewal.customer_name,
            renewal_date=str(new_renewal.renewal_date) if new_renewal.renewal_date else None,
            renewal_premium=format_currency(new_renewal.renewal_premium, suffix="/yr"),
            status=new_renewal.status,
            created_at=new_renewal.created_at.isoformat(),
            updated_at=new_renewal.updated_at.isoformat()
        )

    @staticmethod
    def get_customer_renewals(customer: Customer, db: Session) -> List[RenewalResponse]:
        """
        Retrieves all renewal requests for the authenticated customer.
        """
        requests = db.query(RenewalRequest).filter(
            RenewalRequest.customer_id == customer.customer_id
        ).order_by(RenewalRequest.created_at.desc()).all()

        return [
            RenewalResponse(
                renewal_id=r.renewal_id,
                policy_id=r.policy_id,
                policy_number=r.policy_number,
                policy_type=r.policy_type,
                customer_id=r.customer_id,
                customer_name=r.customer_name,
                renewal_date=str(r.renewal_date) if r.renewal_date else None,
                renewal_premium=format_currency(r.renewal_premium, suffix="/yr"),
                status=r.status,
                created_at=r.created_at.isoformat(),
                updated_at=r.updated_at.isoformat()
            )
            for r in requests
        ]

    @staticmethod
    def get_agent_renewals(db: Session, status_filter: Optional[str] = None) -> List[RenewalResponse]:
        """
        Retrieves renewal requests for Agent/Broker review.
        """
        query = db.query(RenewalRequest)
        if status_filter:
            query = query.filter(RenewalRequest.status.ilike(status_filter))
        requests = query.order_by(RenewalRequest.created_at.desc()).all()

        return [
            RenewalResponse(
                renewal_id=r.renewal_id,
                policy_id=r.policy_id,
                policy_number=r.policy_number,
                policy_type=r.policy_type,
                customer_id=r.customer_id,
                customer_name=r.customer_name,
                renewal_date=str(r.renewal_date) if r.renewal_date else None,
                renewal_premium=format_currency(r.renewal_premium, suffix="/yr"),
                status=r.status,
                created_at=r.created_at.isoformat(),
                updated_at=r.updated_at.isoformat()
            )
            for r in requests
        ]

    @staticmethod
    def approve_renewal(renewal_id: str, db: Session) -> RenewalApprovalResponse:
        """
        Agent approves a renewal request:
        - Updates RenewalRequest status to 'Approved'
        - Advances Policy end_date in PostgreSQL by 1 year (so it moves out of approaching renewals)
        - Creates a Notification for the Customer: 'Your renewal has been approved.'
        """
        renewal = db.query(RenewalRequest).filter(
            RenewalRequest.renewal_id == renewal_id
        ).first()

        if not renewal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Renewal request '{renewal_id}' not found."
            )

        now = datetime.datetime.utcnow()
        renewal.status = "Approved"
        renewal.updated_at = now

        # Update Policy end_date
        policy = db.query(Policy).filter(Policy.policy_id == renewal.policy_id).first()
        new_end_date_str = None
        if policy:
            if policy.end_date:
                # Add 1 year
                try:
                    new_end = datetime.date(policy.end_date.year + 1, policy.end_date.month, policy.end_date.day)
                except ValueError:
                    # Leap year fallback (Feb 29 -> Feb 28)
                    new_end = policy.end_date + datetime.timedelta(days=365)
                policy.end_date = new_end
            else:
                policy.end_date = datetime.date.today() + datetime.timedelta(days=365)
            policy.status = "Active"
            new_end_date_str = str(policy.end_date)

        # Create Customer Notification
        notif_id = f"NOTIF-{now.year}-{random.randint(10000, 99999)}"
        cust_notif = Notification(
            notification_id=notif_id,
            recipient_role="Customer",
            recipient_id=renewal.customer_id,
            title="Renewal Approved",
            message=f"Your renewal for {renewal.policy_type} ({renewal.policy_number}) has been approved.",
            policy_id=renewal.policy_id,
            policy_number=renewal.policy_number,
            policy_type=renewal.policy_type,
            customer_name=renewal.customer_name,
            renewal_id=renewal.renewal_id,
            renewal_date=policy.end_date if policy else renewal.renewal_date,
            renewal_premium=renewal.renewal_premium,
            status="Approved",
            is_read=False,
            created_at=now
        )
        db.add(cust_notif)

        # Mark previous Agent notifications for this renewal as read/updated
        agent_notifs = db.query(Notification).filter(
            Notification.renewal_id == renewal_id,
            Notification.recipient_role == "Agent"
        ).all()
        for an in agent_notifs:
            an.status = "Approved"
            an.is_read = True

        db.commit()

        return RenewalApprovalResponse(
            renewal_id=renewal.renewal_id,
            status="Approved",
            message=f"Renewal for policy {renewal.policy_number} has been approved successfully.",
            policy_id=renewal.policy_id,
            new_end_date=new_end_date_str
        )

    @staticmethod
    def get_notifications(
        role: str,
        customer_id: Optional[str],
        user_id: Optional[str],
        email: Optional[str],
        db: Session
    ) -> List[NotificationResponse]:
        """
        Retrieves notifications relevant to the authenticated user/role.
        """
        role_clean = (role or "").strip().lower()

        if role_clean == "customer":
            # Filter for customer
            match_ids = [i for i in [customer_id, user_id, email] if i]
            query = db.query(Notification).filter(
                Notification.recipient_role == "Customer",
                or_(
                    Notification.recipient_id.in_(match_ids),
                    Notification.recipient_id.is_(None)
                )
            )
        else:
            # Agent, Underwriter, Admin
            query = db.query(Notification).filter(
                Notification.recipient_role.ilike("Agent")
            )

        notifs = query.order_by(Notification.created_at.desc()).limit(50).all()

        return [
            NotificationResponse(
                notification_id=n.notification_id,
                recipient_role=n.recipient_role,
                recipient_id=n.recipient_id,
                title=n.title,
                message=n.message,
                policy_id=n.policy_id,
                policy_number=n.policy_number,
                policy_type=n.policy_type,
                customer_name=n.customer_name,
                renewal_id=n.renewal_id,
                renewal_date=str(n.renewal_date) if n.renewal_date else None,
                renewal_premium=format_currency(n.renewal_premium, suffix="/yr") if n.renewal_premium is not None else None,
                status=n.status,
                is_read=n.is_read,
                created_at=n.created_at.isoformat()
            )
            for n in notifs
        ]

    @staticmethod
    def mark_notification_read(notification_id: str, db: Session) -> dict:
        """
        Marks a specific notification as read.
        """
        notif = db.query(Notification).filter(
            Notification.notification_id == notification_id
        ).first()
        if notif:
            notif.is_read = True
            db.commit()
            return {"status": "ok", "message": "Notification marked as read."}
        return {"status": "ok", "message": "Notification not found."}

    # =========================================================================
    # Policy Applications Flow (Customer Intake & Tracking)
    # =========================================================================

    @staticmethod
    def _format_application_response(app_record: Application, customer_name: str) -> PolicyApplicationResponse:
        """
        Helper to convert Application ORM model to PolicyApplicationResponse schema.
        """
        app_info = json.loads(app_record.applicant_info) if app_record.applicant_info else {}
        policy_data = json.loads(app_record.policy_specific_data) if app_record.policy_specific_data else {}
        docs_list = json.loads(app_record.documents) if app_record.documents else []

        return PolicyApplicationResponse(
            application_id=app_record.application_id,
            customer_id=app_record.customer_id,
            customer_name=customer_name or "Valued Customer",
            policy_type=app_record.policy_type,
            product_name=app_record.product_name,
            coverage_tier=app_record.coverage_tier or "Standard",
            coverage_limit=format_currency(app_record.coverage_limit) if app_record.coverage_limit is not None else "$300,000",
            deductible=format_currency(app_record.deductible) if app_record.deductible is not None else "$1,000",
            duration_months=app_record.duration_months or 12,
            start_date=str(app_record.start_date) if app_record.start_date else None,
            estimated_premium=format_currency(app_record.estimated_premium, suffix="/yr") if app_record.estimated_premium is not None else "$1,200/yr",
            status=app_record.status or "Submitted",
            policy_id=app_record.policy_id,
            applicant_info=app_info,
            policy_specific_data=policy_data,
            documents=docs_list,
            forwarded_by_agent_id=app_record.forwarded_by_agent_id,
            forwarded_at=app_record.forwarded_at.isoformat() if app_record.forwarded_at else None,
            agent_notes=app_record.agent_notes,
            verification_status=app_record.verification_status or "Pending Verification",
            created_at=app_record.created_at.isoformat() if app_record.created_at else datetime.datetime.utcnow().isoformat(),
            updated_at=app_record.updated_at.isoformat() if app_record.updated_at else datetime.datetime.utcnow().isoformat()
        )

    @staticmethod
    def submit_application(app_in: PolicyApplicationRequest, customer: Customer, db: Session) -> PolicyApplicationResponse:
        """
        Submits a new policy application from the customer:
        1. Persists Application record in PostgreSQL.
        2. Automatically creates a linked Pending Policy in `policies` table with associated Coverages & Exclusions.
        3. Creates in-app notifications for the Customer and Agents/Underwriters.
        """
        now = datetime.datetime.utcnow()
        year = now.year
        rand_num = random.randint(10000, 99999)
        application_id = f"APP-{year}-{rand_num}"

        while db.query(Application).filter(Application.application_id == application_id).first():
            rand_num = random.randint(10000, 99999)
            application_id = f"APP-{year}-{rand_num}"

        # Generate unique Policy ID & Number for the pending contract
        pol_rand = random.randint(100000, 999999)
        policy_id = f"POL-{year}-{pol_rand}"
        policy_number = f"POL-{year}-0{pol_rand}"

        while db.query(Policy).filter(Policy.policy_id == policy_id).first():
            pol_rand = random.randint(100000, 999999)
            policy_id = f"POL-{year}-{pol_rand}"
            policy_number = f"POL-{year}-0{pol_rand}"

        # Calculate effective dates
        start_d = None
        if app_in.start_date:
            try:
                start_d = datetime.datetime.strptime(app_in.start_date.strip(), "%Y-%m-%d").date()
            except ValueError:
                start_d = datetime.date.today()
        else:
            start_d = datetime.date.today()

        duration = app_in.duration_months or 12
        end_d = start_d + datetime.timedelta(days=int(duration * 30.4375))

        # Premium computation fallback
        prem = app_in.estimated_premium
        if not prem or prem <= 0:
            base_premiums = {
                "homeowner": 1840.0,
                "auto": 1260.0,
                "commercial": 2450.0,
                "liability": 1650.0,
                "renter": 360.0,
                "umbrella": 480.0
            }
            matched_val = 1500.0
            for k, val in base_premiums.items():
                if k in app_in.policy_type.lower() or k in app_in.product_name.lower():
                    matched_val = val
                    break
            prem = matched_val

        # Create linked Policy in Pending status (surfaces to Underwriters Triage Queue)
        new_policy = Policy(
            policy_id=policy_id,
            customer_id=customer.customer_id,
            policy_number=policy_number,
            policy_type=app_in.policy_type,
            status="Pending",
            start_date=start_d,
            end_date=end_d,
            premium=prem,
            created_at=now
        )
        db.add(new_policy)

        # Create primary Coverage line
        cov_limit = app_in.coverage_limit if (app_in.coverage_limit and app_in.coverage_limit > 0) else (prem * 250)
        cov_deductible = app_in.deductible if (app_in.deductible is not None) else 1000.0
        cov_id = f"COV-{year}-{random.randint(10000, 99999)}"
        new_coverage = Coverage(
            coverage_id=cov_id,
            policy_id=policy_id,
            coverage_name=f"{app_in.product_name} ({app_in.coverage_tier} Tier)",
            coverage_limit=cov_limit,
            deductible=cov_deductible,
            status="Pending"
        )
        db.add(new_coverage)

        # Create standard Exclusion line
        excl_id = f"EXC-{year}-{random.randint(10000, 99999)}"
        new_exclusion = Exclusion(
            exclusion_id=excl_id,
            policy_id=policy_id,
            exclusion_name="Intentional Loss & Undeclared Hazards",
            description="Losses arising from undeclared business activities or intentional negligence are excluded."
        )
        db.add(new_exclusion)

        # Process document metadata
        docs_payload = []
        if app_in.documents:
            for doc in app_in.documents:
                docs_payload.append({
                    "doc_type": doc.doc_type,
                    "file_name": doc.file_name,
                    "file_size": doc.file_size or "1.0 MB",
                    "file_data": doc.file_data or "",
                    "uploaded_at": doc.uploaded_at or now.isoformat()
                })

        # Save Application record
        new_application = Application(
            application_id=application_id,
            customer_id=customer.customer_id,
            policy_type=app_in.policy_type,
            product_name=app_in.product_name,
            coverage_tier=app_in.coverage_tier or "Standard",
            coverage_limit=cov_limit,
            deductible=cov_deductible,
            duration_months=duration,
            estimated_premium=prem,
            start_date=start_d,
            status="Submitted",
            applicant_info=json.dumps(app_in.applicant_info) if app_in.applicant_info else None,
            policy_specific_data=json.dumps(app_in.policy_specific_data) if app_in.policy_specific_data else None,
            documents=json.dumps(docs_payload) if docs_payload else None,
            policy_id=policy_id,
            created_at=now,
            updated_at=now
        )
        db.add(new_application)

        # Create Customer Notification
        cust_notif = Notification(
            notification_id=f"NOTIF-{year}-{random.randint(10000, 99999)}",
            recipient_role="Customer",
            recipient_id=customer.customer_id,
            title="Application Submitted",
            message=f"Your policy application {application_id} for {app_in.product_name} has been submitted for underwriting review.",
            policy_id=policy_id,
            policy_number=policy_number,
            policy_type=app_in.policy_type,
            customer_name=customer.name,
            status="Submitted",
            is_read=False,
            created_at=now
        )
        db.add(cust_notif)

        # Create Agent/Staff Notification
        agent_notif = Notification(
            notification_id=f"NOTIF-{year}-{random.randint(10000, 99999)}",
            recipient_role="Agent",
            recipient_id=None,
            title="New Policy Application Intake",
            message=f"Customer {customer.name} submitted application {application_id} for {app_in.product_name}.",
            policy_id=policy_id,
            policy_number=policy_number,
            policy_type=app_in.policy_type,
            customer_name=customer.name,
            status="Submitted",
            is_read=False,
            created_at=now
        )
        db.add(agent_notif)

        db.commit()
        db.refresh(new_application)

        return CustomerService._format_application_response(new_application, customer.name)

    @staticmethod
    def get_customer_applications(customer: Customer, db: Session) -> List[PolicyApplicationResponse]:
        """
        Retrieves all policy applications submitted by the authenticated customer.
        """
        apps = db.query(Application).filter(
            Application.customer_id == customer.customer_id
        ).order_by(Application.created_at.desc()).all()

        return [
            CustomerService._format_application_response(a, customer.name)
            for a in apps
        ]

    @staticmethod
    def get_application_detail(application_id: str, customer: Customer, db: Session) -> PolicyApplicationResponse:
        """
        Retrieves detailed information for a single policy application owned by the customer.
        """
        app_record = db.query(Application).filter(
            Application.application_id == application_id,
            Application.customer_id == customer.customer_id
        ).first()

        if not app_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Application '{application_id}' not found for authenticated customer."
            )

        return CustomerService._format_application_response(app_record, customer.name)

    @staticmethod
    def provide_more_information(
        application_id: str,
        req_in: ProvideMoreInfoRequest,
        customer: Customer,
        db: Session
    ) -> PolicyApplicationResponse:
        """
        Customer responds to Agent/Underwriter 'More Information Required' request:
        1. Appends or updates uploaded documents.
        2. Merges updated answers/notes.
        3. Transitions status back to 'Agent Review' (or 'Submitted').
        4. Notifies assigned Agent and staff.
        """
        app_record = db.query(Application).filter(
            Application.application_id == application_id,
            Application.customer_id == customer.customer_id
        ).first()

        if not app_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Application '{application_id}' not found for authenticated customer."
            )

        now = datetime.datetime.utcnow()

        # Update documents
        existing_docs = json.loads(app_record.documents) if app_record.documents else []
        if req_in.documents:
            for doc in req_in.documents:
                existing_docs.append({
                    "doc_type": doc.doc_type,
                    "file_name": doc.file_name,
                    "file_size": doc.file_size or "1.0 MB",
                    "file_data": doc.file_data or "",
                    "uploaded_at": doc.uploaded_at or now.isoformat()
                })
            app_record.documents = json.dumps(existing_docs)

        # Update specific answers if provided
        if req_in.updated_answers:
            existing_answers = json.loads(app_record.policy_specific_data) if app_record.policy_specific_data else {}
            existing_answers.update(req_in.updated_answers)
            app_record.policy_specific_data = json.dumps(existing_answers)

        # Transition status back to Agent Review
        app_record.status = "Agent Review"
        app_record.verification_status = "Customer Resubmitted"
        app_record.updated_at = now

        # Create Agent notification
        agent_notif = Notification(
            notification_id=f"NOTIF-{now.year}-{random.randint(10000, 99999)}",
            recipient_role="Agent",
            recipient_id=app_record.forwarded_by_agent_id,
            title="Information Provided by Customer",
            message=f"Customer {customer.name} uploaded requested information for {app_record.application_id}. Application returned to Agent Review.",
            policy_id=app_record.policy_id,
            policy_number=None,
            policy_type=app_record.policy_type,
            customer_name=customer.name,
            status="Agent Review",
            is_read=False,
            created_at=now
        )
        db.add(agent_notif)

        db.commit()
        db.refresh(app_record)

        return CustomerService._format_application_response(app_record, customer.name)

    # =========================================================================
    # Authenticated Document Downloads
    # =========================================================================

    @staticmethod
    def download_policy_document(policy_ref: str, customer: Customer, db: Session) -> tuple[bytes, str]:
        """
        Authenticates and generates the official Policy Schedule & Declarations PDF for a policy owned by the customer.
        Strictly prevents cross-customer unauthorized downloads.
        """
        clean_ref = (policy_ref or "").strip()
        policy = db.query(Policy).filter(
            (Policy.policy_id == clean_ref) | (Policy.policy_number == clean_ref),
            Policy.customer_id == customer.customer_id
        ).first()

        if not policy:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Policy document '{clean_ref}' not found or access denied."
            )

        coverages = db.query(Coverage).filter(Coverage.policy_id == policy.policy_id).all()
        exclusions = db.query(Exclusion).filter(Exclusion.policy_id == policy.policy_id).all()

        pdf_bytes = build_policy_pdf(policy, customer, coverages, exclusions)
        filename = f"{policy.policy_number}.pdf"
        return pdf_bytes, filename

    @staticmethod
    def download_application_document(application_id: str, doc_name: str, customer: Customer, db: Session) -> tuple[bytes, str]:
        """
        Authenticates and downloads a verified submitted application document belonging to the customer.
        """
        clean_app_id = (application_id or "").strip()
        clean_doc_name = (doc_name or "").strip()

        app_record = db.query(Application).filter(
            Application.application_id == clean_app_id,
            Application.customer_id == customer.customer_id
        ).first()

        if not app_record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Application '{clean_app_id}' not found or access denied."
            )

        doc_meta = None
        if app_record.documents:
            try:
                docs = json.loads(app_record.documents)
                for d in docs:
                    if clean_doc_name.lower() in (d.get("doc_type", "").lower(), d.get("file_name", "").lower()):
                        doc_meta = d
                        break
            except Exception:
                pass

        pdf_bytes = build_application_doc_pdf(app_record, customer, clean_doc_name, doc_meta)
        target_name = (doc_meta and doc_meta.get("file_name")) or f"{clean_doc_name.replace(' ', '_')}.pdf"
        if not target_name.lower().endswith(".pdf"):
            target_name = f"{target_name}.pdf"
        return pdf_bytes, target_name

    @staticmethod
    def download_claim_document(claim_ref: str, customer: Customer, db: Session) -> tuple[bytes, str]:
        """
        Authenticates and downloads the First Notice of Loss (FNOL) Claim Summary for a customer claim.
        """
        clean_ref = (claim_ref or "").strip()
        claim = db.query(Claim).filter(
            (Claim.claim_id == clean_ref) | (Claim.claim_number == clean_ref),
            Claim.customer_id == customer.customer_id
        ).first()

        if not claim:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Claim '{clean_ref}' not found or access denied."
            )

        policy = db.query(Policy).filter(Policy.policy_id == claim.policy_id).first() if claim.policy_id else None
        pdf_bytes = build_claim_pdf(claim, customer, policy)
        filename = f"{claim.claim_number}_Summary.pdf"
        return pdf_bytes, filename

    @staticmethod
    def resolve_document_download(doc_ref: Optional[str], doc_name: Optional[str], customer: Customer, db: Session) -> tuple[bytes, str]:
        """
        Flexible resolver to retrieve a verified document by reference (policy_id/number, app_id, claim_id) or title.
        Strictly enforces customer identity checks.
        """
        import re
        ref = (doc_ref or "").strip()
        name = (doc_name or "").strip()

        # If reference is embedded inside name (e.g. "Homeowners Policy Summary HOM-883920" or "POL-001")
        if not ref and name:
            match = re.search(r'([A-Za-z0-9]+-[A-Za-z0-9-]+)', name)
            if match:
                ref = match.group(1).strip()

        # 1. Try Policy lookup by reference
        if ref:
            pol = db.query(Policy).filter(
                (Policy.policy_id == ref) | (Policy.policy_number == ref) | (Policy.policy_number.ilike(f"%{ref}%")) | (Policy.policy_id.ilike(f"%{ref}%")),
                Policy.customer_id == customer.customer_id
            ).first()
            if pol:
                coverages = db.query(Coverage).filter(Coverage.policy_id == pol.policy_id).all()
                exclusions = db.query(Exclusion).filter(Exclusion.policy_id == pol.policy_id).all()
                return build_policy_pdf(pol, customer, coverages, exclusions), f"{pol.policy_number}.pdf"

        # 2. Try Claim lookup by reference
        if ref:
            clm = db.query(Claim).filter(
                (Claim.claim_id == ref) | (Claim.claim_number == ref) | (Claim.claim_number.ilike(f"%{ref}%")) | (Claim.claim_id.ilike(f"%{ref}%")),
                Claim.customer_id == customer.customer_id
            ).first()
            if clm:
                pol = db.query(Policy).filter(Policy.policy_id == clm.policy_id).first() if clm.policy_id else None
                return build_claim_pdf(clm, customer, pol), f"{clm.claim_number}_Summary.pdf"

        # 3. Try Application document lookup by ID
        if ref and ("APP" in ref.upper()):
            app_rec = db.query(Application).filter(
                (Application.application_id == ref) | (Application.application_id.ilike(f"%{ref}%")),
                Application.customer_id == customer.customer_id
            ).first()
            if app_rec:
                return CustomerService.download_application_document(app_rec.application_id, name or "Application Document", customer, db)

        # 4. Search customer's applications for matching filename/document
        if ref or name:
            target_search = (ref or name).lower()
            apps = db.query(Application).filter(Application.customer_id == customer.customer_id).all()
            for a in apps:
                if a.documents:
                    try:
                        docs = json.loads(a.documents)
                        for d in docs:
                            f_name = d.get("file_name", "").lower()
                            d_type = d.get("doc_type", "").lower()
                            if (target_search in f_name or target_search in d_type or
                                (d_type and d_type in target_search) or (f_name and f_name in target_search)):
                                return CustomerService.download_application_document(a.application_id, d.get("doc_type", name), customer, db)
                    except Exception:
                        pass
            # If application requested generally
            if "app" in target_search or "application" in target_search:
                app_first = db.query(Application).filter(Application.customer_id == customer.customer_id).order_by(Application.created_at.desc()).first()
                if app_first:
                    return CustomerService.download_application_document(app_first.application_id, name or "Application Filing", customer, db)

        # 5. Search customer's policies by policy type match or keywords (e.g. Home, Auto, Umbrella)
        if name or ref:
            search_str = (name or ref).lower()
            pols = db.query(Policy).filter(Policy.customer_id == customer.customer_id).all()
            for p in pols:
                p_type = (p.policy_type or "").lower()
                p_num = (p.policy_number or "").lower()
                # Check keyword overlap (e.g. "homeowners", "auto", "umbrella", "commercial")
                keywords = ["home", "auto", "car", "vehicle", "umbrella", "commercial", "property", "flood"]
                matched_keyword = any(kw in search_str and kw in p_type for kw in keywords)
                if matched_keyword or p_type in search_str or search_str in p_type or p_num in search_str:
                    coverages = db.query(Coverage).filter(Coverage.policy_id == p.policy_id).all()
                    exclusions = db.query(Exclusion).filter(Exclusion.policy_id == p.policy_id).all()
                    return build_policy_pdf(p, customer, coverages, exclusions), f"{p.policy_number}.pdf"

        # 6. Try Claim keyword match
        if name:
            if "claim" in name.lower():
                clm = db.query(Claim).filter(Claim.customer_id == customer.customer_id).order_by(Claim.created_at.desc()).first()
                if clm:
                    pol = db.query(Policy).filter(Policy.policy_id == clm.policy_id).first() if clm.policy_id else None
                    return build_claim_pdf(clm, customer, pol), f"{clm.claim_number}_Summary.pdf"

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or access denied."
        )

    # =========================================================================
    # Persistent Customer AI Chat Operations
    # =========================================================================

    @staticmethod
    def get_customer_ai_context(customer: Customer, db: Session) -> dict:
        """
        Extracts complete, live customer profile, active/historical policies, submitted applications,
        claims, and assigned agent data directly from PostgreSQL for grounded AI intelligence.
        """
        # 1. Profile & Agent
        agent_assignment = db.query(CustomerAgentAssignment).filter(
            CustomerAgentAssignment.customer_id == customer.customer_id
        ).first()
        agent_info = None
        if agent_assignment and agent_assignment.agent_id:
            agent_user = db.query(User).filter(User.user_id == agent_assignment.agent_id).first()
            if agent_user:
                agent_info = {
                    "agent_id": agent_user.user_id,
                    "name": agent_user.name,
                    "email": agent_user.email,
                    "phone": getattr(agent_user, "phone", None) or "(555) 876-5432"
                }

        profile_data = {
            "id": customer.customer_id,
            "name": customer.name,
            "email": customer.email,
            "phone": customer.mobile or "(555) 000-0000",
            "address": customer.address or "124 Grand Avenue, Suite 400, Chicago, IL 60611",
            "assigned_agent": agent_info
        }

        # 2. Policies
        pols = db.query(Policy).filter(Policy.customer_id == customer.customer_id).all()
        policies_data = []
        for p in pols:
            eff_date = str(p.start_date) if p.start_date else (str(p.created_at.date()) if p.created_at else "2024-01-01")
            exp_date = str(p.end_date) if p.end_date else "2027-01-01"
            
            # Primary deductible
            deductible_str = "$500"
            coverages_list = []
            if p.coverages:
                for cov in p.coverages:
                    cov_ded = f"${float(cov.deductible):,.0f}" if (cov.deductible is not None and cov.deductible > 0) else None
                    if cov_ded and deductible_str == "$500":
                        deductible_str = cov_ded
                    coverages_list.append({
                        "name": cov.coverage_name,
                        "limit": f"${float(cov.coverage_limit):,.0f}" if cov.coverage_limit else "N/A",
                        "deductible": cov_ded or "$0"
                    })
            
            exclusions_list = [ex.exclusion_name for ex in (p.exclusions or [])]

            policies_data.append({
                "id": p.policy_id,
                "policy_number": p.policy_number,
                "type": p.policy_type,
                "category": determine_category(p.policy_type),
                "status": p.status or "Active",
                "premium": f"${float(p.premium):,.2f}" if p.premium else "$1,200.00",
                "deductible": deductible_str,
                "effective_date": eff_date,
                "expiry_date": exp_date,
                "coverages": coverages_list,
                "exclusions": exclusions_list
            })

        # 3. Applications
        apps = db.query(Application).filter(Application.customer_id == customer.customer_id).all()
        applications_data = []
        for a in apps:
            docs_parsed = []
            if a.documents:
                try:
                    docs_parsed = json.loads(a.documents) if isinstance(a.documents, str) else a.documents
                except Exception:
                    pass
            applications_data.append({
                "application_id": a.application_id,
                "product_name": a.product_name or a.policy_type,
                "policy_type": a.policy_type,
                "coverage_tier": a.coverage_tier or "Standard",
                "coverage_limit": f"${float(a.coverage_limit):,.0f}" if a.coverage_limit else "N/A",
                "deductible": f"${float(a.deductible):,.0f}" if a.deductible else "N/A",
                "estimated_premium": f"${float(a.estimated_premium):,.2f}" if a.estimated_premium else "N/A",
                "status": a.status or "Pending Review",
                "verification_status": a.verification_status or "Verified",
                "created_at": a.created_at.strftime("%Y-%m-%d %H:%M") if a.created_at else "",
                "documents": docs_parsed,
                "agent_notes": a.agent_notes
            })

        # 4. Claims
        claims_list = db.query(Claim).filter(Claim.customer_id == customer.customer_id).all()
        claims_data = []
        for c in claims_list:
            claims_data.append({
                "id": c.claim_id,
                "claim_number": c.claim_number,
                "policy_id": c.policy_id,
                "incident_date": str(c.incident_date) if c.incident_date else "",
                "incident_type": c.incident_type or "Property Damage",
                "incident_description": c.incident_description or "",
                "status": c.claim_status or "Submitted",
                "estimated_amount": f"${float(c.claim_amount):,.2f}" if c.claim_amount else "$0.00"
            })

        return {
            "profile": profile_data,
            "policies": policies_data,
            "applications": applications_data,
            "claims": claims_data
        }

    @staticmethod
    def _call_ai_service(message: str, customer_id: str, conversation_id: str, history: List[dict], context: Optional[dict] = None) -> str:
        """
        Dispatches prompt + bounded history + live customer context to the standalone AI Service.
        """
        ai_service_url = os.environ.get("AI_SERVICE_URL", "http://insureassist-ai-container:8006")
        endpoint = f"{ai_service_url}/api/v1/ai/customer/chat"
        payload = {
            "message": message,
            "customer_id": customer_id,
            "conversation_id": conversation_id,
            "history": history,
            "context": context or {}
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=45) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                return res_data.get("response", "No response received.")
        except Exception as e:
            logger.error(f"Failed to reach AI service at {endpoint}: {e}")
            return "I apologize, but I am temporarily unable to reach the AI intelligence service. Please check back in a moment or contact your assigned agent."

    @staticmethod
    def list_chat_conversations(customer: Customer, db: Session) -> List[ChatConversationItem]:
        """
        Retrieves all chat conversations for the authenticated customer ordered by last activity.
        """
        conversations = db.query(ChatConversation).filter(
            ChatConversation.customer_id == customer.customer_id
        ).order_by(ChatConversation.updated_at.desc()).all()

        results = []
        for conv in conversations:
            last_msg = db.query(ChatMessage).filter(
                ChatMessage.conversation_id == conv.conversation_id
            ).order_by(ChatMessage.created_at.desc()).first()

            msg_count = db.query(ChatMessage).filter(
                ChatMessage.conversation_id == conv.conversation_id
            ).count()

            snippet = last_msg.message[:60] + "..." if (last_msg and len(last_msg.message) > 60) else (last_msg.message if last_msg else None)

            c_at = (conv.created_at.isoformat() + "Z") if conv.created_at else ""
            u_at = (conv.updated_at.isoformat() + "Z") if conv.updated_at else ""

            results.append(ChatConversationItem(
                conversation_id=conv.conversation_id,
                customer_id=conv.customer_id,
                title=conv.title,
                role=conv.role,
                created_at=c_at,
                updated_at=u_at,
                last_message=snippet,
                message_count=msg_count
            ))
        return results

    @staticmethod
    def create_chat_conversation(customer: Customer, req: CreateConversationRequest, db: Session) -> ChatConversationItem:
        """
        Creates a new persistent conversation for the authenticated customer.
        """
        now = datetime.datetime.utcnow()
        conv_id = f"conv-cust-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        title = req.title.strip() if (req.title and req.title.strip()) else "New Conversation"

        conv = ChatConversation(
            conversation_id=conv_id,
            customer_id=customer.customer_id,
            title=title,
            role="customer",
            created_at=now,
            updated_at=now
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)

        # If an initial message was supplied, process it
        if req.initial_message and req.initial_message.strip():
            CustomerService.send_chat_message(
                SendMessageRequest(message=req.initial_message, conversation_id=conv.conversation_id),
                customer,
                db
            )
            db.refresh(conv)

        c_at = (conv.created_at.isoformat() + "Z") if conv.created_at else ""
        u_at = (conv.updated_at.isoformat() + "Z") if conv.updated_at else ""

        return ChatConversationItem(
            conversation_id=conv.conversation_id,
            customer_id=conv.customer_id,
            title=conv.title,
            role=conv.role,
            created_at=c_at,
            updated_at=u_at,
            last_message=None,
            message_count=db.query(ChatMessage).filter(ChatMessage.conversation_id == conv.conversation_id).count()
        )

    @staticmethod
    def get_conversation_messages(conversation_id: str, customer: Customer, db: Session) -> List[ChatMessageItem]:
        """
        Retrieves all messages for a customer conversation in strict chronological order.
        Strictly prevents cross-customer unauthorized access.
        """
        conv = db.query(ChatConversation).filter(
            ChatConversation.conversation_id == conversation_id,
            ChatConversation.customer_id == customer.customer_id
        ).first()

        if not conv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Conversation '{conversation_id}' not found or access denied."
            )

        messages = db.query(ChatMessage).filter(
            ChatMessage.conversation_id == conversation_id
        ).order_by(ChatMessage.created_at.asc()).all()

        return [
            ChatMessageItem(
                message_id=m.message_id,
                conversation_id=m.conversation_id,
                sender_type=m.sender_type,
                message=m.message,
                created_at=(m.created_at.isoformat() + "Z") if m.created_at else ""
            )
            for m in messages
        ]

    @staticmethod
    def send_chat_message(req: SendMessageRequest, customer: Customer, db: Session) -> CustomerChatResponse:
        """
        1. Finds or creates the customer's persistent conversation.
        2. Persists the user message to PostgreSQL.
        3. Retrieves bounded conversation history (last 8 messages).
        4. Extracts real live customer data from PostgreSQL.
        5. Calls AI Service for grounded LLM answer.
        6. Persists the AI response to PostgreSQL.
        7. Returns the response with conversation metadata.
        """
        now = datetime.datetime.utcnow()
        conv = None

        if req.conversation_id:
            conv = db.query(ChatConversation).filter(
                ChatConversation.conversation_id == req.conversation_id,
                ChatConversation.customer_id == customer.customer_id
            ).first()

        if not conv:
            # Create a new conversation session
            conv_id = req.conversation_id if req.conversation_id and req.conversation_id.startswith("conv-") else f"conv-cust-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
            initial_title = (req.message[:32] + "...") if len(req.message) > 32 else req.message
            conv = ChatConversation(
                conversation_id=conv_id,
                customer_id=customer.customer_id,
                title=initial_title,
                role="customer",
                created_at=now,
                updated_at=now
            )
            db.add(conv)
            db.flush()

        # 1. Persist User Message
        user_msg_id = f"msg-u-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        user_msg = ChatMessage(
            message_id=user_msg_id,
            conversation_id=conv.conversation_id,
            sender_type="user",
            message=req.message,
            created_at=now
        )
        db.add(user_msg)
        db.commit()

        # 2. Retrieve bounded history from PostgreSQL (last 8 messages prior to this user message)
        prior_messages = db.query(ChatMessage).filter(
            ChatMessage.conversation_id == conv.conversation_id,
            ChatMessage.message_id != user_msg_id
        ).order_by(ChatMessage.created_at.desc()).limit(8).all()
        prior_messages.reverse()

        history_payload = [
            {"sender": m.sender_type, "message": m.message}
            for m in prior_messages
        ]

        # 3. Extract Live Customer Context directly from PostgreSQL
        customer_context = CustomerService.get_customer_ai_context(customer, db)

        # 4. Call AI Service (Standalone Groq + Grounding Engine)
        bot_reply = CustomerService._call_ai_service(
            message=req.message,
            customer_id=customer.customer_id,
            conversation_id=conv.conversation_id,
            history=history_payload,
            context=customer_context
        )

        # 5. Persist AI Response Message
        bot_time = datetime.datetime.utcnow()
        bot_msg_id = f"msg-b-{bot_time.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        bot_msg = ChatMessage(
            message_id=bot_msg_id,
            conversation_id=conv.conversation_id,
            sender_type="bot",
            message=bot_reply,
            created_at=bot_time
        )
        db.add(bot_msg)

        # Update conversation timestamp & title if default
        conv.updated_at = bot_time
        if conv.title in ("New Conversation", "New Chat") or len(conv.title) <= 3:
            conv.title = (req.message[:32] + "...") if len(req.message) > 32 else req.message

        db.commit()

        return CustomerChatResponse(
            conversation_id=conv.conversation_id,
            title=conv.title,
            response=bot_reply,
            message_id=bot_msg_id,
            created_at=bot_time.isoformat() + "Z"
        )

    @staticmethod
    def delete_chat_conversation(conversation_id: str, customer: Customer, db: Session) -> dict:
        """
        Deletes a conversation and all its messages.
        """
        conv = db.query(ChatConversation).filter(
            ChatConversation.conversation_id == conversation_id,
            ChatConversation.customer_id == customer.customer_id
        ).first()

        if not conv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Conversation '{conversation_id}' not found or access denied."
            )

        db.delete(conv)
        db.commit()
        return {"success": True, "detail": "Conversation deleted successfully."}

    @staticmethod
    def explain_glossary_term(req: GlossaryExplainRequest, customer: Customer, db: Session) -> GlossaryExplainResponse:
        """
        Retrieves live customer context from PostgreSQL and forwards glossary explanation request to AI Service.
        """
        customer_context = CustomerService.get_customer_ai_context(customer, db)
        ai_service_url = os.environ.get("AI_SERVICE_URL", "http://insureassist-ai-container:8006")
        endpoint = f"{ai_service_url}/api/v1/ai/customer/glossary/explain"

        payload = {
            "term": req.term,
            "definition": req.definition,
            "custom_question": req.custom_question,
            "context": customer_context
        }
        data = json.dumps(payload).encode("utf-8")
        req_obj = urllib.request.Request(
            endpoint,
            data=data,
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req_obj, timeout=30) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                return GlossaryExplainResponse(
                    term=res_data.get("term", req.term),
                    simplified_explanation=res_data.get("simplified_explanation", req.definition or f"Explanation of {req.term}"),
                    example=res_data.get("example", f"For example, in standard insurance, {req.term.lower()} is a key contract term."),
                    your_policy_context=res_data.get("your_policy_context", ""),
                    key_takeaways=res_data.get("key_takeaways", [])
                )
        except Exception as e:
            logger.error(f"Failed to reach AI service for glossary explanation at {endpoint}: {e}")
            return GlossaryExplainResponse(
                term=req.term,
                simplified_explanation=req.definition or f"An essential insurance term relating to {req.term.lower()}.",
                example=f"In standard Property & Casualty insurance, {req.term.lower()} establishes specific rights and responsibilities on covered claims.",
                your_policy_context="",
                key_takeaways=[
                    f"Check your policy declarations page to see how {req.term.lower()} applies to your coverage.",
                    "Contact your assigned insurance agent for assistance."
                ]
            )

    @staticmethod
    def check_coverage(req: CoverageCheckRequest, customer: Customer, db: Session) -> CoverageCheckResponse:
        """
        Retrieves live customer policy/coverage/deductible/exclusion context from PostgreSQL
        and evaluates scenario through AI Service.
        """
        customer_context = CustomerService.get_customer_ai_context(customer, db)
        ai_service_url = os.environ.get("AI_SERVICE_URL", "http://insureassist-ai-container:8006")
        endpoint = f"{ai_service_url}/api/v1/ai/customer/coverage/check"

        payload = {
            "scenario": req.scenario,
            "context": customer_context
        }
        data = json.dumps(payload).encode("utf-8")
        req_obj = urllib.request.Request(
            endpoint,
            data=data,
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req_obj, timeout=30) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                return CoverageCheckResponse(
                    scenario=res_data.get("scenario", req.scenario),
                    assessment=res_data.get("assessment", "Requires Policy Review"),
                    status_description=res_data.get("status_description", "Coverage assessment based on active policy records."),
                    reason=res_data.get("reason", "Please check your declarations page for peril details."),
                    relevant_policy=res_data.get("relevant_policy"),
                    relevant_coverage=res_data.get("relevant_coverage"),
                    relevant_exclusion=res_data.get("relevant_exclusion"),
                    applicable_deductible=res_data.get("applicable_deductible"),
                    recommended_action=res_data.get("recommended_action", "Contact your assigned agent for full policy verification.")
                )
        except Exception as e:
            logger.error(f"Failed to reach AI service for coverage evaluation at {endpoint}: {e}")
            return CoverageCheckResponse(
                scenario=req.scenario,
                assessment="Requires Policy Review",
                status_description="Temporary AI service interruption. Please review your active policy binder or contact your assigned agent.",
                reason="Unable to connect to real-time AI evaluation service at this moment.",
                relevant_policy=None,
                relevant_coverage=None,
                relevant_exclusion=None,
                applicable_deductible=None,
                recommended_action="Contact your assigned insurance agent to confirm coverage."
            )






