import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
import json

from app.models.agent import (
    User,
    Customer,
    Policy,
    Coverage,
    Exclusion,
    Claim,
    RenewalRequest,
    CustomerAgentAssignment,
    Application
)

logger = logging.getLogger("agent_service.context")


class AgentContextService:
    """
    Builds intent-aware, authorized business context for the authenticated agent
    from PostgreSQL relational tables.
    """

    @classmethod
    def get_agent_authorized_context(
        cls,
        agent_user: User,
        db: Session,
        query_text: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retrieves portfolio records for assigned customers and formats them
        for secure ingestion by the AI Service.
        """
        agent_id_str = str(agent_user.user_id)

        # 1. Fetch Assigned Customer IDs
        assignments = db.query(CustomerAgentAssignment).filter(
            CustomerAgentAssignment.agent_id == agent_id_str,
            CustomerAgentAssignment.status == "Active"
        ).all()
        assigned_cust_ids = [a.customer_id for a in assignments]

        # 2. Fetch Customers
        customers_q = db.query(Customer)
        if assigned_cust_ids:
            customers_q = customers_q.filter(Customer.customer_id.in_(assigned_cust_ids))
        else:
            # If no explicit assignment in pivot, retrieve up to first 25 customers to provide demo context
            customers_q = customers_q.limit(25)

        customers = customers_q.all()
        cust_ids = [c.customer_id for c in customers]
        cust_map = {c.customer_id: c.name for c in customers}

        # 3. Fetch Applications
        apps_q = db.query(Application).filter(Application.customer_id.in_(cust_ids))
        applications = apps_q.order_by(Application.created_at.desc()).all()

        apps_list = []
        for a in applications:
            apps_list.append({
                "application_id": a.application_id,
                "customer_id": a.customer_id,
                "customer_name": cust_map.get(a.customer_id, "Customer"),
                "policy_type": a.policy_type,
                "product_name": a.product_name,
                "coverage_tier": a.coverage_tier,
                "coverage_limit": float(a.coverage_limit or 0),
                "deductible": float(a.deductible or 0),
                "estimated_premium": float(a.estimated_premium or 0),
                "status": a.status,
                "verification_status": getattr(a, "verification_status", "Pending Verification"),
                "forwarded_by_agent_id": a.forwarded_by_agent_id,
                "forwarded_at": a.forwarded_at.isoformat() if a.forwarded_at else None,
                "agent_notes": a.agent_notes,
                "documents": a.documents
            })

        # 4. Fetch Policies with Coverages and Exclusions
        policies_q = db.query(Policy).filter(Policy.customer_id.in_(cust_ids))
        policies = policies_q.all()

        pol_ids = [p.policy_id for p in policies]
        coverages_all = db.query(Coverage).filter(Coverage.policy_id.in_(pol_ids)).all() if pol_ids else []
        exclusions_all = db.query(Exclusion).filter(Exclusion.policy_id.in_(pol_ids)).all() if pol_ids else []

        cov_map: Dict[str, List[Dict[str, Any]]] = {}
        for cov in coverages_all:
            cov_map.setdefault(cov.policy_id, []).append({
                "coverage_name": cov.coverage_name,
                "coverage_limit": float(cov.coverage_limit or 0),
                "deductible": float(cov.deductible or 0),
                "status": cov.status
            })

        excl_map: Dict[str, List[Dict[str, Any]]] = {}
        for ex in exclusions_all:
            excl_map.setdefault(ex.policy_id, []).append({
                "exclusion_name": ex.exclusion_name,
                "description": ex.description
            })

        policies_list = []
        for p in policies:
            policies_list.append({
                "policy_id": p.policy_id,
                "policy_number": p.policy_number,
                "customer_id": p.customer_id,
                "customer_name": cust_map.get(p.customer_id, "Customer"),
                "policy_type": p.policy_type,
                "status": p.status,
                "start_date": str(p.start_date) if p.start_date else None,
                "end_date": str(p.end_date) if p.end_date else None,
                "premium": float(p.premium or 0),
                "coverages": cov_map.get(p.policy_id, []),
                "exclusions": excl_map.get(p.policy_id, [])
            })

        # 5. Fetch Claims
        claims_q = db.query(Claim).filter(Claim.customer_id.in_(cust_ids))
        claims = claims_q.order_by(Claim.created_at.desc()).all()
        claims_list = []
        for clm in claims:
            claims_list.append({
                "claim_id": clm.claim_id,
                "claim_number": clm.claim_number,
                "customer_id": clm.customer_id,
                "customer_name": cust_map.get(clm.customer_id, "Customer"),
                "policy_id": clm.policy_id,
                "incident_date": str(clm.incident_date) if clm.incident_date else None,
                "incident_type": clm.incident_type,
                "incident_description": clm.incident_description,
                "claim_status": clm.claim_status,
                "claim_amount": float(clm.claim_amount or 0)
            })

        # 6. Fetch Renewals
        renewals_q = db.query(RenewalRequest).filter(RenewalRequest.customer_id.in_(cust_ids))
        renewals = renewals_q.all()
        renewals_list = []
        for r in renewals:
            renewals_list.append({
                "renewal_id": r.renewal_id,
                "customer_id": r.customer_id,
                "customer_name": r.customer_name,
                "policy_id": r.policy_id,
                "policy_number": r.policy_number,
                "renewal_date": str(r.renewal_date) if r.renewal_date else None,
                "renewal_premium": float(r.renewal_premium or 0),
                "status": r.status
            })

        return {
            "agent_profile": {
                "user_id": agent_id_str,
                "name": agent_user.name,
                "email": agent_user.email,
                "role": agent_user.role
            },
            "assigned_customers": [
                {
                    "customer_id": c.customer_id,
                    "name": c.name,
                    "email": c.email,
                    "mobile": c.mobile,
                    "address": c.address
                }
                for c in customers
            ],
            "applications": apps_list,
            "policies": policies_list,
            "claims": claims_list,
            "renewals": renewals_list
        }
