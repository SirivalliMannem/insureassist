from typing import List, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """
    Schema for health check endpoint responses.
    """
    status: str = Field(..., description="Service status", example="ok")
    service: str = Field(..., description="Service name identifier", example="customer-service")
    version: str = Field(..., description="Semantic version", example="1.0.0")


class AssignedAgentItem(BaseModel):
    """
    Schema for statically assigned agent details from customer_agent_assignments.
    """
    agent_id: str = Field(..., description="Agent User ID", example="1321")
    name: str = Field(..., description="Agent full name", example="Aarav Nair")
    email: str = Field(..., description="Agent email address", example="aarav_nair1321@example.com")
    phone: Optional[str] = Field(None, description="Agent contact phone", example="(555) 876-5432")
    role: Optional[str] = Field("Agent", description="User role", example="Agent")


class CustomerAssignedAgentResponse(BaseModel):
    """
    Schema for customer assigned agent response derived strictly from customer_agent_assignments.
    """
    customer_id: str = Field(..., description="Customer unique ID", example="CUST-001")
    customer_name: str = Field(..., description="Customer full name", example="Sarah Mitchell")
    assigned_agent: Optional[AssignedAgentItem] = Field(None, description="Statically assigned agent object or null if unassigned")
    assignment_status: str = Field(..., description="Assignment status (e.g. Active, Unassigned)", example="Unassigned")


class CustomerProfileResponse(BaseModel):
    """
    Schema for customer profile data.
    """
    id: str = Field(..., description="Unique customer identifier", example="USR-CUST-001")
    name: str = Field(..., description="Customer full name", example="Sarah Mitchell")
    email: str = Field(..., description="Customer email address", example="sarah.mitchell@email.com")
    phone: str = Field(..., description="Contact phone number", example="+1 (555) 234-5678")
    address: str = Field(..., description="Primary residence address", example="742 Evergreen Terrace, Springfield, OR")
    active_policies_count: int = Field(default=0, description="Total number of active policies")
    open_claims_count: int = Field(default=0, description="Total number of open claims")
    assigned_agent: Optional[AssignedAgentItem] = Field(None, description="Assigned agent from customer_agent_assignments")
    assignment_status: str = Field(default="Unassigned", description="Static assignment status", example="Unassigned")


class PolicySummaryResponse(BaseModel):
    """
    Schema for policy list summary items.
    """
    id: str = Field(..., description="Policy identifier", example="POL-HOM-2024-001")
    policy_number: str = Field(..., description="Policy number / code", example="HOM-883920")
    type: str = Field(..., description="Policy type", example="Homeowners Premier Protection")
    category: str = Field(..., description="Insurance line category", example="Property")
    status: str = Field(..., description="Policy status", example="Active")
    premium: str = Field(..., description="Annual premium formatted string", example="$1,450/yr")
    effective_date: str = Field(..., description="Policy effective date", example="2024-01-15")
    expiry_date: str = Field(..., description="Policy expiry date", example="2025-01-15")
    deductible: str = Field(..., description="Deductible schedule", example="$1,000")


class ClaimSummaryResponse(BaseModel):
    """
    Schema for customer claim list items.
    """
    id: str = Field(..., description="Unique claim identifier", example="CLM-2024-8831")
    policy_id: str = Field(..., description="Associated policy identifier", example="POL-HOM-2024-001")
    policy_name: str = Field(..., description="Associated policy title", example="Homeowners Premier Protection")
    incident_date: str = Field(..., description="Date when incident occurred", example="2024-09-02")
    status: str = Field(..., description="Current claim status", example="Under Review")
    estimated_amount: str = Field(..., description="Estimated claim settlement amount", example="$4,850")
    incident_description: str = Field(..., description="Summary description of incident loss")


class FNOLSubmissionRequest(BaseModel):
    """
    Schema for submitting First Notice of Loss (FNOL).
    """
    policy_id: str = Field(..., description="Selected policy ID for the claim", example="POL-HOM-2024-001")
    incident_date: str = Field(..., description="Date of the loss incident", example="2024-09-08")
    incident_type: str = Field(..., description="Peril / type of incident", example="Water Damage")
    description: str = Field(..., description="Detailed description of the incident")
    location: Optional[str] = Field(None, description="Location where incident occurred")
    estimated_damage: Optional[str] = Field(None, description="Estimated damage value")


class FNOLSubmissionResponse(BaseModel):
    """
    Schema for FNOL submission confirmation.
    """
    claim_id: str = Field(..., description="Generated claim reference ID", example="CLM-2024-9042")
    status: str = Field(..., description="Initial claim status", example="Submitted")
    message: str = Field(..., description="Confirmation message for the customer")
    submitted_at: str = Field(..., description="ISO timestamp of submission")


class RenewalCreationRequest(BaseModel):
    """
    Schema for requesting policy renewal by the customer.
    """
    policy_id: str = Field(..., description="Policy ID to confirm renewal for", example="POL-2026-0100623")


class RenewalResponse(BaseModel):
    """
    Schema for renewal request details and status.
    """
    renewal_id: str = Field(..., description="Unique renewal request ID", example="REN-2026-1042")
    policy_id: str = Field(..., description="Target policy ID", example="POL-2026-0100623")
    policy_number: str = Field(..., description="Policy number", example="POL-2026-0100623")
    policy_type: str = Field(..., description="Policy type/category", example="Auto Comprehensive")
    customer_id: str = Field(..., description="Customer ID", example="1254")
    customer_name: str = Field(..., description="Customer full name", example="Pooja Verma")
    renewal_date: Optional[str] = Field(None, description="Upcoming renewal / expiry date", example="2026-09-18")
    renewal_premium: str = Field(..., description="Renewal premium amount", example="$1,240.00")
    status: str = Field(..., description="Renewal request status", example="Pending Approval")
    created_at: str = Field(..., description="Created timestamp")
    updated_at: str = Field(..., description="Updated timestamp")


class RenewalApprovalResponse(BaseModel):
    """
    Schema for agent approval response.
    """
    renewal_id: str = Field(..., description="Renewal request ID")
    status: str = Field(..., description="Updated status", example="Approved")
    message: str = Field(..., description="Confirmation message")
    policy_id: str = Field(..., description="Policy ID renewed")
    new_end_date: Optional[str] = Field(None, description="Extended policy end date")


class NotificationResponse(BaseModel):
    """
    Schema for workflow notification items.
    """
    notification_id: str = Field(..., description="Notification ID")
    recipient_role: str = Field(..., description="Recipient role (Agent, Customer)")
    recipient_id: Optional[str] = Field(None, description="Recipient identifier")
    title: str = Field(..., description="Notification title")
    message: str = Field(..., description="Notification body")
    policy_id: Optional[str] = Field(None, description="Associated policy ID")
    policy_number: Optional[str] = Field(None, description="Associated policy number")
    policy_type: Optional[str] = Field(None, description="Associated policy type")
    customer_name: Optional[str] = Field(None, description="Customer name")
    renewal_id: Optional[str] = Field(None, description="Renewal ID")
    renewal_date: Optional[str] = Field(None, description="Renewal date")
    renewal_premium: Optional[str] = Field(None, description="Renewal premium")
    status: Optional[str] = Field(None, description="Workflow status")
    is_read: bool = Field(default=False, description="Whether notification was read")
    created_at: str = Field(..., description="Timestamp of notification")


class DocumentItem(BaseModel):
    """
    Schema for uploaded document metadata in application.
    """
    doc_type: str = Field(..., description="Document category type", example="ID Proof")
    file_name: str = Field(..., description="Uploaded file name", example="drivers_license.pdf")
    file_size: Optional[str] = Field(None, description="Formatted file size", example="1.2 MB")
    file_data: Optional[str] = Field(None, description="Optional base64 or stored URL")
    uploaded_at: Optional[str] = Field(None, description="Upload timestamp")


class PolicyApplicationRequest(BaseModel):
    """
    Schema for customer submitting a new policy application.
    """
    policy_type: str = Field(..., description="Target policy type/line of business", example="Homeowners")
    product_name: str = Field(..., description="Selected product title", example="Homeowners Premier Protection (HO-3)")
    coverage_tier: Optional[str] = Field("Standard", description="Selected coverage tier: Basic, Standard, Enhanced, Premium")
    coverage_limit: Optional[float] = Field(None, description="Primary coverage limit amount")
    deductible: Optional[float] = Field(None, description="Selected policy deductible")
    duration_months: Optional[int] = Field(12, description="Policy term duration in months (6, 12, 24)")
    start_date: Optional[str] = Field(None, description="Requested effective start date (YYYY-MM-DD)")
    estimated_premium: Optional[float] = Field(None, description="Calculated annual/term premium")
    applicant_info: Optional[dict] = Field(None, description="Pre-filled & verified applicant details")
    policy_specific_data: Optional[dict] = Field(None, description="Property/vehicle/business answers")
    documents: Optional[List[DocumentItem]] = Field(default=[], description="Uploaded supporting documents")


class PolicyApplicationResponse(BaseModel):
    """
    Schema for policy application details and confirmation.
    """
    application_id: str = Field(..., description="Unique application reference ID", example="APP-2026-10482")
    customer_id: str = Field(..., description="Customer ID", example="50001")
    customer_name: str = Field(..., description="Customer full name")
    policy_type: str = Field(..., description="Policy line of business")
    product_name: str = Field(..., description="Product title")
    coverage_tier: str = Field(..., description="Selected coverage tier")
    coverage_limit: Optional[str] = Field(None, description="Formatted coverage limit")
    deductible: Optional[str] = Field(None, description="Formatted deductible")
    duration_months: int = Field(..., description="Duration in months")
    start_date: Optional[str] = Field(None, description="Effective start date")
    estimated_premium: str = Field(..., description="Formatted estimated premium")
    status: str = Field(..., description="Application lifecycle status (Submitted, Under Review, Approved, Rejected)")
    policy_id: Optional[str] = Field(None, description="Associated Pending Policy ID")
    applicant_info: Optional[dict] = Field(None, description="Applicant profile summary")
    policy_specific_data: Optional[dict] = Field(None, description="Specific risk details")
    documents: List[dict] = Field(default=[], description="Uploaded documents")
    forwarded_by_agent_id: Optional[str] = Field(None, description="Agent ID who forwarded application")
    forwarded_at: Optional[str] = Field(None, description="Timestamp when forwarded to underwriter")
    agent_notes: Optional[str] = Field(None, description="Notes from reviewing agent or requested missing info")
    verification_status: Optional[str] = Field("Pending Verification", description="Document & application verification status")
    created_at: str = Field(..., description="Submission ISO timestamp")
    updated_at: str = Field(..., description="Last update timestamp")


class ProvideMoreInfoRequest(BaseModel):
    """
    Schema for customer providing additional requested information or uploaded documents.
    """
    additional_notes: Optional[str] = Field(None, description="Customer explanation/notes")
    documents: Optional[List[DocumentItem]] = Field(default=[], description="New or updated uploaded documents")
    updated_answers: Optional[dict] = Field(default={}, description="Updated risk or policy answers")


# =========================================================================
# Customer AI Chat Schemas
# =========================================================================

class ChatMessageItem(BaseModel):
    """
    Schema representing an individual chat message in a conversation.
    """
    message_id: str = Field(..., description="Unique message ID")
    conversation_id: str = Field(..., description="Conversation ID")
    sender_type: str = Field(..., description="Sender type: 'user' or 'bot'")
    message: str = Field(..., description="Message text content")
    created_at: str = Field(..., description="Message creation timestamp")

    class Config:
        from_attributes = True


class ChatConversationItem(BaseModel):
    """
    Schema representing a chat conversation session metadata.
    """
    conversation_id: str = Field(..., description="Unique conversation ID")
    customer_id: str = Field(..., description="Owning customer ID")
    title: str = Field(..., description="Conversation title or preview")
    role: str = Field("customer", description="Target role")
    created_at: str = Field(..., description="Creation ISO timestamp")
    updated_at: str = Field(..., description="Last updated ISO timestamp")
    last_message: Optional[str] = Field(None, description="Snippet of latest message")
    message_count: int = Field(0, description="Total messages in conversation")

    class Config:
        from_attributes = True


class CreateConversationRequest(BaseModel):
    """
    Request to start a new chat conversation.
    """
    title: Optional[str] = Field(None, description="Optional title for conversation")
    initial_message: Optional[str] = Field(None, description="Optional initial user prompt")


class SendMessageRequest(BaseModel):
    """
    Request to send a chat message within a conversation.
    """
    message: str = Field(..., min_length=1, max_length=4000, description="User prompt or question")
    conversation_id: Optional[str] = Field(None, description="Target conversation ID; if omitted, active or new conversation is used")


class CustomerChatResponse(BaseModel):
    """
    Response returned to frontend after processing Customer AI prompt.
    """
    conversation_id: str = Field(..., description="Conversation ID")
    title: str = Field(..., description="Conversation title")
    response: str = Field(..., description="AI response text")
    message_id: str = Field(..., description="Message ID of the AI response")
    created_at: str = Field(..., description="Response timestamp")


class GlossaryExplainRequest(BaseModel):
    """
    Customer request to explain an insurance glossary term with AI.
    """
    term: str = Field(..., min_length=1, description="Insurance term to explain")
    definition: Optional[str] = Field(None, description="Standard definition of the term")
    custom_question: Optional[str] = Field(None, description="Optional custom question from customer")


class GlossaryExplainResponse(BaseModel):
    """
    AI-generated explanation and contextual policy application for a glossary term.
    """
    term: str = Field(..., description="The insurance term explained")
    simplified_explanation: str = Field(..., description="Simple, plain-language explanation")
    example: str = Field(..., description="Clear real-world insurance example")
    your_policy_context: str = Field("", description="How the term applies to customer's actual policy if context available")
    key_takeaways: List[str] = Field(default_factory=list, description="Key takeaways or summary points")


class CoverageCheckRequest(BaseModel):
    """
    Customer request to evaluate a coverage scenario against their policies.
    """
    scenario: str = Field(..., min_length=1, max_length=4000, description="Customer incident or scenario to evaluate")


class CoverageCheckResponse(BaseModel):
    """
    AI-assisted coverage assessment and policy application details.
    """
    scenario: str = Field(..., description="The scenario evaluated")
    assessment: str = Field(..., description="Coverage assessment: 'Potentially Covered', 'Not Listed in Available Coverage', or 'Requires Policy Review'")
    status_description: str = Field(..., description="High-level description of the assessment")
    reason: str = Field(..., description="Detailed explanation of why this assessment was reached")
    relevant_policy: Optional[str] = Field(None, description="Name and number of the matching policy if applicable")
    relevant_coverage: Optional[str] = Field(None, description="Specific coverage line item if applicable")
    relevant_exclusion: Optional[str] = Field(None, description="Relevant policy exclusion or limitation if applicable")
    applicable_deductible: Optional[str] = Field(None, description="Applicable deductible amount if found in policy")
    recommended_action: Optional[str] = Field(None, description="Recommended next steps for the customer")






