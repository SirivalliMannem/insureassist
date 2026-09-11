
import datetime
import random
import re
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.customer import Customer, Policy, Coverage, Exclusion, Claim, RenewalRequest, Notification
from app.schemas.customer import (
    CustomerProfileResponse,
    PolicySummaryResponse,
    ClaimSummaryResponse,
    FNOLSubmissionRequest,
    FNOLSubmissionResponse,
    RenewalCreationRequest,
    RenewalResponse,
    RenewalApprovalResponse,
    NotificationResponse
)


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
    def get_profile(customer: Customer, db: Session) -> CustomerProfileResponse:
        """
        Retrieves profile and aggregated counts for the authenticated customer from PostgreSQL.
        """
        active_policies_count = db.query(Policy).filter(
            Policy.customer_id == customer.customer_id,
            Policy.status.ilike("Active")
        ).count()

        open_claims_count = db.query(Claim).filter(
            Claim.customer_id == customer.customer_id,
            Claim.claim_status.notin_(["Closed", "Rejected", "Settled"])
        ).count()

        return CustomerProfileResponse(
            id=customer.customer_id,
            name=customer.name,
            email=customer.email,
            phone=customer.mobile or "(555) 000-0000",
            address=customer.address or "124 Grand Avenue, Suite 400, Chicago, IL 60611",
            active_policies_count=active_policies_count,
            open_claims_count=open_claims_count
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

