import datetime
import logging
import uuid
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.core.security import DEFAULT_USER_PASSWORD, hash_password
from app.models.models import User, Customer, Policy, RenewalRequest, Notification, CustomerAgentAssignment

logger = logging.getLogger(__name__)


def _format_date(d):
    if not d:
        return None
    if isinstance(d, datetime.datetime):
        return d.strftime("%Y-%m-%d %H:%M")
    if isinstance(d, datetime.date):
        return d.strftime("%Y-%m-%d")
    return str(d)


def _format_premium(value):
    if value is None:
        return "N/A"
    return f"${float(value):,.2f}/yr"


class AdminService:

    @staticmethod
    def get_stats(db: Session):
        total_users = db.query(User).count()
        total_policies = db.query(Policy).count()
        active_policies = db.query(Policy).filter(Policy.status == "Active").count()
        total_customers = db.query(Customer).count()
        pending_renewals = db.query(RenewalRequest).filter(RenewalRequest.status == "Pending Approval").count()

        # Dynamic role breakdown from PostgreSQL
        agent_count = db.query(User).filter(User.role.ilike("Agent%")).count()
        underwriter_count = db.query(User).filter(User.role.ilike("Underwriter%")).count()
        admin_count = db.query(User).filter(User.role.ilike("Admin%")).count()
        customer_user_count = db.query(User).filter(User.role.ilike("Customer%")).count()

        # Notification / activity count
        total_audit_events = db.query(Notification).count()

        return {
            "total_users": total_users,
            "total_policies": total_policies,
            "active_policies": active_policies,
            "total_customers": total_customers,
            "pending_renewals": pending_renewals,
            "agent_count": agent_count,
            "underwriter_count": underwriter_count,
            "admin_count": admin_count,
            "customer_user_count": customer_user_count,
            "total_audit_events": total_audit_events,
            "system_status": "Healthy",
            "db_status": "Connected",
        }

    @staticmethod
    def get_users(db: Session, role_filter: Optional[str] = None, search: Optional[str] = None, limit: int = 100, offset: int = 0):
        query = db.query(User)

        if role_filter and role_filter.lower() != "all":
            query = query.filter(User.role.ilike(f"%{role_filter}%"))

        if search:
            query = query.filter(
                or_(
                    User.name.ilike(f"%{search}%"),
                    User.email.ilike(f"%{search}%"),
                    User.user_id.ilike(f"%{search}%"),
                    User.role.ilike(f"%{search}%"),
                )
            )

        total = query.count()
        users = query.order_by(User.created_at.desc().nullslast(), User.name.asc()).offset(offset).limit(limit).all()

        results = []
        for u in users:
            policies_count = 0
            if u.customer:
                policies_count = len(u.customer.policies)

            results.append({
                "user_id": u.user_id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "created_at": _format_date(u.created_at),
                "policies_count": policies_count,
                "status": "Active",
            })

        return {
            "total": total,
            "users": results,
        }

    @staticmethod
    def create_user(data: dict, db: Session):
        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip()
        role = (data.get("role") or "Customer").strip()

        if not name or not email:
            return {"success": False, "message": "Name and email are required."}

        existing = db.query(User).filter(User.email.ilike(email)).first()
        if existing:
            return {"success": False, "message": f"User with email '{email}' already exists."}

        user_id = f"USR-{uuid.uuid4().hex[:8].upper()}"

        new_user = User(
            user_id=user_id,
            name=name,
            email=email,
            password_hash=hash_password(DEFAULT_USER_PASSWORD),
            role=role,
            created_at=datetime.datetime.utcnow(),
        )
        db.add(new_user)

        if role.lower() == "customer":
            cust_id = f"CUST-{uuid.uuid4().hex[:8].upper()}"
            new_cust = Customer(
                customer_id=cust_id,
                user_id=user_id,
                name=name,
                email=email,
                mobile=data.get("mobile") or "",
                address=data.get("address") or "124 Grand Avenue, Suite 400, Chicago, IL 60611",
            )
            db.add(new_cust)

        notif = Notification(
            notification_id=f"NOTIF-ADM-{uuid.uuid4().hex[:8].upper()}",
            recipient_role="Admin",
            title=f"User Created: {name}",
            message=f"New user {name} ({email}) was created with role {role}.",
            customer_name=name,
            status="Completed",
            is_read=False,
            created_at=datetime.datetime.utcnow(),
        )
        db.add(notif)

        db.commit()
        db.refresh(new_user)

        return {
            "success": True,
            "user_id": new_user.user_id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "created_at": _format_date(new_user.created_at),
            "message": f"User '{name}' created successfully. Initial password is {DEFAULT_USER_PASSWORD}.",
        }

    @staticmethod
    def get_policies(db: Session, status_filter: Optional[str] = None, policy_type: Optional[str] = None, search: Optional[str] = None, limit: int = 100, offset: int = 0):
        query = db.query(Policy).join(Customer, Policy.customer_id == Customer.customer_id)

        if status_filter and status_filter.lower() != "all":
            query = query.filter(Policy.status.ilike(status_filter))

        if policy_type and policy_type.lower() != "all":
            query = query.filter(Policy.policy_type.ilike(f"%{policy_type}%"))

        if search:
            query = query.filter(
                or_(
                    Policy.policy_number.ilike(f"%{search}%"),
                    Policy.policy_type.ilike(f"%{search}%"),
                    Customer.name.ilike(f"%{search}%"),
                    Customer.email.ilike(f"%{search}%"),
                )
            )

        total = query.count()
        policies = query.order_by(Policy.created_at.desc().nullslast(), Policy.end_date.asc()).offset(offset).limit(limit).all()

        # Build map of active customer-agent assignments
        assignments = (
            db.query(CustomerAgentAssignment.customer_id, User.name)
            .join(User, CustomerAgentAssignment.agent_id == User.user_id)
            .filter(CustomerAgentAssignment.status == "Active")
            .all()
        )
        agent_map = {cust_id: agent_name for cust_id, agent_name in assignments}

        results = []
        today = datetime.date.today()
        for p in policies:
            cust = p.customer
            days_left = None
            if p.end_date:
                ed = p.end_date if isinstance(p.end_date, datetime.date) else p.end_date.date()
                days_left = (ed - today).days

            assigned_agent = agent_map.get(p.customer_id) or "Unassigned"

            results.append({
                "policy_id": p.policy_id,
                "policy_number": p.policy_number,
                "policy_type": p.policy_type,
                "status": p.status,
                "premium": _format_premium(p.premium),
                "premium_raw": float(p.premium or 0),
                "assigned_agent": assigned_agent,
                "agent_name": assigned_agent,
                "start_date": _format_date(p.start_date),
                "end_date": _format_date(p.end_date),
                "days_remaining": days_left,
                "customer_id": p.customer_id,
                "customer_name": cust.name if cust else "Unknown",
                "customer_email": cust.email if cust else "",
                "created_at": _format_date(p.created_at),
            })

        return {
            "total": total,
            "policies": results,
        }

    @staticmethod
    def get_audit_logs(db: Session, limit: int = 50, offset: int = 0):
        query = db.query(Notification).order_by(Notification.created_at.desc())
        total = query.count()
        logs = query.offset(offset).limit(limit).all()

        results = []
        for item in logs:
            results.append({
                "id": item.notification_id,
                "timestamp": _format_date(item.created_at),
                "title": item.title,
                "message": item.message,
                "recipient_role": item.recipient_role,
                "recipient_id": item.recipient_id,
                "policy_number": item.policy_number,
                "customer_name": item.customer_name,
                "status": item.status or "Completed",
            })

        return {
            "total": total,
            "audit_logs": results,
        }

    @staticmethod
    def reset_user_password(data: dict, db: Session):
        user_id = (data.get("user_id") or "").strip()
        email = (data.get("email") or "").strip()

        user = None
        if user_id:
            user = db.query(User).filter(User.user_id == user_id).first()
        if not user and email:
            user = db.query(User).filter(User.email.ilike(email)).first()

        if not user:
            return {"success": False, "message": f"User account '{user_id or email}' not found."}

        raw_role = user.role or "User"
        if "customer" in raw_role.lower():
            norm_role = "Customer"
        elif "agent" in raw_role.lower():
            norm_role = "Agent"
        elif "underwriter" in raw_role.lower():
            norm_role = "Underwriter"
        elif "admin" in raw_role.lower():
            norm_role = "Admin"
        else:
            norm_role = raw_role

        notif = Notification(
            notification_id=f"NOTIF-PWD-{uuid.uuid4().hex[:8].upper()}",
            recipient_role="Admin",
            title=f"Password Reset: {user.name}",
            message=f"Password reset link sent to {norm_role} {user.name} ({user.email}).",
            customer_name=user.name,
            status="Completed",
            is_read=False,
            created_at=datetime.datetime.utcnow(),
        )
        db.add(notif)
        db.commit()

        return {
            "success": True,
            "user_id": user.user_id,
            "email": user.email,
            "role": norm_role,
            "message": f"Password reset link sent to the {norm_role} successfully.",
        }

    @staticmethod
    def confirm_user_access(data: dict, db: Session):
        user_id = (data.get("user_id") or "").strip()
        requested_role = (data.get("role") or "").strip()

        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            return {"success": False, "message": f"User account with ID '{user_id}' not found."}

        raw_role = requested_role or user.role or "User"
        if "customer" in raw_role.lower():
            norm_role = "Customer"
        elif "agent" in raw_role.lower():
            norm_role = "Agent"
        elif "underwriter" in raw_role.lower():
            norm_role = "Underwriter"
        elif "admin" in raw_role.lower():
            norm_role = "Admin"
        else:
            norm_role = raw_role

        notif = Notification(
            notification_id=f"NOTIF-RBAC-{uuid.uuid4().hex[:8].upper()}",
            recipient_role="Admin",
            title=f"Access Confirmed: {user.name}",
            message=f"{norm_role} access and permissions confirmed for {user.name} ({user.user_id}).",
            customer_name=user.name,
            status="Completed",
            is_read=False,
            created_at=datetime.datetime.utcnow(),
        )
        db.add(notif)
        db.commit()

        return {
            "success": True,
            "user_id": user.user_id,
            "role": norm_role,
            "message": f"{norm_role} access confirmed successfully.",
        }
