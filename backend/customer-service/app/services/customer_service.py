
import datetime
import json
import random
import re
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.customer import Customer, Policy, Coverage, Exclusion, Claim, RenewalRequest, Notification, Application, CustomerAgentAssignment, User
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
    CustomerAssignedAgentResponse
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


