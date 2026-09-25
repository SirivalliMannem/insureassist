import datetime
import json
import logging
import os
import random
import urllib.request
import uuid
from decimal import Decimal
from typing import List, Optional, Dict, Any, Tuple

from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from fastapi import HTTPException, status

from app.models.models import (
    Policy,
    RenewalRequest,
    Customer,
    Notification,
    Application,
    User,
    Coverage,
    Exclusion,
    Claim,
    ChatConversation,
    ChatMessage
)
from app.schemas.underwriter import (
    CreateConversationRequest,
    SendMessageRequest,
    ChatConversationItem,
    ChatMessageItem,
    UnderwriterChatResponse
)
from app.services.underwriter_context_service import UnderwriterContextService
from app.services.underwriter_pdf_service import (
    build_underwriter_application_summary_pdf,
    build_underwriter_policy_summary_pdf,
    build_underwriter_claim_summary_pdf
)

logger = logging.getLogger(__name__)


def _risk_level(policy):
    premium = float(policy.premium or 0)
    if premium > 10000:
        return 'High'
    if premium > 3000:
        return 'Medium'
    return 'Low'


def _risk_score(policy):
    premium = float(policy.premium or 0)
    if premium > 20000:
        return 90
    if premium > 10000:
        return 75
    if premium > 5000:
        return 55
    if premium > 2000:
        return 38
    return 20


def _days_remaining(end_date):
    if not end_date:
        return None
    today = datetime.date.today()
    if isinstance(end_date, datetime.datetime):
        end_date = end_date.date()
    return (end_date - today).days


def _format_premium(value):
    if value is None:
        return 'N/A'
    return f'${float(value):,.2f}/yr'


def _format_date(d):
    if not d:
        return None
    if isinstance(d, datetime.datetime):
        return d.strftime('%Y-%m-%d')
    if isinstance(d, datetime.date):
        return d.strftime('%Y-%m-%d')
    return str(d)


class UnderwriterService:
    QUEUE_WINDOW_DAYS = 60

    @staticmethod
    def get_queue(db: Session):
        today = datetime.date.today()
        window_end = today + datetime.timedelta(days=UnderwriterService.QUEUE_WINDOW_DAYS)

        items = []
        seen_policy_ids = set()

        # 0. Forwarded Policy Applications from applications table
        forwarded_apps = db.query(Application).filter(
            or_(
                Application.forwarded_by_agent_id.isnot(None),
                Application.status.in_([
                    'FORWARDED_TO_UNDERWRITER',
                    'Forwarded to Underwriter',
                    'Underwriter Review',
                    'UNDERWRITER_REVIEW'
                ])
            )
        ).order_by(Application.created_at.desc()).all()

        for app in forwarded_apps:
            if app.policy_id:
                seen_policy_ids.add(app.policy_id)

            customer = db.query(Customer).filter(Customer.customer_id == app.customer_id).first()
            agent_user = None
            if app.forwarded_by_agent_id:
                agent_user = db.query(User).filter(User.user_id == app.forwarded_by_agent_id).first()

            docs_list = json.loads(app.documents) if app.documents else []
            docs_names = [d.get('file_name', d.get('doc_type', 'Document')) for d in docs_list] if docs_list else ['Policy Schedule', 'Coverage Certificate']
            applicant = json.loads(app.applicant_info) if app.applicant_info else {}
            risk_data = json.loads(app.policy_specific_data) if app.policy_specific_data else {}
            prem_val = float(app.estimated_premium or 0)
            cov_limit_val = f"${float(app.coverage_limit):,.0f}" if app.coverage_limit is not None else "$300,000"
            deduct_val = f"${float(app.deductible):,.0f}" if app.deductible is not None else "$1,000"

            app_st = (app.status or '').upper()
            if 'APPROV' in app_st:
                uw_item_status = 'Approved'
            elif 'REJECT' in app_st:
                uw_item_status = 'Rejected'
            elif 'MORE_INFO' in app_st or 'MORE_INFORMATION' in app_st or 'INFO REQUIRED' in app_st:
                uw_item_status = 'Info Required'
            elif 'APPROVAL' in app_st:
                uw_item_status = 'Pending Approval'
            else:
                uw_item_status = 'Pending Review'

            items.append({
                'id': app.application_id,
                'type': 'policy_application',
                'application_id': app.application_id,
                'policy_id': app.policy_id,
                'policy_number': app.policy_id or app.application_id,
                'policy_type': app.policy_type,
                'customer_id': app.customer_id,
                'customer': customer.name if customer else 'Customer',
                'customer_email': customer.email if customer else '',
                'customer_phone': (customer.mobile or customer.address) if customer else '',
                'product': app.product_name,
                'coverage_tier': app.coverage_tier or 'Standard',
                'coverage_limit': cov_limit_val,
                'deductible': deduct_val,
                'duration_months': app.duration_months or 12,
                'premium': _format_premium(prem_val),
                'premium_raw': prem_val,
                'risk_level': 'High' if prem_val > 10000 else ('Medium' if prem_val > 3000 else 'Low'),
                'risk_score': 85 if prem_val > 10000 else (55 if prem_val > 3000 else 25),
                'status': uw_item_status,
                'forwarded_by_agent_id': app.forwarded_by_agent_id,
                'forwarded_by_agent_name': agent_user.name if agent_user else 'Assigned Agent',
                'forwarded_at': _format_date(app.forwarded_at),
                'agent_notes': app.agent_notes,
                'verification_status': app.verification_status or 'Verified by Agent',
                'applicant_info': applicant,
                'policy_specific_data': risk_data,
                'documents': docs_names,
                'documents_raw': docs_list,
                'effective_date': _format_date(app.start_date),
                'end_date': _format_date(app.start_date + datetime.timedelta(days=int((app.duration_months or 12) * 30.4375))) if app.start_date else None,
                'days_remaining': 14,
                'submitted_date': _format_date(app.created_at),
                'coverages': [f"{app.product_name} ({app.coverage_tier} Tier)"],
                'exclusions': ['Standard Negligence & Undeclared Hazards Exclusion'],
            })

        # 1. Renewal Requests from real renewal_requests table
        renewal_items = db.query(RenewalRequest).all()
        for r in renewal_items:
            policy = db.query(Policy).filter(Policy.policy_id == r.policy_id).first()
            customer = db.query(Customer).filter(Customer.customer_id == r.customer_id).first()
            days = _days_remaining(r.renewal_date)
            seen_policy_ids.add(r.policy_id)

            coverages = [c.coverage_name for c in policy.coverages] if (policy and policy.coverages) else []
            exclusions = [e.exclusion_name for e in policy.exclusions] if (policy and policy.exclusions) else []

            r_st = (r.status or '').upper()
            if 'APPROV' in r_st:
                ren_st = 'Approved'
            elif 'REJECT' in r_st:
                ren_st = 'Rejected'
            elif 'INFO' in r_st:
                ren_st = 'Info Required'
            else:
                ren_st = 'Pending Approval'

            items.append({
                'id': r.renewal_id,
                'type': 'renewal_request',
                'policy_id': r.policy_id,
                'policy_number': r.policy_number,
                'policy_type': r.policy_type,
                'customer_id': r.customer_id,
                'customer': r.customer_name or (customer.name if customer else 'Customer'),
                'customer_email': customer.email if customer else '',
                'product': r.policy_type,
                'premium': _format_premium(r.renewal_premium if r.renewal_premium is not None else (policy.premium if policy else None)),
                'premium_raw': float(r.renewal_premium or (policy.premium if policy else 0) or 0),
                'risk_level': _risk_level(policy) if policy else 'Low',
                'risk_score': _risk_score(policy) if policy else 20,
                'status': ren_st,
                'effective_date': _format_date(r.renewal_date),
                'end_date': _format_date(r.renewal_date),
                'days_remaining': days,
                'submitted_date': _format_date(r.created_at),
                'coverages': coverages,
                'exclusions': exclusions,
                'documents': ['Policy Schedule', 'Coverage Certificate'],
            })

        # 2. All real Pending policies from policies table, excluding any pending policies tied to unforwarded applications
        unforwarded_app_policy_ids = set(
            r[0] for r in db.query(Application.policy_id).filter(
                Application.policy_id.isnot(None),
                ~Application.status.in_([
                    'FORWARDED_TO_UNDERWRITER',
                    'Forwarded to Underwriter',
                    'Underwriter Review',
                    'UNDERWRITER_REVIEW'
                ])
            ).all()
        )

        pending_policies = (
            db.query(Policy)
            .join(Customer, Policy.customer_id == Customer.customer_id)
            .filter(Policy.status == 'Pending')
            .order_by(Policy.created_at.desc())
            .all()
        )

        for p in pending_policies:
            if p.policy_id in seen_policy_ids or p.policy_id in unforwarded_app_policy_ids:
                continue
            seen_policy_ids.add(p.policy_id)
            customer = p.customer
            days = _days_remaining(p.end_date)
            coverages = [c.coverage_name for c in p.coverages] if p.coverages else []
            exclusions = [e.exclusion_name for e in p.exclusions] if p.exclusions else []

            p_st = (p.status or '').upper()
            if 'APPROV' in p_st or 'ACTIVE' in p_st:
                pol_st = 'Approved'
            elif 'REJECT' in p_st or 'CANCEL' in p_st:
                pol_st = 'Rejected'
            elif 'APPROVAL' in p_st:
                pol_st = 'Pending Approval'
            else:
                pol_st = 'Pending Review'

            items.append({
                'id': p.policy_id,
                'type': 'pending_policy',
                'policy_id': p.policy_id,
                'policy_number': p.policy_number,
                'policy_type': p.policy_type,
                'customer_id': p.customer_id,
                'customer': customer.name if customer else 'Unknown',
                'customer_email': customer.email if customer else '',
                'product': p.policy_type,
                'premium': _format_premium(p.premium),
                'premium_raw': float(p.premium or 0),
                'risk_level': _risk_level(p),
                'risk_score': _risk_score(p),
                'status': pol_st,
                'effective_date': _format_date(p.start_date),
                'end_date': _format_date(p.end_date),
                'days_remaining': days,
                'submitted_date': _format_date(p.created_at),
                'coverages': coverages,
                'exclusions': exclusions,
                'documents': ['Policy Schedule', 'Coverage Certificate'],
            })

        # 3. Near-expiry Active policies within 60 days
        near_expiry = (
            db.query(Policy)
            .join(Customer, Policy.customer_id == Customer.customer_id)
            .filter(
                Policy.status == 'Active',
                Policy.end_date != None,
                Policy.end_date >= today,
                Policy.end_date <= window_end,
                ~Policy.policy_id.in_(seen_policy_ids)
            )
            .order_by(Policy.end_date.asc())
            .all()
        )

        for p in near_expiry:
            if p.policy_id in seen_policy_ids:
                continue
            seen_policy_ids.add(p.policy_id)
            customer = p.customer
            days = _days_remaining(p.end_date)
            coverages = [c.coverage_name for c in p.coverages] if p.coverages else []
            exclusions = [e.exclusion_name for e in p.exclusions] if p.exclusions else []

            items.append({
                'id': f'POL-UW-{p.policy_id}',
                'type': 'near_expiry',
                'policy_id': p.policy_id,
                'policy_number': p.policy_number,
                'policy_type': p.policy_type,
                'customer_id': p.customer_id,
                'customer': customer.name if customer else 'Unknown',
                'customer_email': customer.email if customer else '',
                'product': p.policy_type,
                'premium': _format_premium(p.premium),
                'premium_raw': float(p.premium or 0),
                'risk_level': _risk_level(p),
                'risk_score': _risk_score(p),
                'status': 'Pending Review',
                'effective_date': _format_date(p.start_date),
                'end_date': _format_date(p.end_date),
                'days_remaining': days,
                'submitted_date': _format_date(p.created_at),
                'coverages': coverages,
                'exclusions': exclusions,
                'documents': ['Policy Schedule', 'Coverage Certificate'],
            })

        def sort_key(item):
            pending_first = 0 if item['status'] in ('Pending', 'Pending Approval', 'Pending Review') else 1
            days = item['days_remaining'] if item['days_remaining'] is not None else 9999
            return (pending_first, days)

        items.sort(key=sort_key)
        return items

    @staticmethod
    def get_stats(db: Session):
        today = datetime.date.today()
        window_end = today + datetime.timedelta(days=UnderwriterService.QUEUE_WINDOW_DAYS)

        pending_policies_count = db.query(Policy).filter(Policy.status == 'Pending').count()
        pending_renewals_count = db.query(RenewalRequest).filter(
            RenewalRequest.status.in_(['Pending Approval', 'Pending'])
        ).count()
        near_expiry_count = db.query(Policy).filter(
            Policy.status == 'Active',
            Policy.end_date != None,
            Policy.end_date >= today,
            Policy.end_date <= window_end,
        ).count()

        pending_count = pending_policies_count + pending_renewals_count + near_expiry_count

        high_risk_count = db.query(Policy).filter(
            Policy.status.in_(['Pending', 'Active']),
            Policy.premium > 10000
        ).count()

        approved_count = db.query(Policy).filter(Policy.status == 'Active').count()
        needs_info_count = db.query(RenewalRequest).filter(
            RenewalRequest.status == 'Needs More Information'
        ).count()

        total_active = db.query(Policy).filter(Policy.status == 'Active').count()
        total_policies = db.query(Policy).count()

        lob_query = (
            db.query(
                Policy.policy_type,
                func.count(Policy.policy_id).label('count'),
                func.sum(Policy.premium).label('total_premium')
            )
            .group_by(Policy.policy_type)
            .all()
        )

        total_portfolio_premium = sum(float(row.total_premium or 0) for row in lob_query) or 1.0

        lob_distribution = []
        for row in lob_query:
            ptype = row.policy_type or 'General'
            cnt = int(row.count or 0)
            prem = float(row.total_premium or 0)
            pct = round((prem / total_portfolio_premium) * 100, 1)
            lob_distribution.append({
                'policy_type': ptype,
                'count': cnt,
                'total_premium': prem,
                'total_premium_formatted': f'${prem:,.0f}' if prem >= 1000 else f'${prem:,.2f}',
                'percentage': pct,
            })

        lob_distribution.sort(key=lambda x: x['total_premium'], reverse=True)

        return {
            'pending_reviews': pending_count,
            'pending_policies': pending_policies_count,
            'pending_renewals': pending_renewals_count,
            'near_expiry': near_expiry_count,
            'high_risk_cases': high_risk_count,
            'approved': approved_count,
            'needs_more_info': needs_info_count,
            'total_active_policies': total_active,
            'total_policies': total_policies,
            'lob_distribution': lob_distribution,
        }

    @staticmethod
    def make_decision(item_id: str, decision: str, notes: str, db: Session):
        valid_decisions = ['Approved', 'Rejected', 'Needs More Information', 'Info Required']
        if decision not in valid_decisions:
            return {'success': False, 'message': f"Invalid decision '{decision}'."}

        target_type = 'unknown'

        # Check if item is a Policy Application
        app_record = db.query(Application).filter(
            or_(
                Application.application_id == item_id,
                Application.policy_id == item_id
            )
        ).first()

        # Check if item is a Renewal Request
        renewal = db.query(RenewalRequest).filter(
            or_(
                RenewalRequest.renewal_id == item_id,
                RenewalRequest.policy_id == item_id
            )
        ).first()

        if app_record:
            target_type = 'policy_application'
            app_record.status = decision
            app_record.updated_at = datetime.datetime.utcnow()

            if decision == 'Approved':
                app_record.verification_status = 'Verified'
                if app_record.policy_id:
                    pol = db.query(Policy).filter(Policy.policy_id == app_record.policy_id).first()
                    if pol:
                        pol.status = 'Active'
                        if pol.end_date:
                            end_d = pol.end_date
                            if isinstance(end_d, datetime.datetime):
                                end_d = end_d.date()
                            pol.end_date = max(end_d, datetime.date.today() + datetime.timedelta(days=365))
            elif decision == 'Rejected':
                app_record.verification_status = 'Verified'
                if app_record.policy_id:
                    pol = db.query(Policy).filter(Policy.policy_id == app_record.policy_id).first()
                    if pol:
                        pol.status = 'Cancelled'
            elif decision in ('Needs More Information', 'Info Required'):
                app_record.status = 'MORE_INFORMATION_REQUIRED'
                app_record.verification_status = 'Incomplete'
                app_record.agent_notes = notes

            # Customer Notification
            notif_cust = Notification(
                notification_id=f'NOTIF-UW-{uuid.uuid4().hex[:8].upper()}',
                recipient_role='Customer',
                recipient_id=app_record.customer_id,
                title=f'Policy Application {decision}: {app_record.product_name}',
                message=(
                    f'Your policy application {app_record.application_id} ({app_record.product_name}) has been '
                    f'{decision.lower()} by the underwriting department.'
                    + (f' Underwriter Notes: {notes}' if notes else '')
                ),
                policy_id=app_record.policy_id,
                policy_number=None,
                policy_type=app_record.policy_type,
                customer_name=None,
                status=decision,
                is_read=False,
                created_at=datetime.datetime.utcnow(),
            )
            db.add(notif_cust)

            # Agent Notification if assigned
            if app_record.forwarded_by_agent_id:
                notif_agent = Notification(
                    notification_id=f'NOTIF-AGT-{uuid.uuid4().hex[:8].upper()}',
                    recipient_role='Agent',
                    recipient_id=app_record.forwarded_by_agent_id,
                    title=f'Application {decision}: {app_record.application_id}',
                    message=f'Underwriter marked policy application {app_record.application_id} as {decision}.' + (f' Notes: {notes}' if notes else ''),
                    policy_id=app_record.policy_id,
                    policy_number=None,
                    policy_type=app_record.policy_type,
                    customer_name=None,
                    status=decision,
                    is_read=False,
                    created_at=datetime.datetime.utcnow(),
                )
                db.add(notif_agent)

        elif renewal:
            renewal.status = decision
            renewal.updated_at = datetime.datetime.utcnow()
            target_type = 'renewal_request'

            if decision == 'Approved':
                policy = db.query(Policy).filter(Policy.policy_id == renewal.policy_id).first()
                if policy and policy.end_date:
                    end_date = policy.end_date
                    if isinstance(end_date, datetime.datetime):
                        end_date = end_date.date()
                    policy.end_date = end_date.replace(year=end_date.year + 1)

            notif = Notification(
                notification_id=f'NOTIF-UW-{uuid.uuid4().hex[:8].upper()}',
                recipient_role='Customer',
                recipient_id=renewal.customer_id,
                title=f'Renewal {decision}: {renewal.policy_number}',
                message=(
                    f'Your renewal request for policy {renewal.policy_number} has been '
                    f'{decision.lower()} by the underwriting team.'
                    + (f' Notes: {notes}' if notes else '')
                ),
                policy_id=renewal.policy_id,
                policy_number=renewal.policy_number,
                policy_type=renewal.policy_type,
                customer_name=renewal.customer_name,
                renewal_id=renewal.renewal_id,
                status=decision,
                is_read=False,
                created_at=datetime.datetime.utcnow(),
            )
            db.add(notif)

        else:
            policy_id = item_id.replace('POL-UW-', '')
            policy = db.query(Policy).filter(
                or_(Policy.policy_id == policy_id, Policy.policy_number == policy_id)
            ).first()
            if not policy:
                return {'success': False, 'message': f"Queue item '{item_id}' not found."}

            target_type = 'pending_policy' if policy.status == 'Pending' else 'near_expiry_policy'

            if decision == 'Rejected':
                policy.status = 'Cancelled' if policy.status == 'Pending' else 'Expired'
            elif decision == 'Approved':
                policy.status = 'Active'
                if policy.end_date:
                    end_date = policy.end_date
                    if isinstance(end_date, datetime.datetime):
                        end_date = end_date.date()
                    policy.end_date = max(end_date, datetime.date.today() + datetime.timedelta(days=365))

            new_renewal = RenewalRequest(
                renewal_id=f'REN-{uuid.uuid4().hex[:8].upper()}',
                customer_id=policy.customer_id,
                policy_id=policy.policy_id,
                policy_number=policy.policy_number,
                policy_type=policy.policy_type,
                customer_name=policy.customer.name if policy.customer else 'Customer',
                renewal_date=policy.end_date,
                renewal_premium=policy.premium,
                status=decision,
                created_at=datetime.datetime.utcnow(),
                updated_at=datetime.datetime.utcnow(),
            )
            db.add(new_renewal)

        db.commit()

        return {
            'success': True,
            'item_id': item_id,
            'decision': decision,
            'type': target_type,
            'message': f"Underwriting decision '{decision}' recorded successfully.",
        }

    @staticmethod
    def get_policies(db: Session, status_filter=None, policy_type=None, search=None,
                     limit=100, offset=0):
        query = db.query(Policy).join(Customer, Policy.customer_id == Customer.customer_id)

        if status_filter and status_filter.lower() != 'all':
            query = query.filter(Policy.status.ilike(status_filter))
        if policy_type and policy_type.lower() != 'all':
            query = query.filter(Policy.policy_type.ilike(f'%{policy_type}%'))
        if search:
            query = query.filter(
                or_(
                    Policy.policy_number.ilike(f'%{search}%'),
                    Policy.policy_type.ilike(f'%{search}%'),
                    Customer.name.ilike(f'%{search}%'),
                )
            )

        total = query.count()
        policies = query.order_by(Policy.end_date.asc()).offset(offset).limit(limit).all()

        items = []
        for p in policies:
            customer = p.customer
            items.append({
                'policy_id': p.policy_id,
                'policy_number': p.policy_number,
                'policy_type': p.policy_type,
                'status': p.status,
                'premium': _format_premium(p.premium),
                'premium_raw': float(p.premium or 0),
                'start_date': _format_date(p.start_date),
                'end_date': _format_date(p.end_date),
                'days_remaining': _days_remaining(p.end_date),
                'risk_level': _risk_level(p),
                'customer_id': p.customer_id,
                'customer_name': customer.name if customer else 'Unknown',
                'customer_email': customer.email if customer else '',
            })

        return {'total': total, 'policies': items}

    # =========================================================================
    # Persistent Chat & Underwriter AI Methods
    # =========================================================================

    @staticmethod
    def _call_underwriter_ai_service(message: str, underwriter_id: str, conversation_id: str, history: List[dict], context: Optional[dict] = None) -> str:
        """
        Dispatches prompt + bounded history + authorized underwriter context to AI Service (:8006).
        """
        ai_service_url = os.environ.get("AI_SERVICE_URL", "http://insureassist-ai-container:8006")
        endpoint = f"{ai_service_url}/api/v1/ai/underwriter/chat"
        payload = {
            "message": message,
            "underwriter_id": underwriter_id,
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
                return res_data.get("response", "No response received from AI service.")
        except Exception as e:
            logger.error(f"Failed to reach AI service at {endpoint}: {e}")
            return "I apologize, but I am temporarily unable to reach the AI intelligence service. Please review queue applications and underwriting cases directly in the workspace."

    @staticmethod
    def list_chat_conversations(underwriter_user: User, db: Session) -> List[ChatConversationItem]:
        """
        Retrieves all persistent chat conversations for the authenticated Underwriter.
        """
        uw_id_str = str(underwriter_user.user_id)
        conversations = db.query(ChatConversation).filter(
            ChatConversation.customer_id == uw_id_str,
            ChatConversation.role == "underwriter"
        ).order_by(ChatConversation.updated_at.desc()).all()

        results = []
        for conv in conversations:
            last_msg = db.query(ChatMessage).filter(
                ChatMessage.conversation_id == conv.conversation_id
            ).order_by(ChatMessage.created_at.desc()).first()

            msg_count = db.query(ChatMessage).filter(
                ChatMessage.conversation_id == conv.conversation_id
            ).count()

            snippet = (last_msg.message[:60] + "...") if (last_msg and len(last_msg.message) > 60) else (last_msg.message if last_msg else None)

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
    def create_chat_conversation(underwriter_user: User, req: CreateConversationRequest, db: Session) -> ChatConversationItem:
        """
        Creates a new persistent conversation session for the authenticated Underwriter.
        """
        now = datetime.datetime.utcnow()
        uw_id_str = str(underwriter_user.user_id)
        conv_id = f"conv-uw-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        title = req.title.strip() if (req.title and req.title.strip()) else "New Conversation"

        conv = ChatConversation(
            conversation_id=conv_id,
            customer_id=uw_id_str,
            title=title,
            role="underwriter",
            created_at=now,
            updated_at=now
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)

        if req.initial_message and req.initial_message.strip():
            UnderwriterService.send_chat_message(
                SendMessageRequest(message=req.initial_message, conversation_id=conv.conversation_id),
                underwriter_user,
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
    def get_conversation_messages(conversation_id: str, underwriter_user: User, db: Session) -> List[ChatMessageItem]:
        """
        Retrieves all messages for an underwriter conversation in strict chronological order.
        Strictly prevents cross-underwriter conversation access.
        """
        uw_id_str = str(underwriter_user.user_id)
        conv = db.query(ChatConversation).filter(
            ChatConversation.conversation_id == conversation_id,
            ChatConversation.customer_id == uw_id_str,
            ChatConversation.role == "underwriter"
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
    def send_chat_message(req: SendMessageRequest, underwriter_user: User, db: Session) -> UnderwriterChatResponse:
        """
        Handles persistent underwriter chat:
        1. Validates or creates underwriter persistent conversation session.
        2. Persists underwriter user message in PostgreSQL.
        3. Retrieves bounded conversation history (last 8 messages).
        4. Extracts real live underwriter-authorized business context from PostgreSQL.
        5. Calls standalone AI Service (:8006).
        6. Persists AI bot response message.
        7. Returns structured response with conversation metadata.
        """
        now = datetime.datetime.utcnow()
        uw_id_str = str(underwriter_user.user_id)
        conv = None

        if req.conversation_id:
            conv = db.query(ChatConversation).filter(
                ChatConversation.conversation_id == req.conversation_id,
                ChatConversation.customer_id == uw_id_str,
                ChatConversation.role == "underwriter"
            ).first()

        if not conv:
            conv_id = req.conversation_id if (req.conversation_id and req.conversation_id.startswith("conv-")) else f"conv-uw-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
            initial_title = (req.message[:32] + "...") if len(req.message) > 32 else req.message
            conv = ChatConversation(
                conversation_id=conv_id,
                customer_id=uw_id_str,
                title=initial_title,
                role="underwriter",
                created_at=now,
                updated_at=now
            )
            db.add(conv)
            db.flush()

        # 1. Persist User Message
        user_msg_id = f"msg-uu-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        user_msg = ChatMessage(
            message_id=user_msg_id,
            conversation_id=conv.conversation_id,
            sender_type="user",
            message=req.message,
            created_at=now
        )
        db.add(user_msg)
        db.commit()

        # 2. Retrieve bounded history from PostgreSQL
        prior_messages = db.query(ChatMessage).filter(
            ChatMessage.conversation_id == conv.conversation_id,
            ChatMessage.message_id != user_msg_id
        ).order_by(ChatMessage.created_at.desc()).limit(8).all()
        prior_messages.reverse()

        history_payload = [
            {"sender": m.sender_type, "message": m.message}
            for m in prior_messages
        ]

        # 3. Extract Live Underwriter-Authorized Context
        uw_context = UnderwriterContextService.get_underwriter_authorized_context(underwriter_user, db, query_text=req.message)

        # 4. Call AI Service (:8006)
        bot_reply = UnderwriterService._call_underwriter_ai_service(
            message=req.message,
            underwriter_id=uw_id_str,
            conversation_id=conv.conversation_id,
            history=history_payload,
            context=uw_context
        )

        # 5. Persist AI Response Message
        bot_time = datetime.datetime.utcnow()
        bot_msg_id = f"msg-ub-{bot_time.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        bot_msg = ChatMessage(
            message_id=bot_msg_id,
            conversation_id=conv.conversation_id,
            sender_type="bot",
            message=bot_reply,
            created_at=bot_time
        )
        db.add(bot_msg)

        conv.updated_at = bot_time
        if conv.title in ("New Conversation", "New Chat") or len(conv.title) <= 3:
            conv.title = (req.message[:32] + "...") if len(req.message) > 32 else req.message

        db.commit()

        return UnderwriterChatResponse(
            conversation_id=conv.conversation_id,
            title=conv.title,
            response=bot_reply,
            message_id=bot_msg_id,
            created_at=bot_time.isoformat() + "Z"
        )

    @staticmethod
    def delete_chat_conversation(conversation_id: str, underwriter_user: User, db: Session) -> dict:
        """
        Deletes an underwriter conversation and all associated messages.
        """
        uw_id_str = str(underwriter_user.user_id)
        conv = db.query(ChatConversation).filter(
            ChatConversation.conversation_id == conversation_id,
            ChatConversation.customer_id == uw_id_str,
            ChatConversation.role == "underwriter"
        ).first()

        if not conv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Conversation '{conversation_id}' not found or access denied."
            )

        db.delete(conv)
        db.commit()
        return {"success": True, "detail": "Conversation deleted successfully."}

    # =========================================================================
    # PDF Summary Downloads
    # =========================================================================

    @staticmethod
    def download_application_summary(application_id: str, underwriter_user: User, db: Session) -> Tuple[bytes, str]:
        """
        Generates and returns an InsureAssist-generated Application Summary PDF.
        """
        app_record = db.query(Application).filter(Application.application_id == application_id).first()
        if not app_record:
            raise HTTPException(status_code=404, detail=f"Application '{application_id}' not found.")

        customer = db.query(Customer).filter(Customer.customer_id == app_record.customer_id).first()
        pdf_bytes = build_underwriter_application_summary_pdf(app_record, customer, underwriter_user)
        filename = f"InsureAssist_Underwriting_Application_Summary_{application_id}.pdf"
        return pdf_bytes, filename

    @staticmethod
    def download_policy_summary(policy_id: str, underwriter_user: User, db: Session) -> Tuple[bytes, str]:
        """
        Generates and returns an InsureAssist-generated Policy Summary PDF.
        """
        policy = db.query(Policy).filter(
            or_(Policy.policy_id == policy_id, Policy.policy_number == policy_id)
        ).first()
        if not policy:
            raise HTTPException(status_code=404, detail=f"Policy '{policy_id}' not found.")

        customer = db.query(Customer).filter(Customer.customer_id == policy.customer_id).first()
        coverages = db.query(Coverage).filter(Coverage.policy_id == policy.policy_id).all()
        exclusions = db.query(Exclusion).filter(Exclusion.policy_id == policy.policy_id).all()

        pdf_bytes = build_underwriter_policy_summary_pdf(policy, customer, coverages, exclusions, underwriter_user)
        filename = f"InsureAssist_Policy_Summary_{policy.policy_number}.pdf"
        return pdf_bytes, filename

    @staticmethod
    def download_claim_summary(claim_id: str, underwriter_user: User, db: Session) -> Tuple[bytes, str]:
        """
        Generates and returns an InsureAssist-generated Claim Summary PDF.
        """
        claim = db.query(Claim).filter(
            or_(Claim.claim_id == claim_id, Claim.claim_number == claim_id)
        ).first()
        if not claim:
            raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found.")

        customer = db.query(Customer).filter(Customer.customer_id == claim.customer_id).first()
        policy = db.query(Policy).filter(Policy.policy_id == claim.policy_id).first()

        pdf_bytes = build_underwriter_claim_summary_pdf(claim, customer, policy, underwriter_user)
        num_str = claim.claim_number or claim.claim_id
        filename = f"InsureAssist_Claim_Summary_{num_str}.pdf"
        return pdf_bytes, filename

    @staticmethod
    def resolve_document_download(doc_type: str, ref_id: str, underwriter_user: User, db: Session) -> Tuple[bytes, str]:
        """
        Dispatches download request based on document type.
        """
        dtype = (doc_type or "").lower()
        if any(k in dtype for k in ["app", "submission"]):
            return UnderwriterService.download_application_summary(ref_id, underwriter_user, db)
        elif any(k in dtype for k in ["pol", "binder"]):
            return UnderwriterService.download_policy_summary(ref_id, underwriter_user, db)
        elif any(k in dtype for k in ["claim", "clm"]):
            return UnderwriterService.download_claim_summary(ref_id, underwriter_user, db)

        # Try application first
        if db.query(Application).filter(Application.application_id == ref_id).first():
            return UnderwriterService.download_application_summary(ref_id, underwriter_user, db)
        # Try policy
        if db.query(Policy).filter(or_(Policy.policy_id == ref_id, Policy.policy_number == ref_id)).first():
            return UnderwriterService.download_policy_summary(ref_id, underwriter_user, db)
        # Try claim
        if db.query(Claim).filter(or_(Claim.claim_id == ref_id, Claim.claim_number == ref_id)).first():
            return UnderwriterService.download_claim_summary(ref_id, underwriter_user, db)

        raise HTTPException(status_code=404, detail=f"Document summary not found for '{ref_id}'.")
