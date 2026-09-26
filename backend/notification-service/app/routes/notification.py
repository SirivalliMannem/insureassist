from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, Path, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.auth import get_current_user_context, verify_service_or_user_auth
from app.services.notification_service import NotificationService
from app.schemas.notification import (
    NotificationCreateRequest,
    NotificationResponse,
    UnreadCountResponse,
    MarkAllReadResponse
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications Management"]
)


@router.get(
    "",
    response_model=List[NotificationResponse],
    summary="Get Current User Notifications",
    description="Retrieves authenticated user's notifications sorted newest first. Strictly prevents User A from accessing User B's notifications."
)
async def get_notifications(
    limit: int = Query(50, ge=1, le=100, description="Maximum number of notifications to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    unread_only: bool = Query(False, description="Filter for unread notifications only"),
    current_user: Dict[str, Any] = Depends(get_current_user_context),
    db: Session = Depends(get_db)
):
    return NotificationService.get_notifications(
        user_ctx=current_user,
        db=db,
        limit=limit,
        offset=offset,
        unread_only=unread_only
    )


@router.get(
    "/unread-count",
    response_model=UnreadCountResponse,
    summary="Get Unread Notification Count",
    description="Returns the total number of unread notifications for the currently logged-in user."
)
async def get_unread_count(
    current_user: Dict[str, Any] = Depends(get_current_user_context),
    db: Session = Depends(get_db)
):
    return NotificationService.get_unread_count(user_ctx=current_user, db=db)


@router.patch(
    "/read-all",
    response_model=MarkAllReadResponse,
    summary="Mark All Notifications as Read",
    description="Marks all unread notifications belonging to the authenticated user as read."
)
async def mark_all_as_read(
    current_user: Dict[str, Any] = Depends(get_current_user_context),
    db: Session = Depends(get_db)
):
    return NotificationService.mark_all_read(user_ctx=current_user, db=db)


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
    summary="Mark Single Notification as Read",
    description="Marks a specific notification as read. Enforces ownership: users can only modify their own notifications."
)
async def mark_notification_as_read(
    notification_id: str = Path(..., description="Unique notification ID"),
    current_user: Dict[str, Any] = Depends(get_current_user_context),
    db: Session = Depends(get_db)
):
    return NotificationService.mark_notification_read(
        notification_id=notification_id,
        user_ctx=current_user,
        db=db
    )


@router.post(
    "",
    response_model=NotificationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Notification (Internal / Service-to-Service)",
    description="Creates a new in-app workflow notification. Used centrally by Customer, Agent, Claims, Policy, and Admin services."
)
async def create_notification(
    payload: NotificationCreateRequest,
    auth_ctx: Dict[str, Any] = Depends(verify_service_or_user_auth),
    db: Session = Depends(get_db)
):
    return NotificationService.create_notification(payload=payload, db=db)
