from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AdminChatRequest(BaseModel):
    """
    Request model for Admin AI Assistant chat interactions.
    """
    message: str = Field(..., min_length=1, description="Admin inquiry or prompt message")
    admin_id: Optional[str] = Field(None, description="Authenticated administrator User ID")
    conversation_id: Optional[str] = Field(None, description="Persistent conversation session ID")
    history: Optional[List[Dict[str, Any]]] = Field(default=[], description="Bounded conversation history")
    context: Optional[Dict[str, Any]] = Field(default={}, description="Authorized admin & governance context")


class AdminChatResponse(BaseModel):
    """
    Structured response model returned by the Admin AI Assistant.
    """
    conversation_id: str = Field(..., description="Unique conversation session identifier")
    title: str = Field(..., description="Conversation title")
    response: str = Field(..., description="Editorial Markdown-formatted AI assistant response")
    message_id: str = Field(..., description="Unique ID of the persisted bot response message")
    created_at: str = Field(..., description="ISO 8601 UTC timestamp")
