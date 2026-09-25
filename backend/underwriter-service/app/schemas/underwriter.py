from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class DecisionRequest(BaseModel):
    item_id: str = Field(..., description="ID of the queue item or renewal request")
    decision: str = Field(..., description="Approved, Rejected, or Needs More Information")
    notes: Optional[str] = Field(default="", description="Underwriter notes or remarks")


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


# =========================================================================
# Underwriter AI & Persistent Chat Schemas
# =========================================================================

class CreateConversationRequest(BaseModel):
    title: Optional[str] = Field("New Conversation", description="Title for the conversation")
    initial_message: Optional[str] = Field(None, description="Optional starting message")


class SendMessageRequest(BaseModel):
    message: str = Field(..., description="The underwriter message or prompt")
    conversation_id: Optional[str] = Field(None, description="Target conversation ID")


class ChatConversationItem(BaseModel):
    conversation_id: str
    customer_id: str
    title: str
    role: str = "underwriter"
    created_at: str
    updated_at: str
    last_message: Optional[str] = None
    message_count: int = 0


class ChatMessageItem(BaseModel):
    message_id: str
    conversation_id: str
    sender_type: str
    message: str
    created_at: str


class UnderwriterChatResponse(BaseModel):
    conversation_id: str
    title: Optional[str] = None
    response: str
    message_id: Optional[str] = None
    created_at: Optional[str] = None
