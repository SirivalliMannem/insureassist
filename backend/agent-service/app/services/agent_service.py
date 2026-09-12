import logging
import datetime
from typing import List, Optional, Dict
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.agent import (
    User,
    Customer,
    Policy,
    Coverage,
    Exclusion,
    Claim,
    RenewalRequest,
    Notification,
    CustomerAgentAssignment
)
from app.schemas.agent import (
    AgentProfileResponse,
    AgentDashboardResponse,
    AgentCustomerResponse,
    AgentCustomersListResponse,
    AgentPolicyResponse,
    AgentPoliciesListResponse,
    PremiumByTypeItem,
    AgentDashboardCustomerItem,
    AgentDashboardRenewalItem,
    AgentPolicyDetailResponse,
    CoverageItem,
    ExclusionItem,
    ClaimItem,
    RenewalItem,
    ReminderResponse
)

logger = logging.getLogger(__name__)


def map_policy_category(policy_type: str) -> str:
    """Helper to categorize policy types for UI filtering."""
    pt = (policy_type or "").lower()
    if any(k in pt for k in ["home", "property", "renter", "dwelling", "fire", "flood"]):
        return "Property"
    elif any(k in pt for k in ["auto", "vehicle", "motor", "car", "fleet"]):
        return "Vehicle"
    elif any(k in pt for k in ["commercial", "business", "cyber", "liability", "workers"]):
        return "Commercial"
    elif any(k in pt for k in ["umbrella", "watercraft", "specialty", "life", "health", "marine"]):
        return "Specialty"
    return "General"


class AgentService:
    """
    Business logic service for Agent operations, portfolio querying,
    and dashboard metrics from PostgreSQL.
    """

    @staticmethod
    def get_profile(agent_user: User) -> AgentProfileResponse:
        """
        Extracts Agent profile information from the PostgreSQL 'users' record.
        """
        return AgentProfileResponse(
            user_id=str(agent_user.user_id),
            name=agent_user.name,
            email=agent_user.email,
            role=agent_user.role
        )

    @staticmethod
    def _get_assigned_customer_ids(agent_user: User, db: Session) -> List[str]:
        """
        Helper to fetch customer IDs assigned to the authenticated agent.
        """
        assignments = db.query(CustomerAgentAssignment.customer_id).filter(
            CustomerAgentAssignment.agent_id == str(agent_user.user_id),
            CustomerAgentAssignment.status == "Active"
        ).all()
        return [r[0] for r in assignments]

    @staticmethod
    def get_dashboard(agent_user: User, db: Session) -> AgentDashboardResponse:
        """
        Calculates agent dashboard summary metrics from PostgreSQL for the authenticated agent.
        """
        agent_id_str = str(agent_user.user_id)
        assigned_cust_ids = AgentService._get_assigned_customer_ids(agent_user, db)

        if not assigned_cust_ids:
            return AgentDashboardResponse(
                agent_id=agent_id_str,
                name=agent_user.name,
                email=agent_user.email,
                total_assigned_customers=0,
                total_policies=0,
                active_policies_count=0,
                expired_policies_count=0,
                pending_renewals_count=0,
                total_claims_count=0,
                pending_claims_count=0,
                approved_claims_count=0,
                rejected_claims_count=0,
                annual_premium_portfolio=0.0,
                formatted_annual_premium="$0",
                premium_by_type=[],
                assigned_customers=[],
                assigned_renewals=[],
                assignment_data_available=True,
                note=f"No client accounts are currently assigned to Agent {agent_user.name} (ID: {agent_id_str}) in PostgreSQL."
            )

        today = datetime.date.today()

        # 1. Fetch Customers
        customers = db.query(Customer).filter(Customer.customer_id.in_(assigned_cust_ids)).all()
        total_assigned_customers = len(customers)

        # 2. Fetch Policies
        policies = db.query(Policy).filter(Policy.customer_id.in_(assigned_cust_ids)).all()
        total_policies = len(policies)
        active_policies = [p for p in policies if (p.status or "").lower() == "active"]
        active_policies_count = len(active_policies)
        expired_policies = [p for p in policies if (p.status or "").lower() in ["expired", "cancelled", "inactive"]]
        expired_policies_count = len(expired_policies)

        # 3. Calculate Financial Metrics
        annual_premium_portfolio = sum(float(p.premium or 0.0) for p in active_policies)
        formatted_annual_premium = f"${annual_premium_portfolio:,.2f}"

        # 4. Premium Distribution by Policy Type (for Chart)
        type_agg: Dict[str, Dict] = {}
        for p in active_policies:
            pt = p.policy_type or "Standard Policy"
            prem = float(p.premium or 0.0)
            if pt not in type_agg:
                type_agg[pt] = {
                    "policy_type": pt,
                    "category": map_policy_category(pt),
                    "total_premium": 0.0,
                    "count": 0
                }
            type_agg[pt]["total_premium"] += prem
            type_agg[pt]["count"] += 1

        premium_by_type_list: List[PremiumByTypeItem] = []
        for pt, data in type_agg.items():
            pct = round((data["total_premium"] / annual_premium_portfolio * 100), 1) if annual_premium_portfolio > 0 else 0.0
            premium_by_type_list.append(PremiumByTypeItem(
                policy_type=data["policy_type"],
                category=data["category"],
                total_premium=round(data["total_premium"], 2),
                formatted_premium=f"${data['total_premium']:,.2f}",
                count=data["count"],
                percentage=pct
            ))
        premium_by_type_list.sort(key=lambda x: x.total_premium, reverse=True)

        # 5. Fetch Renewal Requests & 30-Day Approaching Expiry Policies
        assigned_renewals_list = AgentService._build_agent_renewals_list(assigned_cust_ids, db)
        pending_renewals_count = len([r for r in assigned_renewals_list if (r.status or "").lower() == "pending approval"])

        # 6. Fetch Claims
        claims = db.query(Claim).filter(Claim.customer_id.in_(assigned_cust_ids)).all()
        total_claims_count = len(claims)
        pending_claims_count = len([c for c in claims if (c.claim_status or "").lower() in ["under review", "pending", "open", "investigating"]])
        approved_claims_count = len([c for c in claims if (c.claim_status or "").lower() in ["approved", "settled", "closed · settled"]])
        rejected_claims_count = len([c for c in claims if (c.claim_status or "").lower() in ["denied", "rejected", "closed"]])

        # 7. Build Assigned Customers Summary
        cust_policy_map: Dict[str, List[Policy]] = {}
        for p in policies:
            cid = str(p.customer_id)
            cust_policy_map.setdefault(cid, []).append(p)

        assigned_customers_list: List[AgentDashboardCustomerItem] = []
        for c in customers:
            c_pols = cust_policy_map.get(str(c.customer_id), [])
            c_active = [p for p in c_pols if (p.status or "").lower() == "active"]
            
            # Find earliest upcoming renewal
            upcoming_dates = [p.end_date for p in c_pols if p.end_date and p.end_date >= today]
            next_date = min(upcoming_dates) if upcoming_dates else None
            days_str = f"{(next_date - today).days} days" if next_date else "N/A"

            assigned_customers_list.append(AgentDashboardCustomerItem(
                customer_id=str(c.customer_id),
                name=c.name,
                email=c.email,
                phone=c.mobile,
                total_policies=len(c_pols),
                active_policies=len(c_active),
                next_renewal=days_str,
                renewal_date=str(next_date) if next_date else None
            ))

        return AgentDashboardResponse(
            agent_id=agent_id_str,
            name=agent_user.name,
            email=agent_user.email,
            total_assigned_customers=total_assigned_customers,
            total_policies=total_policies,
            active_policies_count=active_policies_count,
            expired_policies_count=expired_policies_count,
            pending_renewals_count=pending_renewals_count,
            total_claims_count=total_claims_count,
            pending_claims_count=pending_claims_count,
            approved_claims_count=approved_claims_count,
            rejected_claims_count=rejected_claims_count,
            annual_premium_portfolio=annual_premium_portfolio,
            formatted_annual_premium=formatted_annual_premium,
            premium_by_type=premium_by_type_list,
            assigned_customers=assigned_customers_list,
            assigned_renewals=assigned_renewals_list,
            assignment_data_available=True,
            note=f"Real PostgreSQL portfolio analytics calculated for Agent {agent_user.name}."
        )

    @staticmethod
    def get_customers(agent_user: User, db: Session) -> AgentCustomersListResponse:
        """
        Retrieves full customer directory assigned to the authenticated Agent from PostgreSQL.
        """
        assigned_cust_ids = AgentService._get_assigned_customer_ids(agent_user, db)
        if not assigned_cust_ids:
            return AgentCustomersListResponse(
                customers=[],
                total=0,
                assignment_data_available=True,
                message=f"No customer accounts assigned to Agent {agent_user.name}."
            )

        customers = db.query(Customer).filter(Customer.customer_id.in_(assigned_cust_ids)).all()
        policies = db.query(Policy).filter(Policy.customer_id.in_(assigned_cust_ids)).all()
        claims = db.query(Claim).filter(Claim.customer_id.in_(assigned_cust_ids)).all()

        cust_policy_map: Dict[str, List[Policy]] = {}
        for p in policies:
            cust_policy_map.setdefault(str(p.customer_id), []).append(p)

        cust_claims_map: Dict[str, List[Claim]] = {}
        for cl in claims:
            cust_claims_map.setdefault(str(cl.customer_id), []).append(cl)

        today = datetime.date.today()
        result_customers: List[AgentCustomerResponse] = []
        for c in customers:
            c_pols = cust_policy_map.get(str(c.customer_id), [])
            c_claims = cust_claims_map.get(str(c.customer_id), [])
            c_active = [p for p in c_pols if (p.status or "").lower() == "active"]
            upcoming_dates = [p.end_date for p in c_pols if p.end_date and p.end_date >= today]
            next_date = min(upcoming_dates) if upcoming_dates else None
            days_str = f"{(next_date - today).days} days" if next_date else "N/A"

            # Build full policy list for customer
            pols_response = []
            for p in c_pols:
                p_prem = float(p.premium or 0.0)
                pols_response.append(AgentPolicyResponse(
                    policy_id=str(p.policy_id),
                    policy_number=p.policy_number,
                    policy_type=p.policy_type,
                    category=map_policy_category(p.policy_type),
                    customer_id=str(c.customer_id),
                    customer_name=c.name,
                    status=p.status,
                    premium=f"${p_prem:,.2f}",
                    premium_amount=p_prem,
                    deductible="Collision $500 · Comp $250" if "auto" in (p.policy_type or "").lower() else "All Perils $1,000",
                    start_date=str(p.start_date) if p.start_date else None,
                    end_date=str(p.end_date) if p.end_date else None,
                    expiry_date=str(p.end_date) if p.end_date else None
                ))

            # Build claims list for customer
            claims_response = []
            for cl in c_claims:
                cl_amt = float(cl.claim_amount or 0.0)
                claims_response.append({
                    "id": cl.claim_number or str(cl.claim_id),
                    "claim_id": str(cl.claim_id),
                    "policy_id": str(cl.policy_id),
                    "type": cl.incident_type or "Property Loss",
                    "date": str(cl.incident_date) if cl.incident_date else "Recent",
                    "amount": f"${cl_amt:,.2f}",
                    "status": cl.claim_status,
                    "desc": cl.incident_description or "Insurance claim filed."
                })

            result_customers.append(AgentCustomerResponse(
                customer_id=str(c.customer_id),
                name=c.name,
                email=c.email,
                mobile=c.mobile,
                phone=c.mobile,
                address=c.address,
                total_policies=len(c_pols),
                active_policies=len(c_active),
                next_renewal=days_str,
                renewal_date=str(next_date) if next_date else None,
                policies=pols_response,
                claims=claims_response
            ))

        return AgentCustomersListResponse(
            customers=result_customers,
            total=len(result_customers),
            assignment_data_available=True,
            message="Assigned customer directory retrieved successfully from PostgreSQL."
        )

    @staticmethod
    def get_policies(agent_user: User, db: Session) -> AgentPoliciesListResponse:
        """
        Retrieves full policy book assigned to the authenticated Agent from PostgreSQL.
        """
        assigned_cust_ids = AgentService._get_assigned_customer_ids(agent_user, db)
        if not assigned_cust_ids:
            return AgentPoliciesListResponse(
                policies=[],
                total=0,
                assignment_data_available=True,
                message=f"No customer policies assigned to Agent {agent_user.name}."
            )

        policies = db.query(Policy).filter(Policy.customer_id.in_(assigned_cust_ids)).all()
        customers = db.query(Customer).filter(Customer.customer_id.in_(assigned_cust_ids)).all()
        cust_name_map = {str(c.customer_id): c.name for c in customers}

        result_policies: List[AgentPolicyResponse] = []
        for p in policies:
            c_name = cust_name_map.get(str(p.customer_id), "Policyholder")
            prem_num = float(p.premium or 0.0)
            result_policies.append(AgentPolicyResponse(
                policy_id=str(p.policy_id),
                policy_number=p.policy_number,
                policy_type=p.policy_type,
                category=map_policy_category(p.policy_type),
                customer_id=str(p.customer_id),
                customer_name=c_name,
                status=p.status,
                premium=f"${prem_num:,.2f}",
                premium_amount=prem_num,
                deductible="Collision $500 · Comp $250" if "auto" in (p.policy_type or "").lower() else "All Perils $1,000",
                start_date=str(p.start_date) if p.start_date else None,
                end_date=str(p.end_date) if p.end_date else None,
                expiry_date=str(p.end_date) if p.end_date else None
            ))

        return AgentPoliciesListResponse(
            policies=result_policies,
            total=len(result_policies),
            assignment_data_available=True,
            message="Assigned customer policies retrieved successfully from PostgreSQL."
        )

    @staticmethod
    def _build_agent_renewals_list(assigned_cust_ids: List[str], db: Session) -> List[AgentDashboardRenewalItem]:
        """
        Combines (1) real RenewalRequests in DB for assigned customers,
        and (2) active policies of assigned customers expiring within the next 30 days.
        Sorted by days_until_expiry ascending (nearest renewal first).
        """
        if not assigned_cust_ids:
            return []

        today = datetime.date.today()
        thirty_days_later = today + datetime.timedelta(days=30)

        # 1. Real renewal requests from DB for assigned customers
        renewals = db.query(RenewalRequest).filter(RenewalRequest.customer_id.in_(assigned_cust_ids)).all()

        result: List[AgentDashboardRenewalItem] = []
        handled_policy_ids = set()

        for r in renewals:
            days = None
            if r.renewal_date:
                days = (r.renewal_date - today).days
            result.append(AgentDashboardRenewalItem(
                renewal_id=str(r.renewal_id),
                policy_id=str(r.policy_id),
                policy_number=r.policy_number,
                policy_type=r.policy_type,
                customer_name=r.customer_name,
                renewal_date=str(r.renewal_date) if r.renewal_date else None,
                renewal_premium=float(r.renewal_premium) if r.renewal_premium else None,
                days_until_expiry=days,
                status=r.status
            ))
            if r.policy_id:
                handled_policy_ids.add(str(r.policy_id))

        # 2. Active policies expiring within next 30 days
        policies = db.query(Policy).filter(Policy.customer_id.in_(assigned_cust_ids)).all()
        customers = db.query(Customer).filter(Customer.customer_id.in_(assigned_cust_ids)).all()
        cust_map = {str(c.customer_id): c for c in customers}

        for p in policies:
            if (p.status or "").lower() == "active" and p.end_date and str(p.policy_id) not in handled_policy_ids:
                if today <= p.end_date <= thirty_days_later:
                    cust = cust_map.get(str(p.customer_id))
                    c_name = cust.name if cust else "Assigned Customer"
                    days_left = (p.end_date - today).days
                    result.append(AgentDashboardRenewalItem(
                        renewal_id=None,
                        policy_id=str(p.policy_id),
                        policy_number=p.policy_number,
                        policy_type=p.policy_type,
                        customer_name=c_name,
                        renewal_date=str(p.end_date),
                        renewal_premium=float(p.premium) if p.premium else None,
                        days_until_expiry=days_left,
                        status="Approaching Expiry"
                    ))
                    handled_policy_ids.add(str(p.policy_id))

        # 3. Check for existing reminder notifications in PostgreSQL
        reminder_notifs = db.query(Notification).filter(
            Notification.recipient_role == "Customer",
            Notification.status == "Reminder Sent"
        ).order_by(Notification.created_at.desc()).all()

        reminder_map = {}
        for n in reminder_notifs:
            if n.policy_id and str(n.policy_id) not in reminder_map:
                reminder_map[str(n.policy_id)] = n.created_at.strftime("%b %d, %Y") if n.created_at else "Sent"

        for item in result:
            if item.policy_id in reminder_map:
                item.reminder_sent = True
                item.reminder_sent_at = reminder_map[item.policy_id]

        # Sort by days remaining (soonest first)
        result.sort(key=lambda x: x.days_until_expiry if x.days_until_expiry is not None else 9999)
        return result

    @staticmethod
    def get_renewals(agent_user: User, db: Session) -> List[AgentDashboardRenewalItem]:
        """
        Retrieves all renewal items (real renewal requests + 30-day approaching expirations)
        for the authenticated Agent's assigned customers.
        """
        assigned_cust_ids = AgentService._get_assigned_customer_ids(agent_user, db)
        return AgentService._build_agent_renewals_list(assigned_cust_ids, db)

    @staticmethod
    def send_renewal_reminder(policy_id: str, agent_user: User, db: Session) -> ReminderResponse:
        """
        Agent sends a renewal reminder to the assigned customer for their expiring policy.
        Persists a Notification record in PostgreSQL for the Customer.
        """
        assigned_cust_ids = AgentService._get_assigned_customer_ids(agent_user, db)

        # 1. Find policy
        policy = db.query(Policy).filter(
            (Policy.policy_id == policy_id) | (Policy.policy_number == policy_id)
        ).first()

        if not policy:
            raise HTTPException(status_code=404, detail="Policy record not found in database.")

        if str(policy.customer_id) not in assigned_cust_ids:
            raise HTTPException(status_code=403, detail="Policy does not belong to an assigned customer of this agent.")

        customer = db.query(Customer).filter(Customer.customer_id == policy.customer_id).first()
        customer_name = customer.name if customer else "Customer"

        now = datetime.datetime.utcnow()
        notif_id = f"NOTIF-REM-{policy.policy_id}-{int(now.timestamp())}"
        formatted_date = str(policy.end_date) if policy.end_date else "upcoming date"

        reminder_msg = (
            f"Dear {customer_name}, your {policy.policy_type} insurance policy ({policy.policy_number}) "
            f"is expiring on {formatted_date}. Your dedicated agent {agent_user.name} has sent this reminder "
            f"to help you review terms and ensure uninterrupted coverage."
        )

        notif = Notification(
            notification_id=notif_id,
            recipient_role="Customer",
            recipient_id=str(customer.customer_id),
            title=f"Renewal Reminder: {policy.policy_type} Policy",
            message=reminder_msg,
            policy_id=str(policy.policy_id),
            policy_number=policy.policy_number,
            policy_type=policy.policy_type,
            customer_name=customer_name,
            renewal_date=policy.end_date,
            renewal_premium=policy.premium,
            status="Reminder Sent",
            is_read=False,
            created_at=now
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)

        logger.info(f"Renewal reminder {notif_id} recorded in PostgreSQL for customer {customer_name} ({policy.policy_number}) by Agent {agent_user.name}")

        return ReminderResponse(
            success=True,
            notification_id=notif_id,
            recipient_name=customer_name,
            policy_number=policy.policy_number,
            message=f"Renewal reminder successfully sent to {customer_name} for policy {policy.policy_number}.",
            sent_at=now.strftime("%b %d, %Y")
        )

    @staticmethod
    def approve_renewal(renewal_id: str, agent_user: User, db: Session) -> dict:
        """
        Agent approves a customer renewal request, updates status in PostgreSQL, and extends policy term.
        """
        renewal = db.query(RenewalRequest).filter(
            (RenewalRequest.renewal_id == renewal_id) | (RenewalRequest.policy_id == renewal_id)
        ).first()

        if not renewal:
            raise HTTPException(status_code=404, detail="Renewal request not found.")

        renewal.status = "Approved"
        renewal.updated_at = datetime.datetime.utcnow()

        policy = db.query(Policy).filter(Policy.policy_id == renewal.policy_id).first()
        extended_str = None
        if policy and policy.end_date:
            policy.end_date = policy.end_date + datetime.timedelta(days=365)
            policy.status = "Active"
            extended_str = str(policy.end_date)

        # Create confirmation notification for customer
        notif = Notification(
            notification_id=f"NOTIF-{int(datetime.datetime.utcnow().timestamp())}",
            recipient_role="Customer",
            recipient_id=renewal.customer_id,
            title="Policy Renewal Approved",
            message=f"Your {renewal.policy_type} policy ({renewal.policy_number}) renewal has been approved by Agent {agent_user.name}.",
            notification_type="renewal_approved",
            reference_id=str(renewal.renewal_id),
            is_read=False,
            created_at=datetime.datetime.utcnow()
        )
        db.add(notif)
        db.commit()

        return {
            "renewal_id": str(renewal.renewal_id),
            "status": "Approved",
            "message": f"Renewal for {renewal.policy_number} has been approved successfully.",
            "extended_until": extended_str
        }

    @staticmethod
    def get_policy_detail(policy_id_or_number: str, agent_user: User, db: Session) -> Optional[AgentPolicyDetailResponse]:
        """
        Retrieves real PostgreSQL detailed record for a policy belonging to an assigned customer,
        including real coverages, exclusions, claims, and renewal status.
        """
        assigned_cust_ids = AgentService._get_assigned_customer_ids(agent_user, db)
        if not assigned_cust_ids:
            return None

        policy = db.query(Policy).filter(
            (Policy.policy_id == policy_id_or_number) | (Policy.policy_number == policy_id_or_number),
            Policy.customer_id.in_(assigned_cust_ids)
        ).first()

        if not policy:
            return None

        customer = db.query(Customer).filter(Customer.customer_id == policy.customer_id).first()
        coverages = db.query(Coverage).filter(Coverage.policy_id == policy.policy_id).all()
        exclusions = db.query(Exclusion).filter(Exclusion.policy_id == policy.policy_id).all()
        claims = db.query(Claim).filter(Claim.policy_id == policy.policy_id).all()
        renewals = db.query(RenewalRequest).filter(RenewalRequest.policy_id == policy.policy_id).all()

        c_name = customer.name if customer else "Policyholder"
        c_email = customer.email if customer else None
        c_phone = customer.mobile if customer else None
        prem_num = float(policy.premium or 0.0)

        cov_list = []
        for cov in coverages:
            lim = float(cov.coverage_limit) if cov.coverage_limit is not None else None
            ded = float(cov.deductible) if cov.deductible is not None else None
            cov_list.append(CoverageItem(
                coverage_id=str(cov.coverage_id),
                coverage_name=cov.coverage_name,
                coverage_limit=lim,
                formatted_limit=f"${lim:,.2f}" if lim is not None else "Not available",
                deductible=ded,
                formatted_deductible=f"${ded:,.2f}" if ded is not None else "Not available",
                status=cov.status
            ))

        excl_list = []
        for ex in exclusions:
            excl_list.append(ExclusionItem(
                exclusion_id=str(ex.exclusion_id),
                exclusion_name=ex.exclusion_name,
                description=ex.description
            ))

        cl_list = []
        for cl in claims:
            amt = float(cl.claim_amount) if cl.claim_amount is not None else None
            cl_list.append(ClaimItem(
                claim_id=str(cl.claim_id),
                claim_number=cl.claim_number,
                incident_date=str(cl.incident_date) if cl.incident_date else None,
                incident_type=cl.incident_type,
                incident_description=cl.incident_description,
                location=cl.location,
                claim_status=cl.claim_status,
                claim_amount=amt,
                formatted_amount=f"${amt:,.2f}" if amt is not None else "Not available"
            ))

        ren_list = []
        for ren in renewals:
            r_prem = float(ren.renewal_premium) if ren.renewal_premium is not None else None
            ren_list.append(RenewalItem(
                renewal_id=str(ren.renewal_id),
                renewal_date=str(ren.renewal_date) if ren.renewal_date else None,
                renewal_premium=r_prem,
                formatted_renewal_premium=f"${r_prem:,.2f}" if r_prem is not None else "Not available",
                status=ren.status
            ))

        return AgentPolicyDetailResponse(
            policy_id=str(policy.policy_id),
            policy_number=policy.policy_number,
            policy_type=policy.policy_type,
            category=map_policy_category(policy.policy_type),
            status=policy.status,
            start_date=str(policy.start_date) if policy.start_date else None,
            end_date=str(policy.end_date) if policy.end_date else None,
            premium=f"${prem_num:,.2f}/yr" if prem_num > 0 else "Not available",
            premium_amount=prem_num,
            customer_id=str(policy.customer_id),
            customer_name=c_name,
            customer_email=c_email,
            customer_phone=c_phone,
            coverages=cov_list,
            exclusions=excl_list,
            claims=cl_list,
            renewals=ren_list
        )

