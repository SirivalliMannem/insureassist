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


class GlossaryExplainRequest(BaseModel):
    """
    Customer AI Glossary Explain Request Schema.
    """
    term: str = Field(..., min_length=1, description="Insurance term to explain.")
    definition: Optional[str] = Field(None, description="Standard glossary definition.")
    custom_question: Optional[str] = Field(None, description="Optional specific customer question.")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Customer policy and account context.")


class GlossaryExplainResponse(BaseModel):
    """
    Customer AI Glossary Explain Response Schema.
    """
    term: str = Field(..., description="Insurance term that was explained.")
    simplified_explanation: str = Field(..., description="Plain-language simplified explanation.")
    example: str = Field(..., description="Real-world practical insurance scenario.")
    your_policy_context: str = Field("", description="Personalized explanation based on customer active policies.")
    key_takeaways: List[str] = Field(default_factory=list, description="Key takeaways or bullet points.")


class CoverageCheckRequest(BaseModel):
    """
    Customer AI Coverage Check Request Schema.
    """
    scenario: str = Field(..., min_length=1, max_length=4000, description="Customer incident or coverage scenario to evaluate.")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Customer policy and account context.")


class CoverageCheckResponse(BaseModel):
    """
    Customer AI Coverage Check Response Schema.
    """
    scenario: str = Field(..., description="The scenario evaluated.")
    assessment: str = Field(..., description="Coverage assessment: 'Potentially Covered', 'Not Listed in Available Coverage', or 'Requires Policy Review'.")
    status_description: str = Field(..., description="High-level description of the assessment.")
    reason: str = Field(..., description="Detailed explanation of why this assessment was reached.")
    relevant_policy: Optional[str] = Field(None, description="Name and number of the matching policy if applicable.")
    relevant_coverage: Optional[str] = Field(None, description="Specific coverage line item if applicable.")
    relevant_exclusion: Optional[str] = Field(None, description="Relevant policy exclusion or limitation if applicable.")
    applicable_deductible: Optional[str] = Field(None, description="Applicable deductible amount if found in policy.")
    recommended_action: Optional[str] = Field(None, description="Recommended next steps for the customer.")


