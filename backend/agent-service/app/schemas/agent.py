from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """
    Schema for health check endpoint response.
    """
    status: str = Field(..., description="Service status", example="ok")
    service: str = Field(..., description="Service name identifier", example="agent-service")
    version: str = Field(..., description="Semantic version", example="1.0.0")


class AgentProfileResponse(BaseModel):
    """
    Schema for Agent identity profile data.
    """
    user_id: str = Field(..., description="Unique Agent user ID from database", example="1321")
    name: str = Field(..., description="Agent full name", example="Aarav Nair")
    email: str = Field(..., description="Agent official email address", example="aarav_nair1321@example.com")
    role: str = Field(..., description="Assigned role", example="Agent")


class PremiumByTypeItem(BaseModel):
    """
    Schema for premium distribution by policy type in horizontal chart.
    """
    policy_type: str = Field(..., description="Type of policy (e.g. Homeowners, Auto, Commercial Property)")
    category: str = Field(default="General", description="High-level category label")
    total_premium: float = Field(default=0.0, description="Sum of active annual premium for this type")
    formatted_premium: str = Field(default="$0", description="Formatted currency string")
    count: int = Field(default=0, description="Number of active policies of this type")
    percentage: float = Field(default=0.0, description="Percentage of total portfolio premium")


class AgentDashboardCustomerItem(BaseModel):
    """
    Summary representation of an assigned customer for dashboard tables.
    """
    customer_id: str = Field(..., description="Customer unique ID")
    name: str = Field(..., description="Customer name")
    email: str = Field(..., description="Customer email")
    phone: Optional[str] = Field(None, description="Contact phone / mobile")
    total_policies: int = Field(default=0, description="Total policies count")
    active_policies: int = Field(default=0, description="Active policies count")
    next_renewal: str = Field(default="N/A", description="Next upcoming renewal string")
    renewal_date: Optional[str] = Field(None, description="Date of next renewal")


class AgentDashboardRenewalItem(BaseModel):
    """
    Summary representation of an assigned customer renewal item for dashboard.
    """
    renewal_id: Optional[str] = Field(None, description="Renewal request ID")
    policy_id: str = Field(..., description="Policy ID")
    policy_number: str = Field(..., description="Policy Number")
    policy_type: str = Field(..., description="Policy Type")
    customer_name: str = Field(..., description="Customer Name")
    renewal_date: Optional[str] = Field(None, description="Renewal date")
    renewal_premium: Optional[float] = Field(None, description="Renewal premium")
    current_premium: Optional[float] = Field(None, description="Current premium")
    days_until_expiry: Optional[int] = Field(None, description="Days remaining until renewal")
    status: str = Field(default="Pending Approval", description="Renewal status")
    reminder_sent: bool = Field(default=False, description="Whether a renewal reminder was sent")
    reminder_sent_at: Optional[str] = Field(None, description="Timestamp when reminder was sent")


class ReminderResponse(BaseModel):
    """
    Response schema for policy renewal reminder action.
    """
    success: bool = Field(default=True, description="Success status")
    notification_id: str = Field(..., description="Generated notification ID in database")
    recipient_name: str = Field(..., description="Customer recipient name")
    policy_number: str = Field(..., description="Policy number")
    message: str = Field(..., description="Confirmation message")
    sent_at: str = Field(..., description="Timestamp when reminder was recorded")


class AgentDashboardResponse(BaseModel):
    """
    Schema for Agent dashboard summary metrics calculated strictly from PostgreSQL database records.
    """
    agent_id: str = Field(..., description="Agent user ID", example="1321")
    name: str = Field(..., description="Agent name", example="Aarav Nair")
    email: str = Field(..., description="Agent email", example="aarav_nair1321@example.com")
    
    # Portfolio Counters
    total_assigned_customers: int = Field(default=0, description="Count of customers assigned directly to this agent")
    total_policies: int = Field(default=0, description="Total policies across assigned customers")
    active_policies_count: int = Field(default=0, description="Count of active policies assigned to this agent")
    expired_policies_count: int = Field(default=0, description="Count of expired or cancelled policies")
    pending_renewals_count: int = Field(default=0, description="Count of pending policy renewal requests in database")
    
    # Claims Metrics
    total_claims_count: int = Field(default=0, description="Total claims filed across assigned portfolio")
    pending_claims_count: int = Field(default=0, description="Claims pending inspection or under review")
    approved_claims_count: int = Field(default=0, description="Approved or settled claims")
    rejected_claims_count: int = Field(default=0, description="Rejected or closed without payment claims")
    
    # Financial Analytics
    annual_premium_portfolio: float = Field(default=0.0, description="Total active portfolio annual premium in dollars")
    formatted_annual_premium: str = Field(default="$0", description="Formatted total premium string")
    
    # Chart & Distribution Analytics
    premium_by_type: List[PremiumByTypeItem] = Field(default_factory=list, description="Premium distribution breakdown by policy type")
    
    # Lists & Feeds
    assigned_customers: List[AgentDashboardCustomerItem] = Field(default_factory=list, description="Assigned customers summary list")
    assigned_renewals: List[AgentDashboardRenewalItem] = Field(default_factory=list, description="Upcoming renewal requests list")
    
    assignment_data_available: bool = Field(default=True, description="Whether assignment records exist in PostgreSQL")
    note: str = Field(
        default="Calculated strictly from PostgreSQL database records for authenticated agent.",
        description="Explanation of data source"
    )


class AgentPolicyResponse(BaseModel):
    """
    Schema for an individual policy record assigned to the Agent.
    """
    policy_id: str = Field(..., description="Policy ID")
    policy_number: str = Field(..., description="Policy code / number")
    policy_type: str = Field(..., description="Policy type")
    category: str = Field(default="General", description="Category label")
    customer_id: Optional[str] = Field(None, description="Customer ID")
    customer_name: Optional[str] = Field(None, description="Customer name")
    status: str = Field(..., description="Policy status")
    premium: Optional[str] = Field(None, description="Premium formatted string")
    premium_amount: float = Field(default=0.0, description="Numeric premium amount")
    deductible: Optional[str] = Field(default="$1,000", description="Deductible schedule")
    start_date: Optional[str] = Field(None, description="Start date")
    end_date: Optional[str] = Field(None, description="End date")
    expiry_date: Optional[str] = Field(None, description="Expiry / renewal date")


class AgentCustomerResponse(BaseModel):
    """
    Schema for an individual customer record assigned to the Agent.
    """
    customer_id: str = Field(..., description="Customer unique ID")
    name: str = Field(..., description="Customer name")
    email: str = Field(..., description="Customer email")
    mobile: Optional[str] = Field(None, description="Contact mobile")
    phone: Optional[str] = Field(None, description="Alias for mobile")
    address: Optional[str] = Field(None, description="Physical address")
    total_policies: int = Field(default=0, description="Total policies count")
    active_policies: int = Field(default=0, description="Active policies count")
    next_renewal: str = Field(default="N/A", description="Next renewal indicator")
    renewal_date: Optional[str] = Field(None, description="Renewal date")
    policies: List[AgentPolicyResponse] = Field(default_factory=list, description="All policy contracts held by this customer")
    claims: List[Dict[str, Any]] = Field(default_factory=list, description="All claims filed by this customer")


class AgentCustomersListResponse(BaseModel):
    """
    Schema for the list of customers assigned to the Agent.
    """
    customers: List[AgentCustomerResponse] = Field(default_factory=list, description="List of assigned customers")
    total: int = Field(default=0, description="Total count of assigned customers")
    assignment_data_available: bool = Field(default=True, description="Indicates whether customer assignment relationships exist in the database")
    message: str = Field(
        default="Assigned customers retrieved successfully from PostgreSQL.",
        description="Status or explanation message"
    )


class AgentPoliciesListResponse(BaseModel):
    """
    Schema for the list of policies assigned or accessible to the Agent.
    """
    policies: List[AgentPolicyResponse] = Field(default_factory=list, description="List of accessible policies")
    total: int = Field(default=0, description="Total count of accessible policies")
    assignment_data_available: bool = Field(default=True, description="Indicates whether policy assignment relationships exist in the database")
    message: str = Field(
        default="Assigned policies retrieved successfully from PostgreSQL.",
        description="Status or explanation message"
    )


class RenewalApprovalResponse(BaseModel):
    """
    Schema for renewal approval response.
    """
    renewal_id: str
    status: str
    message: str
    extended_until: Optional[str] = None


class CoverageItem(BaseModel):
    coverage_id: str
    coverage_name: str
    coverage_limit: Optional[float] = None
    formatted_limit: Optional[str] = None
    deductible: Optional[float] = None
    formatted_deductible: Optional[str] = None
    status: Optional[str] = None


class ExclusionItem(BaseModel):
    exclusion_id: str
    exclusion_name: str
    description: Optional[str] = None


class ClaimItem(BaseModel):
    claim_id: str
    claim_number: str
    incident_date: Optional[str] = None
    incident_type: Optional[str] = None
    incident_description: Optional[str] = None
    location: Optional[str] = None
    claim_status: Optional[str] = None
    claim_amount: Optional[float] = None
    formatted_amount: Optional[str] = None


class RenewalItem(BaseModel):
    renewal_id: str
    renewal_date: Optional[str] = None
    renewal_premium: Optional[float] = None
    formatted_renewal_premium: Optional[str] = None
    status: Optional[str] = None


class AgentPolicyDetailResponse(BaseModel):
    policy_id: str
    policy_number: str
    policy_type: str
    category: str = "General"
    status: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    premium: Optional[str] = None
    premium_amount: Optional[float] = None
    customer_id: str
    customer_name: str
    coverages: List[CoverageItem] = Field(default_factory=list)
    exclusions: List[ExclusionItem] = Field(default_factory=list)
    claims: List[ClaimItem] = Field(default_factory=list)
    renewals: List[RenewalItem] = Field(default_factory=list)


class ForwardApplicationRequest(BaseModel):
    """
    Request payload when Agent forwards verified application to Underwriter.
    """
    notes: Optional[str] = Field(None, description="Agent notes/recommendations for the underwriter")
    verification_status: Optional[str] = Field("Verified by Agent", description="Verification state")


class RequestMoreInfoRequest(BaseModel):
    """
    Request payload when Agent requests missing info or documents from customer.
    """
    notes: str = Field(..., description="Explanation of required information or missing documents", example="Please upload proof of recent roof inspection and updated alarm certificate.")
    missing_fields: Optional[List[str]] = Field(default=[], description="List of fields requiring clarification")
    missing_documents: Optional[List[str]] = Field(default=[], description="List of document types required")


class AgentApplicationResponse(BaseModel):
    """
    Detailed schema for policy application in Agent workspace.
    """
    application_id: str
    customer_id: str
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    policy_type: str
    product_name: str
    coverage_tier: str
    coverage_limit: Optional[str] = None
    deductible: Optional[str] = None
    duration_months: int
    start_date: Optional[str] = None
    estimated_premium: str
    status: str
    policy_id: Optional[str] = None
    applicant_info: Optional[dict] = None
    policy_specific_data: Optional[dict] = None
    documents: List[dict] = Field(default_factory=list)
    forwarded_by_agent_id: Optional[str] = None
    forwarded_by_agent_name: Optional[str] = None
    forwarded_at: Optional[str] = None
    agent_notes: Optional[str] = None
    verification_status: Optional[str] = "Pending Verification"
    created_at: str
    updated_at: str


class AgentApplicationsListResponse(BaseModel):
    """
    List of applications in Agent workspace.
    """
    total: int
    applications: List[AgentApplicationResponse]


