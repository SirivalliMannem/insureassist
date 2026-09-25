import logging
import json
import re
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.models import (
    User,
    Customer,
    Policy,
    Coverage,
    Exclusion,
    Claim,
    RenewalRequest,
    Application
)

logger = logging.getLogger("underwriter-service.context")


class UnderwriterContextService:
    """
    Builds intent-aware, authorized business context for the authenticated underwriter
    from PostgreSQL relational tables, including the real underwriting queue.
    """

    @classmethod
    def get_underwriter_authorized_context(
        cls,
        underwriter_user: User,
        db: Session,
        query_text: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Retrieves underwriting queue records, policies, claims, and applications from PostgreSQL.
        """
        from app.services.underwriter_service import UnderwriterService

        uw_id_str = str(underwriter_user.user_id)
        msg = (query_text or "").strip()

        # Check if query references a specific application or policy ID (e.g. APP-8802, APP-2026-13804, POL-001)
        id_match = re.search(r'(?:APP|POL|CLM)-[\w-]+|\b\d{5,6}\b', msg, re.IGNORECASE)
        specific_id = id_match.group(0).upper() if id_match else None

        # 1. Fetch Full Underwriting Queue from Database
        try:
            full_queue = UnderwriterService.get_queue(db)
        except Exception as e:
            logger.error(f"Error fetching queue in context service: {e}")
            full_queue = []

        # Find specific item if requested
        specific_item = None
        if specific_id:
            for item in full_queue:
                item_app_id = str(item.get("application_id") or "").upper()
                item_pol_id = str(item.get("policy_id") or "").upper()
                item_id = str(item.get("id") or "").upper()
                if specific_id in item_app_id or specific_id in item_pol_id or specific_id == item_id:
                    specific_item = item
                    break

        # High risk queue items
        high_risk_items = [
            item for item in full_queue
            if str(item.get("risk_level", "")).lower() == "high" or int(item.get("risk_score", 0)) >= 70
        ]
        high_risk_items.sort(key=lambda x: (x.get("risk_score", 0), x.get("premium_raw", 0)), reverse=True)

        # Pending queue items
        pending_items = [
            item for item in full_queue
            if "pending" in str(item.get("status", "")).lower() or "forward" in str(item.get("status", "")).lower() or "info" in str(item.get("status", "")).lower()
        ]

        # 2. Fetch Applications table records directly
        apps_query = db.query(Application)
        if specific_id:
            specific_apps = apps_query.filter(
                or_(
                    Application.application_id.ilike(f"%{specific_id}%"),
                    Application.policy_id.ilike(f"%{specific_id}%")
                )
            ).all()
        else:
            specific_apps = []

        all_apps = apps_query.order_by(Application.created_at.desc()).limit(30).all()

        # Customer map for applications
        cust_ids = list(set([a.customer_id for a in all_apps if a.customer_id]))
        customers = db.query(Customer).filter(Customer.customer_id.in_(cust_ids)).all() if cust_ids else []
        cust_map = {c.customer_id: c for c in customers}

        # Agent map
        agent_ids = list(set([a.forwarded_by_agent_id for a in all_apps if a.forwarded_by_agent_id]))
        agents = db.query(User).filter(User.user_id.in_(agent_ids)).all() if agent_ids else []
        agent_map = {a.user_id: a.name for a in agents}

        apps_list = []
        for a in (specific_apps if specific_apps else all_apps):
            cust = cust_map.get(a.customer_id) or db.query(Customer).filter(Customer.customer_id == a.customer_id).first()
            c_name = cust.name if cust else "Valued Customer"
            
            applicant_info = json.loads(a.applicant_info) if a.applicant_info else {}
            policy_specific = json.loads(a.policy_specific_data) if a.policy_specific_data else {}
            docs_list = json.loads(a.documents) if a.documents else []

            apps_list.append({
                "application_id": a.application_id,
                "customer_id": a.customer_id,
                "customer_name": c_name,
                "customer_email": cust.email if cust else "",
                "customer_phone": (cust.mobile or cust.address) if cust else "",
                "policy_type": a.policy_type,
                "product_name": a.product_name,
                "coverage_tier": a.coverage_tier or "Standard",
                "coverage_limit": float(a.coverage_limit or 0),
                "deductible": float(a.deductible or 0),
                "duration_months": a.duration_months or 12,
                "estimated_premium": float(a.estimated_premium or 0),
                "status": a.status,
                "verification_status": getattr(a, "verification_status", "Pending Verification"),
                "forwarded_by_agent_id": a.forwarded_by_agent_id,
                "forwarded_by_agent_name": agent_map.get(a.forwarded_by_agent_id),
                "forwarded_at": a.forwarded_at.isoformat() if a.forwarded_at else None,
                "agent_notes": a.agent_notes,
                "applicant_info": applicant_info,
                "policy_specific_data": policy_specific,
                "documents": docs_list
            })

        # 3. Fetch Policies with Coverages and Exclusions
        policies_q = db.query(Policy)
        if specific_id:
            policies_matched = policies_q.filter(
                or_(
                    Policy.policy_id.ilike(f"%{specific_id}%"),
                    Policy.policy_number.ilike(f"%{specific_id}%")
                )
            ).all()
            if not policies_matched:
                policies_matched = policies_q.order_by(Policy.created_at.desc()).limit(20).all()
        else:
            policies_matched = policies_q.order_by(Policy.created_at.desc()).limit(20).all()

        pol_ids = [p.policy_id for p in policies_matched]
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
        for p in policies_matched:
            c = cust_map.get(p.customer_id) or db.query(Customer).filter(Customer.customer_id == p.customer_id).first()
            policies_list.append({
                "policy_id": p.policy_id,
                "policy_number": p.policy_number,
                "customer_id": p.customer_id,
                "customer_name": c.name if c else "Policyholder",
                "policy_type": p.policy_type,
                "status": p.status,
                "start_date": str(p.start_date) if p.start_date else None,
                "end_date": str(p.end_date) if p.end_date else None,
                "premium": float(p.premium or 0),
                "coverages": cov_map.get(p.policy_id, []),
                "exclusions": excl_map.get(p.policy_id, [])
            })

        # 4. Fetch Claims
        claims_q = db.query(Claim)
        if specific_id:
            claims_matched = claims_q.filter(
                or_(
                    Claim.claim_id.ilike(f"%{specific_id}%"),
                    Claim.claim_number.ilike(f"%{specific_id}%"),
                    Claim.policy_id.ilike(f"%{specific_id}%")
                )
            ).all()
            if not claims_matched:
                claims_matched = claims_q.order_by(Claim.created_at.desc()).limit(15).all()
        else:
            claims_matched = claims_q.order_by(Claim.created_at.desc()).limit(15).all()

        claims_list = []
        for clm in claims_matched:
            c = cust_map.get(clm.customer_id) or db.query(Customer).filter(Customer.customer_id == clm.customer_id).first()
            claims_list.append({
                "claim_id": clm.claim_id,
                "claim_number": clm.claim_number,
                "customer_id": clm.customer_id,
                "customer_name": c.name if c else "Customer",
                "policy_id": clm.policy_id,
                "incident_date": str(clm.incident_date) if clm.incident_date else None,
                "incident_type": clm.incident_type,
                "incident_description": clm.incident_description,
                "claim_status": clm.claim_status,
                "claim_amount": float(clm.claim_amount or 0)
            })

        # 5. Fetch Renewals
        renewals_q = db.query(RenewalRequest).order_by(RenewalRequest.created_at.desc()).limit(15)
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
            "underwriter_profile": {
                "user_id": uw_id_str,
                "name": underwriter_user.name,
                "email": underwriter_user.email,
                "role": underwriter_user.role
            },
            "specific_id_queried": specific_id,
            "specific_item_found": bool(specific_item or specific_apps),
            "specific_item": specific_item,
            "queue_summary": {
                "total_queue_count": len(full_queue),
                "high_risk_count": len(high_risk_items),
                "pending_review_count": len(pending_items)
            },
            "high_risk_queue_items": high_risk_items[:20],
            "pending_queue_items": pending_items[:25],
            "underwriting_queue": full_queue[:35],
            "applications": apps_list,
            "policies": policies_list,
            "claims": claims_list,
            "renewals": renewals_list
        }
