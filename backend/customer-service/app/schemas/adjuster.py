from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date, datetime


class AdjusterStatsResponse(BaseModel):
    """
    Schema for Adjuster Dashboard summary metric cards.
    """
    total_claims: int = Field(default=0, description="Total count of claims in shared queue")
    pending_review: int = Field(default=0, description="Claims awaiting review")
    more_information: int = Field(default=0, description="Claims requiring more information/documents")
    resolved_claims: int = Field(default=0, description="Resolved claims (Approved + Rejected)")


class AdjusterCoverageItem(BaseModel):
    coverage_id: str
    coverage_name: str
    coverage_limit: Optional[float] = None
    deductible: Optional[float] = None
    status: Optional[str] = "Active"


class AdjusterExclusionItem(BaseModel):
    exclusion_id: str
    exclusion_name: str
    description: Optional[str] = None


class AdjusterDocumentItem(BaseModel):
    document_id: str
    document_name: str
    document_type: Optional[str] = None
    file_url: Optional[str] = None
    uploaded_at: Optional[str] = None


class AdjusterClaimSummary(BaseModel):
    claim_id: str
    claim_number: str
    customer_id: str
    customer_name: str
    policy_id: str
    policy_number: str
    policy_type: str
    claim_type: str
    reported_date: str
    claimed_amount: Optional[float] = None
    status: str
    approved_amount: Optional[float] = None
    rejection_reason: Optional[str] = None
    decision_notes: Optional[str] = None
    requested_info: Optional[str] = None
    decision_date: Optional[str] = None
    decision_by: Optional[str] = None


class AdjusterClaimDetail(BaseModel):
    # Claim Information
    claim_id: str
    claim_number: str
    claim_type: str
    incident_date: str
    reported_date: str
    description: str
    claimed_amount: Optional[float] = None
    location: Optional[str] = None
    status: str
    approved_amount: Optional[float] = None
    rejection_reason: Optional[str] = None
    decision_notes: Optional[str] = None
    requested_info: Optional[str] = None
    decision_date: Optional[str] = None
    decision_by: Optional[str] = None

    # Customer Information
    customer_id: str
    customer_name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None

    # Policy Information
    policy_id: str
    policy_number: str
    policy_type: str
    policy_status: str
    effective_date: Optional[str] = None
    expiry_date: Optional[str] = None
    premium: Optional[float] = None
    coverages: List[AdjusterCoverageItem] = []
    exclusions: List[AdjusterExclusionItem] = []

    # Documents
    documents: List[AdjusterDocumentItem] = []


class AdjusterDecisionRequest(BaseModel):
    """
    Payload for submitting an Adjuster claim decision.
    """
    decision: str = Field(..., description="Decision action: 'Approved', 'Rejected', or 'More Information Required'")
    approved_amount: Optional[float] = Field(None, description="Approved settlement amount (required for Approved)")
    rejection_reason: Optional[str] = Field(None, description="Reason for rejection (required for Rejected)")
    requested_info: Optional[str] = Field(None, description="Required information/documents (required for More Information Required)")
    decision_notes: Optional[str] = Field(None, description="Detailed notes and findings from the Adjuster")


class AdjusterDecisionResponse(BaseModel):
    claim_id: str
    claim_number: str
    status: str
    message: str
    decision_date: str
    decision_by: Optional[str] = None
