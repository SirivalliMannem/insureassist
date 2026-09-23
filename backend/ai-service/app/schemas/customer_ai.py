from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class CustomerChatRequest(BaseModel):
    """
    Customer AI Chat Request Schema.
    """
    message: str = Field(..., min_length=1, max_length=4000, description="Customer question or inquiry message.")
    customer_id: Optional[str] = Field(None, description="Optional customer identifier.")
    conversation_id: Optional[str] = Field(None, description="Optional conversation identifier.")
    history: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="Recent conversation turns.")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Optional customer/policy/application context.")


class CustomerChatResponse(BaseModel):
    """
    Customer AI Chat Response Schema.
    """
    success: bool = Field(True, description="Indicates whether the request was processed successfully.")
    response: str = Field(..., description="AI generated assistant response text.")
    role: str = Field("customer", description="Target role domain for the conversation.")
    model: str = Field(..., description="LLM model identifier used for response generation.")


class HealthResponse(BaseModel):
    """
    Service health check response schema.
    """
    status: str = Field("healthy", description="Current health status of the service.")
    service: str = Field("ai-service", description="Service identifier name.")
    version: str = Field("1.0.0", description="Semantic service version.")
