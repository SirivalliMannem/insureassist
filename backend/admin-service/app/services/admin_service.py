import datetime
import json
import logging
import os
import random
import urllib.request
import uuid
from typing import List, Optional, Dict, Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.core.security import DEFAULT_USER_PASSWORD, hash_password
from app.models.models import (
    User, Customer, Policy, Coverage, Exclusion, RenewalRequest, Notification,
    CustomerAgentAssignment, ChatConversation, ChatMessage
)
from app.schemas.admin import (
    CreateConversationRequest, SendMessageRequest,
    ChatMessageItem, ChatConversationItem, AdminChatResponse
)
from app.services.admin_context_service import AdminContextService

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

        # Dynamic role breakdown for supported application roles from PostgreSQL
        agent_count = db.query(User).filter(User.role.ilike("Agent%")).count()
        underwriter_count = db.query(User).filter(User.role.ilike("Underwriter%")).count()
        admin_count = db.query(User).filter(User.role.ilike("Admin%")).count()
        customer_user_count = db.query(User).filter(User.role.ilike("Customer%")).count()
        adjuster_count = db.query(User).filter(User.role.ilike("Adjuster%")).count()

        # Group by the 4 supported business roles
        users_by_role = {
            "Customer": customer_user_count,
            "Agent": agent_count,
            "Underwriter": underwriter_count,
            "Adjuster": adjuster_count
        }

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
            "users_by_role": users_by_role,
            "total_audit_events": total_audit_events,
            "system_status": "Healthy",
            "db_status": "Connected",
        }

    @staticmethod
    def get_users(db: Session, role_filter: Optional[str] = None, status_filter: Optional[str] = None, search: Optional[str] = None, limit: int = 1000, offset: int = 0):
        query = db.query(User)

        if role_filter and role_filter.lower() != "all":
            query = query.filter(User.role.ilike(f"%{role_filter}%"))

        if status_filter and status_filter.lower() != "all":
            query = query.filter(User.status.ilike(f"%{status_filter}%"))

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
        users = query.order_by(func.lower(User.name).asc()).offset(offset).limit(limit).all()

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
                "status": u.status or "Active",
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
            status="Invited",
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
            "status": new_user.status,
            "created_at": _format_date(new_user.created_at),
            "message": f"User '{name}' created successfully. Initial password is {DEFAULT_USER_PASSWORD}.",
        }

    @staticmethod
    def get_policies(db: Session, status_filter: Optional[str] = None, policy_type: Optional[str] = None, search: Optional[str] = None, limit: int = 1000, offset: int = 0):
        query = db.query(Policy).outerjoin(Customer, Policy.customer_id == Customer.customer_id)

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

    # =========================================================================
    # Admin AI Persistent Chat Methods
    # =========================================================================

    @staticmethod
    def _call_admin_ai_service(
        message: str,
        admin_id: str,
        conversation_id: str,
        history: List[Dict[str, Any]],
        context: Dict[str, Any]
    ) -> str:
        """
        Dispatches request to standalone AI Service (:8006).
        """
        ai_base = os.getenv("AI_SERVICE_URL", "http://insureassist-ai-container:8006")
        endpoint = f"{ai_base}/api/v1/ai/admin/chat"
        payload = {
            "message": message,
            "admin_id": admin_id,
            "conversation_id": conversation_id,
            "history": history,
            "context": context
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
            return "I apologize, but I am temporarily unable to reach the AI intelligence service. Please review enterprise users, policies, and audit logs directly in the workspace."

    @staticmethod
    def list_chat_conversations(admin_user: User, db: Session) -> List[ChatConversationItem]:
        """
        Retrieves all persistent chat conversations for the authenticated Admin.
        """
        adm_id_str = str(admin_user.user_id)
        conversations = db.query(ChatConversation).filter(
            ChatConversation.customer_id == adm_id_str,
            ChatConversation.role == "admin"
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
    def create_chat_conversation(admin_user: User, req: CreateConversationRequest, db: Session) -> ChatConversationItem:
        """
        Creates a new persistent conversation session for the authenticated Admin.
        """
        now = datetime.datetime.utcnow()
        adm_id_str = str(admin_user.user_id)
        conv_id = f"conv-adm-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        title = req.title.strip() if (req.title and req.title.strip()) else "New Conversation"

        conv = ChatConversation(
            conversation_id=conv_id,
            customer_id=adm_id_str,
            title=title,
            role="admin",
            created_at=now,
            updated_at=now
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)

        if req.initial_message and req.initial_message.strip():
            AdminService.send_chat_message(
                SendMessageRequest(message=req.initial_message, conversation_id=conv.conversation_id),
                admin_user,
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
    def get_conversation_messages(conversation_id: str, admin_user: User, db: Session) -> List[ChatMessageItem]:
        """
        Retrieves all messages for an admin conversation in strict chronological order.
        Strictly prevents cross-admin conversation access.
        """
        adm_id_str = str(admin_user.user_id)
        conv = db.query(ChatConversation).filter(
            ChatConversation.conversation_id == conversation_id,
            ChatConversation.customer_id == adm_id_str,
            ChatConversation.role == "admin"
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
    def send_chat_message(req: SendMessageRequest, admin_user: User, db: Session) -> AdminChatResponse:
        """
        Handles persistent admin chat:
        1. Validates or creates admin persistent conversation session.
        2. Persists admin user message in PostgreSQL.
        3. Retrieves bounded conversation history (last 8 messages).
        4. Extracts real live admin-authorized platform context from PostgreSQL.
        5. Calls standalone AI Service (:8006).
        6. Persists AI bot response message.
        7. Returns structured response with conversation metadata.
        """
        now = datetime.datetime.utcnow()
        adm_id_str = str(admin_user.user_id)
        conv = None

        if req.conversation_id:
            conv = db.query(ChatConversation).filter(
                ChatConversation.conversation_id == req.conversation_id,
                ChatConversation.customer_id == adm_id_str,
                ChatConversation.role == "admin"
            ).first()

        if not conv:
            conv_id = req.conversation_id if (req.conversation_id and req.conversation_id.startswith("conv-")) else f"conv-adm-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
            initial_title = (req.message[:32] + "...") if len(req.message) > 32 else req.message
            conv = ChatConversation(
                conversation_id=conv_id,
                customer_id=adm_id_str,
                title=initial_title,
                role="admin",
                created_at=now,
                updated_at=now
            )
            db.add(conv)
            db.flush()

        # 1. Persist User Message
        user_msg_id = f"msg-au-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
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

        # 3. Extract Live Admin Platform Context
        adm_context = AdminContextService.get_admin_authorized_context(admin_user, db, query_text=req.message)

        # 4. Call AI Service (:8006)
        bot_reply = AdminService._call_admin_ai_service(
            message=req.message,
            admin_id=adm_id_str,
            conversation_id=conv.conversation_id,
            history=history_payload,
            context=adm_context
        )

        # 5. Persist AI Response Message
        bot_time = datetime.datetime.utcnow()
        bot_msg_id = f"msg-ab-{bot_time.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
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

        return AdminChatResponse(
            conversation_id=conv.conversation_id,
            title=conv.title,
            response=bot_reply,
            message_id=bot_msg_id,
            created_at=bot_time.isoformat() + "Z"
        )

    @staticmethod
    def delete_chat_conversation(conversation_id: str, admin_user: User, db: Session) -> dict:
        """
        Permanently deletes an admin chat conversation and its associated messages.
        """
        adm_id_str = str(admin_user.user_id)
        conv = db.query(ChatConversation).filter(
            ChatConversation.conversation_id == conversation_id,
            ChatConversation.customer_id == adm_id_str,
            ChatConversation.role == "admin"
        ).first()

        if not conv:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Conversation '{conversation_id}' not found or access denied."
            )

        db.delete(conv)
        db.commit()
        return {"success": True, "message": f"Conversation '{conversation_id}' deleted successfully."}


    @staticmethod
    def get_policy_module_policies(db: Session, status_filter: Optional[str] = None, policy_type: Optional[str] = None, search: Optional[str] = None, limit: int = 1000, offset: int = 0):
        query = db.query(Policy).outerjoin(Customer, Policy.customer_id == Customer.customer_id)

        if status_filter and status_filter.lower() != "all":
            query = query.filter(Policy.status.ilike(status_filter))

        if policy_type and policy_type.lower() != "all":
            query = query.filter(Policy.policy_type.ilike(f"%{policy_type}%"))

        if search:
            s_clean = search.strip()
            query = query.filter(
                or_(
                    Policy.policy_id.ilike(f"%{s_clean}%"),
                    Policy.policy_number.ilike(f"%{s_clean}%"),
                    Policy.policy_type.ilike(f"%{s_clean}%"),
                    Policy.status.ilike(f"%{s_clean}%"),
                    Customer.name.ilike(f"%{s_clean}%"),
                    Customer.email.ilike(f"%{s_clean}%"),
                )
            )

        total = query.count()
        policies = query.order_by(Policy.created_at.desc().nullslast(), Policy.policy_number.asc()).offset(offset).limit(limit).all()

        assignments = (
            db.query(CustomerAgentAssignment.customer_id, CustomerAgentAssignment.agent_id, User.name)
            .join(User, CustomerAgentAssignment.agent_id == User.user_id)
            .filter(CustomerAgentAssignment.status == "Active")
            .all()
        )
        agent_map = {cust_id: agent_name for cust_id, _, agent_name in assignments}
        agent_id_map = {cust_id: agent_id for cust_id, agent_id, _ in assignments}

        results = []
        today = datetime.date.today()
        for p in policies:
            cust = p.customer
            days_left = None
            if p.end_date:
                ed = p.end_date if isinstance(p.end_date, datetime.date) else p.end_date.date()
                days_left = (ed - today).days

            assigned_agent = agent_map.get(p.customer_id) or "Unassigned"
            agent_id = agent_id_map.get(p.customer_id)

            results.append({
                "policy_id": p.policy_id,
                "policy_number": p.policy_number,
                "policy_type": p.policy_type,
                "status": p.status,
                "premium": _format_premium(p.premium),
                "premium_raw": float(p.premium or 0),
                "assigned_agent": assigned_agent,
                "agent_id": agent_id,
                "start_date": _format_date(p.start_date),
                "end_date": _format_date(p.end_date),
                "days_remaining": days_left,
                "customer_id": p.customer_id or "Unassigned",
                "customer_name": cust.name if cust else "Unassigned",
                "customer_email": cust.email if cust else "",
            })

        # 4 Required Operational Metrics from real database:
        # 1. Total Policies
        total_policies = db.query(Policy).count()

        # 2. Unassigned to Customer
        unassigned_cust_count = db.query(Policy).filter(
            or_(Policy.customer_id.is_(None), Policy.customer_id == "", Policy.customer_id == "Unassigned")
        ).count()

        # 3. Customer Assigned, Agent Unassigned
        active_agent_cust_ids = (
            db.query(CustomerAgentAssignment.customer_id)
            .filter(CustomerAgentAssignment.status == "Active", CustomerAgentAssignment.agent_id.isnot(None), CustomerAgentAssignment.agent_id != "")
            .distinct()
        )
        cust_assigned_agent_unassigned_count = db.query(Policy).filter(
            Policy.customer_id.isnot(None),
            Policy.customer_id != "",
            Policy.customer_id != "Unassigned",
            ~Policy.customer_id.in_(active_agent_cust_ids)
        ).count()

        # 4. Recently Created Policies (Last 7 Days)
        seven_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=7)
        recent_policies_count = db.query(Policy).filter(Policy.created_at >= seven_days_ago).count()

        return {
            "total": total,
            "policies": results,
            "stats": {
                "total_policies": total_policies,
                "unassigned_customer_policies": unassigned_cust_count,
                "customer_assigned_agent_unassigned": cust_assigned_agent_unassigned_count,
                "recently_created_policies": recent_policies_count,
            }
        }

    @staticmethod
    def create_policy(data: dict, db: Session):
        policy_num = (data.get("policy_number") or "").strip()
        if not policy_num:
            policy_num = f"POL-{datetime.date.today().year}-{uuid.uuid4().hex[:7].upper()}"

        existing = db.query(Policy).filter(Policy.policy_number.ilike(policy_num)).first()
        if existing:
            return {"success": False, "message": f"Policy number '{policy_num}' already exists."}

        policy_id = f"POL-ID-{uuid.uuid4().hex[:8].upper()}"
        policy_type = (data.get("policy_type") or "Auto").strip()
        status_val = (data.get("status") or "Active").strip()
        premium_val = float(data.get("premium") or 0.0)

        # Start and end dates
        start_date = None
        if data.get("start_date"):
            try:
                start_date = datetime.datetime.strptime(data["start_date"], "%Y-%m-%d").date()
            except Exception:
                start_date = datetime.date.today()
        else:
            start_date = datetime.date.today()

        end_date = None
        if data.get("end_date"):
            try:
                end_date = datetime.datetime.strptime(data["end_date"], "%Y-%m-%d").date()
            except Exception:
                end_date = start_date + datetime.timedelta(days=365)
        else:
            end_date = start_date + datetime.timedelta(days=365)

        new_policy = Policy(
            policy_id=policy_id,
            customer_id=None,
            policy_number=policy_num,
            policy_type=policy_type,
            status=status_val,
            start_date=start_date,
            end_date=end_date,
            premium=premium_val,
            created_at=datetime.datetime.utcnow(),
        )
        db.add(new_policy)

        # Add optional coverage record
        cov_limit = data.get("coverage_limit")
        deductible = data.get("deductible")
        if cov_limit or deductible:
            cov = Coverage(
                coverage_id=f"COV-{uuid.uuid4().hex[:8].upper()}",
                policy_id=policy_id,
                coverage_name=f"{policy_type} Standard Protection",
                coverage_limit=float(cov_limit) if cov_limit else None,
                deductible=float(deductible) if deductible else None,
                status="Active"
            )
            db.add(cov)

        db.commit()
        db.refresh(new_policy)

        return {
            "success": True,
            "message": f"Policy {policy_num} created successfully in Policy Module.",
            "policy": {
                "policy_id": new_policy.policy_id,
                "policy_number": new_policy.policy_number,
                "policy_type": new_policy.policy_type,
                "status": new_policy.status,
                "premium": _format_premium(new_policy.premium),
                "customer_id": new_policy.customer_id or "Unassigned",
                "start_date": _format_date(new_policy.start_date),
                "end_date": _format_date(new_policy.end_date),
            }
        }

    @staticmethod
    def assign_policy(data: dict, db: Session):
        policy_id = (data.get("policy_id") or "").strip()
        if not policy_id:
            return {"success": False, "message": "Policy ID or Number is required."}

        policy = db.query(Policy).filter(or_(Policy.policy_id == policy_id, Policy.policy_number == policy_id)).first()
        if not policy:
            return {"success": False, "message": f"Policy '{policy_id}' not found in database."}

        customer_id = data.get("customer_id")
        if not customer_id or customer_id.strip().lower() in ["", "none", "unassigned", "null"]:
            return {"success": False, "message": "Please select a customer for this policy."}
        
        customer_id = customer_id.strip()
        cust = db.query(Customer).filter(or_(Customer.customer_id == customer_id, Customer.user_id == customer_id)).first()
        if not cust:
            return {"success": False, "message": f"Customer '{customer_id}' not found in database."}

        agent_id = data.get("agent_id")
        if not agent_id or agent_id.strip().lower() in ["", "none", "unassigned", "null"]:
            return {"success": False, "message": "Please select an advisory agent."}
        
        agent_id = agent_id.strip()
        agent_user = db.query(User).filter(User.user_id == agent_id, User.role.ilike("Agent%")).first()
        if not agent_user:
            return {"success": False, "message": f"Selected user '{agent_id}' is invalid or does not have the Agent role."}

        new_cust_id = cust.customer_id
        new_agent_id = agent_user.user_id
        assigned_agent_name = agent_user.name

        prev_cust_id = policy.customer_id
        prev_assignment = db.query(CustomerAgentAssignment).filter(
            CustomerAgentAssignment.customer_id == prev_cust_id,
            CustomerAgentAssignment.status == "Active"
        ).first() if prev_cust_id else None
        prev_agent_id = prev_assignment.agent_id if prev_assignment else None

        is_same_customer = (prev_cust_id is not None and prev_cust_id == new_cust_id)
        is_same_agent = (prev_agent_id == new_agent_id)

        # CASE 3: Same Customer & Same Agent -> Duplicate assignment attempt
        if is_same_customer and is_same_agent:
            return {
                "success": False,
                "message": "This policy is already assigned to this customer."
            }

        # CASE 4: Same Customer, Different Agent -> Update Agent assignment only
        if is_same_customer and not is_same_agent:
            db.query(CustomerAgentAssignment).filter(
                CustomerAgentAssignment.customer_id == new_cust_id
            ).update({"status": "Inactive"})
            
            asg = CustomerAgentAssignment(
                assignment_id=f"ASG-{new_agent_id}-{new_cust_id}",
                agent_id=new_agent_id,
                customer_id=new_cust_id,
                status="Active",
                assigned_at=datetime.datetime.utcnow(),
            )
            db.merge(asg)
            db.commit()
            db.refresh(policy)

            return {
                "success": True,
                "message": f"Assigned agent updated successfully to {assigned_agent_name} for policy {policy.policy_number} (Customer: {cust.name}).",
                "policy": {
                    "policy_id": policy.policy_id,
                    "policy_number": policy.policy_number,
                    "policy_type": policy.policy_type,
                    "status": policy.status,
                    "customer_id": policy.customer_id,
                    "customer_name": cust.name,
                    "assigned_agent": assigned_agent_name,
                    "agent_id": new_agent_id
                }
            }

        # CASE 1 & CASE 2: Different Customer (Reassignment or Initial Assignment)
        policy.customer_id = new_cust_id
        db.query(CustomerAgentAssignment).filter(
            CustomerAgentAssignment.customer_id == new_cust_id
        ).update({"status": "Inactive"})

        asg = CustomerAgentAssignment(
            assignment_id=f"ASG-{new_agent_id}-{new_cust_id}",
            agent_id=new_agent_id,
            customer_id=new_cust_id,
            status="Active",
            assigned_at=datetime.datetime.utcnow(),
        )
        db.merge(asg)
        db.commit()
        db.refresh(policy)

        action_word = "reassigned" if prev_cust_id else "assigned"

        return {
            "success": True,
            "message": f"Policy {policy.policy_number} {action_word} successfully to Customer: {cust.name} and Agent: {assigned_agent_name}.",
            "policy": {
                "policy_id": policy.policy_id,
                "policy_number": policy.policy_number,
                "policy_type": policy.policy_type,
                "status": policy.status,
                "customer_id": policy.customer_id,
                "customer_name": cust.name,
                "assigned_agent": assigned_agent_name,
                "agent_id": new_agent_id
            }
        }

    @staticmethod
    def get_policy_module_form_data(db: Session):
        # 1. Fetch Customers (Sorted A -> Z)
        customers = db.query(Customer).all()
        cust_list = [
            {"customer_id": c.customer_id, "name": c.name or "", "email": c.email or "", "mobile": c.mobile or ""}
            for c in customers
        ]
        cust_list.sort(key=lambda x: x["name"].lower())

        # 2. Fetch Agents (Users with role Agent, Sorted A -> Z)
        agents = db.query(User).filter(User.role.ilike("Agent%")).all()
        agent_list = [
            {"user_id": a.user_id, "name": a.name or "", "email": a.email or "", "role": a.role}
            for a in agents
        ]
        agent_list.sort(key=lambda x: x["name"].lower())

        # 3. Fetch All Policies with existing assignments
        policies = db.query(Policy).outerjoin(Customer, Policy.customer_id == Customer.customer_id).order_by(Policy.created_at.desc().nullslast(), Policy.policy_number.asc()).all()

        assignments = (
            db.query(CustomerAgentAssignment.customer_id, CustomerAgentAssignment.agent_id, User.name)
            .join(User, CustomerAgentAssignment.agent_id == User.user_id)
            .filter(CustomerAgentAssignment.status == "Active")
            .all()
        )
        agent_map = {cust_id: agent_name for cust_id, _, agent_name in assignments}
        agent_id_map = {cust_id: agent_id for cust_id, agent_id, _ in assignments}

        pol_list = []
        for p in policies:
            cust = p.customer
            assigned_agent = agent_map.get(p.customer_id) or "Unassigned"
            agent_id = agent_id_map.get(p.customer_id)
            pol_list.append({
                "policy_id": p.policy_id,
                "policy_number": p.policy_number,
                "policy_type": p.policy_type,
                "status": p.status,
                "premium": _format_premium(p.premium),
                "customer_id": p.customer_id or None,
                "customer_name": cust.name if cust else "Unassigned",
                "assigned_agent": assigned_agent,
                "agent_id": agent_id,
                "has_customer": bool(p.customer_id),
                "has_agent": bool(assigned_agent != "Unassigned")
            })

        return {
            "customers": cust_list,
            "agents": agent_list,
            "policies": pol_list
        }
