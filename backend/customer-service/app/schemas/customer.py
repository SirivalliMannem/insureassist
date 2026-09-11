from typing import List, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """
    Schema for health check endpoint responses.
    """
    status: str = Field(..., description="Service status", example="ok")
    service: str = Field(..., description="Service name identifier", example="customer-service")
    version: str = Field(..., description="Semantic version", example="1.0.0")


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

