import datetime
import json
import logging
import uuid
from decimal import Decimal
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.models.models import Policy, RenewalRequest, Customer, Notification, Application, User

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
                'customer_phone': (customer.mobile or customer.phone) if customer else '',
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
