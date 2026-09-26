import datetime
import random
import uuid
import logging
from typing import List, Optional, Dict, Any
from sqlalchemy import or_, and_, desc
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.notification import Notification, User, Customer
from app.schemas.notification import (
    NotificationCreateRequest,
    NotificationResponse,
    UnreadCountResponse,
    MarkAllReadResponse
)

logger = logging.getLogger("notification-service.service")


class NotificationService:
    @staticmethod
    def _build_user_filter(user_ctx: Dict[str, Any]):
        """
        Builds SQL filter ensuring current authenticated user only accesses notifications
        addressed to their specific user ID, customer ID, or role broadcast.
        Strictly prevents User A from accessing User B's notifications.
        """
        user_id = str(user_ctx.get("user_id") or "").strip()
        cust_id = str(user_ctx.get("customer_id") or "").strip()
        email = str(user_ctx.get("email") or "").strip()
        role = str(user_ctx.get("role") or "").strip()

        id_conditions = []
        if user_id:
            id_conditions.append(Notification.recipient_user_id == user_id)
            id_conditions.append(Notification.recipient_id == user_id)
        if cust_id:
            id_conditions.append(Notification.recipient_user_id == cust_id)
            id_conditions.append(Notification.recipient_id == cust_id)
        if email:
            id_conditions.append(Notification.recipient_user_id.ilike(email))
            id_conditions.append(Notification.recipient_id.ilike(email))

        # Role-wide notifications with unassigned recipient
        if role:
            role_condition = and_(
                Notification.recipient_role.ilike(role),
                or_(
                    Notification.recipient_user_id == None,
                    Notification.recipient_user_id == "",
                    Notification.recipient_id == None,
                    Notification.recipient_id == ""
                )
            )
            id_conditions.append(role_condition)

        if not id_conditions:
            return Notification.notification_id == "__NONE__"

        return or_(*id_conditions)

    @staticmethod
    def get_notifications(
        user_ctx: Dict[str, Any],
        db: Session,
        limit: int = 50,
        offset: int = 0,
        unread_only: bool = False
    ) -> List[NotificationResponse]:
        """
        Retrieve notifications for the authenticated user, ordered newest first.
        """
        user_filter = NotificationService._build_user_filter(user_ctx)
        query = db.query(Notification).filter(user_filter)

        if unread_only:
            query = query.filter(Notification.is_read == False)

        records = query.order_by(desc(Notification.created_at)).offset(offset).limit(limit).all()

        responses = []
        for r in records:
            prem_str = None
            if r.renewal_premium is not None:
                prem_str = f"${float(r.renewal_premium):,.2f}"

            responses.append(NotificationResponse(
                notification_id=r.notification_id,
                recipient_user_id=r.recipient_user_id or r.recipient_id,
                recipient_role=r.recipient_role,
                notification_type=r.notification_type or "GENERAL_NOTIFICATION",
                title=r.title,
                message=r.message,
                entity_type=r.entity_type or ("CLAIM" if r.claim_id else ("POLICY" if r.policy_id else None)),
                entity_id=r.entity_id or r.claim_id or r.policy_number or r.policy_id,
                is_read=bool(r.is_read),
                read_at=r.read_at,
                created_at=r.created_at,
                claim_id=r.claim_id,
                policy_id=r.policy_id,
                policy_number=r.policy_number,
                policy_type=r.policy_type,
                customer_name=r.customer_name,
                renewal_id=r.renewal_id,
                renewal_date=str(r.renewal_date) if r.renewal_date else None,
                renewal_premium=prem_str,
                status=r.status
            ))

        return responses

    @staticmethod
    def get_unread_count(user_ctx: Dict[str, Any], db: Session) -> UnreadCountResponse:
        """
        Returns the number of unread notifications for the logged-in user.
        """
        user_filter = NotificationService._build_user_filter(user_ctx)
        count = db.query(Notification).filter(user_filter, Notification.is_read == False).count()
        return UnreadCountResponse(unread_count=count)

    @staticmethod
    def mark_notification_read(
        notification_id: str,
        user_ctx: Dict[str, Any],
        db: Session
    ) -> NotificationResponse:
        """
        Marks a specific notification as read.
        Enforces ownership: A user can only mark their OWN notifications as read.
        """
        user_filter = NotificationService._build_user_filter(user_ctx)
        notification = db.query(Notification).filter(
            Notification.notification_id == notification_id,
            user_filter
        ).first()

        if not notification:
            # Check if notification exists at all (to distinguish 403 from 404)
            exists = db.query(Notification).filter(Notification.notification_id == notification_id).first()
            if exists:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to modify this notification."
                )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Notification '{notification_id}' not found."
            )

        now = datetime.datetime.utcnow()
        notification.is_read = True
        notification.read_at = now
        db.commit()
        db.refresh(notification)

        prem_str = None
        if notification.renewal_premium is not None:
            prem_str = f"${float(notification.renewal_premium):,.2f}"

        return NotificationResponse(
            notification_id=notification.notification_id,
            recipient_user_id=notification.recipient_user_id or notification.recipient_id,
            recipient_role=notification.recipient_role,
            notification_type=notification.notification_type or "GENERAL_NOTIFICATION",
            title=notification.title,
            message=notification.message,
            entity_type=notification.entity_type or ("CLAIM" if notification.claim_id else ("POLICY" if notification.policy_id else None)),
            entity_id=notification.entity_id or notification.claim_id or notification.policy_number or notification.policy_id,
            is_read=True,
            read_at=notification.read_at,
            created_at=notification.created_at,
            claim_id=notification.claim_id,
            policy_id=notification.policy_id,
            policy_number=notification.policy_number,
            policy_type=notification.policy_type,
            customer_name=notification.customer_name,
            renewal_id=notification.renewal_id,
            renewal_date=str(notification.renewal_date) if notification.renewal_date else None,
            renewal_premium=prem_str,
            status=notification.status
        )

    @staticmethod
    def mark_all_read(user_ctx: Dict[str, Any], db: Session) -> MarkAllReadResponse:
        """
        Marks all unread notifications belonging to the logged-in user as read.
        """
        user_filter = NotificationService._build_user_filter(user_ctx)
        unread_notifications = db.query(Notification).filter(
            user_filter,
            Notification.is_read == False
        ).all()

        now = datetime.datetime.utcnow()
        count = 0
        for n in unread_notifications:
            n.is_read = True
            n.read_at = now
            count += 1

        db.commit()
        return MarkAllReadResponse(
            message="All notifications marked as read.",
            updated_count=count
        )

    @staticmethod
    def create_notification(
        payload: NotificationCreateRequest,
        db: Session
    ) -> NotificationResponse:
        """
        Internal/Service-to-Service creation of a notification record.
        """
        now = datetime.datetime.utcnow()
        year = now.year
        notif_id = f"NOTIF-{year}-{random.randint(10000, 99999)}"

        # Clean recipient
        recip_id = payload.recipient_user_id.strip() if payload.recipient_user_id else None

        # Parse date if provided
        ren_date = None
        if payload.renewal_date:
            if isinstance(payload.renewal_date, str):
                try:
                    ren_date = datetime.date.fromisoformat(payload.renewal_date.strip()[:10])
                except Exception:
                    pass
            elif isinstance(payload.renewal_date, datetime.date):
                ren_date = payload.renewal_date

        # Parse numeric premium if provided
        ren_prem = None
        if payload.renewal_premium is not None:
            try:
                if isinstance(payload.renewal_premium, (int, float)):
                    ren_prem = float(payload.renewal_premium)
                elif isinstance(payload.renewal_premium, str):
                    clean_str = payload.renewal_premium.replace("$", "").replace(",", "").strip()
                    ren_prem = float(clean_str)
            except Exception:
                pass

        new_notif = Notification(
            notification_id=notif_id,
            recipient_user_id=recip_id,
            recipient_role=payload.recipient_role,
            recipient_id=recip_id,
            notification_type=payload.notification_type,
            title=payload.title.strip(),
            message=payload.message.strip(),
            entity_type=payload.entity_type,
            entity_id=payload.entity_id,
            is_read=False,
            read_at=None,
            created_at=now,
            claim_id=payload.claim_id,
            policy_id=payload.policy_id,
            policy_number=payload.policy_number,
            policy_type=payload.policy_type,
            customer_name=payload.customer_name,
            renewal_id=payload.renewal_id,
            renewal_date=ren_date,
            renewal_premium=ren_prem,
            status=payload.status or "Active"
        )

        db.add(new_notif)
        db.commit()
        db.refresh(new_notif)

        prem_str = None
        if new_notif.renewal_premium is not None:
            prem_str = f"${float(new_notif.renewal_premium):,.2f}"

        return NotificationResponse(
            notification_id=new_notif.notification_id,
            recipient_user_id=new_notif.recipient_user_id,
            recipient_role=new_notif.recipient_role,
            notification_type=new_notif.notification_type,
            title=new_notif.title,
            message=new_notif.message,
            entity_type=new_notif.entity_type,
            entity_id=new_notif.entity_id,
            is_read=new_notif.is_read,
            read_at=new_notif.read_at,
            created_at=new_notif.created_at,
            claim_id=new_notif.claim_id,
            policy_id=new_notif.policy_id,
            policy_number=new_notif.policy_number,
            policy_type=new_notif.policy_type,
            customer_name=new_notif.customer_name,
            renewal_id=new_notif.renewal_id,
            renewal_date=str(new_notif.renewal_date) if new_notif.renewal_date else None,
            renewal_premium=prem_str,
            status=new_notif.status
        )
