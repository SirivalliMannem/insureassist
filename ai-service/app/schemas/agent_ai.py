from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class AgentChatRequest(BaseModel):
    """
    Schema for Agent AI chat requests.
    """
    message: str = Field(..., description="The agent's inquiry or prompt")
    agent_id: Optional[str] = Field(None, description="Authenticated Agent ID")
    conversation_id: Optional[str] = Field(None, description="Persistent conversation session ID")
    history: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Bounded conversation history")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Pre-loaded authorized agent context from Agent Service")


class AgentChatResponse(BaseModel):
    """
    Schema for Agent AI chat responses.
    """
    conversation_id: str = Field(..., description="Conversation session ID")
    title: Optional[str] = Field(None, description="Conversation title")
    response: str = Field(..., description="Agent AI generated answer in clean markdown/text")
    message_id: Optional[str] = Field(None, description="Unique message identifier")
    created_at: Optional[str] = Field(None, description="ISO timestamp")
