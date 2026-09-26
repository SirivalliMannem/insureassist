from datetime import datetime, date
from typing import Optional, List, Union
from pydantic import BaseModel, Field


class NotificationCreateRequest(BaseModel):
    recipient_user_id: Optional[str] = Field(None, description="Target recipient user ID or customer ID")
    recipient_role: Optional[str] = Field(None, description="Target recipient role (Customer, Agent, Underwriter, Adjuster, Admin)")
    notification_type: str = Field(..., description="Standardized notification type, e.g. CLAIM_APPROVED")
    title: str = Field(..., min_length=1, max_length=255, description="Notification headline/title")
    message: str = Field(..., min_length=1, description="Notification detailed body message")
    entity_type: Optional[str] = Field(None, description="Associated entity category: CLAIM, POLICY, APPLICATION, USER")
    entity_id: Optional[str] = Field(None, description="Associated entity business identifier, e.g. CLM-1446")

    # Legacy & Workflow fields
    claim_id: Optional[str] = None
    policy_id: Optional[str] = None
    policy_number: Optional[str] = None
    policy_type: Optional[str] = None
    customer_name: Optional[str] = None
    renewal_id: Optional[str] = None
    renewal_date: Optional[Union[date, str]] = None
    renewal_premium: Optional[Union[float, str]] = None
    status: Optional[str] = None


class NotificationResponse(BaseModel):
    notification_id: str
    recipient_user_id: Optional[str] = None
    recipient_role: Optional[str] = None
    notification_type: Optional[str] = None
    title: str
    message: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    is_read: bool = False
    read_at: Optional[datetime] = None
    created_at: datetime

    # Workflow fields
    claim_id: Optional[str] = None
    policy_id: Optional[str] = None
    policy_number: Optional[str] = None
    policy_type: Optional[str] = None
    customer_name: Optional[str] = None
    renewal_id: Optional[str] = None
    renewal_date: Optional[str] = None
    renewal_premium: Optional[str] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True


class UnreadCountResponse(BaseModel):
    unread_count: int


class MarkAllReadResponse(BaseModel):
    message: str = "All notifications marked as read."
    updated_count: int
