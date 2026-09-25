from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class UserCreateRequest(BaseModel):
    name: str = Field(..., description="User full name")
    email: str = Field(..., description="User email address")
    role: str = Field(..., description="User role (Customer, Agent, Underwriter, Admin)")
    mobile: Optional[str] = Field(default="", description="Mobile number for customer")
    address: Optional[str] = Field(default="", description="Address for customer")
    password: Optional[str] = Field(default="Test@123", description="Ignored. New accounts always receive the bcrypt hash of Test@123.")


class PasswordResetRequest(BaseModel):
    user_id: str = Field(..., description="User ID")
    email: Optional[str] = Field(default="", description="User Email")
    role: Optional[str] = Field(default=None, description="User Role")


class ConfirmAccessRequest(BaseModel):
    user_id: str = Field(..., description="User ID")
    role: Optional[str] = Field(default="", description="User Role")


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    port: int


class CreateConversationRequest(BaseModel):
    title: Optional[str] = Field(default="New Conversation", description="Session title")
    initial_message: Optional[str] = Field(default=None, description="Optional first user message")


class SendMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Message text from Admin")
    conversation_id: Optional[str] = Field(default=None, description="Target conversation ID")


class ChatMessageItem(BaseModel):
    message_id: str
    conversation_id: str
    sender_type: str
    message: str
    created_at: str

    class Config:
        orm_mode = True


class ChatConversationItem(BaseModel):
    conversation_id: str
    customer_id: str
    title: str
    role: str
    created_at: str
    updated_at: str
    last_message: Optional[str] = None
    message_count: int = 0

    class Config:
        orm_mode = True


class AdminChatResponse(BaseModel):
    conversation_id: str
    title: str
    response: str
    message_id: str
    created_at: str

