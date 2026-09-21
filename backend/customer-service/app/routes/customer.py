from typing import List, Optional
from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_customer, get_token_payload, get_current_agent_or_staff
from app.db.database import get_db
from app.models.customer import Customer
from app.schemas.customer import (
    CustomerProfileResponse,
    PolicySummaryResponse,
    ClaimSummaryResponse,
    FNOLSubmissionRequest,
    FNOLSubmissionResponse,
    RenewalCreationRequest,
    RenewalResponse,
    RenewalApprovalResponse,
    NotificationResponse,
    PolicyApplicationRequest,
    PolicyApplicationResponse,
    ProvideMoreInfoRequest
)
from app.services.customer_service import CustomerService

router = APIRouter(
    prefix="/customer",
    tags=["Customer Operations"]
)

agent_router = APIRouter(
    prefix="/agent",
    tags=["Agent Operations"]
)

notification_router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# =========================================================================
# Customer Profile, Policies, and Claims
# =========================================================================

@router.get(
    "/profile",
    response_model=CustomerProfileResponse,
    summary="Get Customer Profile",
    description="Retrieves the personal information and high-level insurance summary of the authenticated customer from PostgreSQL."
)
async def get_customer_profile(
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Retrieve authenticated customer profile details.
    """
    return CustomerService.get_profile(current_customer, db)


@router.get(
    "/assigned-agent",
    summary="Get Authenticated Customer Assigned Agent",
    description="Returns the statically assigned agent from customer_agent_assignments or explicit Unassigned status."
)
async def get_customer_assigned_agent(
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Retrieve statically assigned agent for authenticated customer.
    """
    return CustomerService.get_assigned_agent(current_customer, db)


@router.get(
    "/{customer_id}/assigned-agent",
    summary="Get Customer Assigned Agent By ID",
    description="Returns the statically assigned agent from customer_agent_assignments or explicit Unassigned status for a given customer."
)
async def get_assigned_agent_by_id(
    customer_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve statically assigned agent for any customer by ID.
    """
    return CustomerService.get_assigned_agent_by_id(customer_id, db)


@router.get(
    "/policies",
    response_model=List[PolicySummaryResponse],
    summary="List Customer Policies",
    description="Returns all active and historical insurance contracts held by the authenticated customer from PostgreSQL."
)
async def list_customer_policies(
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Retrieve list of authenticated customer's policies.
    """
    return CustomerService.get_policies(current_customer, db)


@router.get(
    "/claims",
    response_model=List[ClaimSummaryResponse],
    summary="List Customer Claims",
    description="Returns all submitted First Notice of Loss (FNOL) and active claims for the authenticated customer from PostgreSQL."
)
async def list_customer_claims(
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Retrieve list of authenticated customer's filed claims.
    """
    return CustomerService.get_claims(current_customer, db)


@router.post(
    "/claims/fnol",
    response_model=FNOLSubmissionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit First Notice of Loss (FNOL)",
    description="Submits a new insurance claim, validates customer policy ownership, and persists the record in PostgreSQL."
)
async def submit_fnol(
    claim_in: FNOLSubmissionRequest,
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Submit a First Notice of Loss (FNOL) claim into PostgreSQL.
    """
    return CustomerService.submit_fnol(claim_in, current_customer, db)


# =========================================================================
# Customer Renewal Approval Workflow
# =========================================================================

@router.post(
    "/renewals/request",
    response_model=RenewalResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Request Policy Renewal",
    description="Customer clicks 'Confirm Renewal' to submit a renewal request to PostgreSQL (status: Pending Approval) and generate an agent notification."
)
async def request_customer_renewal(
    renewal_in: RenewalCreationRequest,
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Submit policy renewal approval request into PostgreSQL.
    """
    return CustomerService.request_renewal(renewal_in, current_customer, db)


@router.get(
    "/renewals",
    response_model=List[RenewalResponse],
    summary="List Customer Renewal Requests",
    description="Retrieves all policy renewal requests for the authenticated customer."
)
async def list_customer_renewals(
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Retrieve list of customer's active and historical renewal requests.
    """
    return CustomerService.get_customer_renewals(current_customer, db)


# =========================================================================
# Customer Policy Applications Workflow (Intake & Tracking)
# =========================================================================

@router.post(
    "/applications",
    response_model=PolicyApplicationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Policy Application",
    description="Customer submits an application for a new insurance policy with coverage selections, property/risk data, and uploaded documents."
)
async def submit_policy_application(
    application_in: PolicyApplicationRequest,
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Persist new policy application and linked pending policy into PostgreSQL.
    """
    return CustomerService.submit_application(application_in, current_customer, db)


@router.get(
    "/applications",
    response_model=List[PolicyApplicationResponse],
    summary="List Customer Policy Applications",
    description="Retrieves all policy applications submitted by the authenticated customer with live statuses."
)
async def list_customer_applications(
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Retrieve list of policy applications submitted by authenticated customer.
    """
    return CustomerService.get_customer_applications(current_customer, db)


@router.get(
    "/applications/{application_id}",
    response_model=PolicyApplicationResponse,
    summary="Get Application Details",
    description="Retrieves full details of a specific policy application submitted by the authenticated customer."
)
async def get_customer_application_detail(
    application_id: str,
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Retrieve single policy application details.
    """
    return CustomerService.get_application_detail(application_id, current_customer, db)


@router.post(
    "/applications/{application_id}/provide-info",
    response_model=PolicyApplicationResponse,
    summary="Provide Requested Application Info & Documents",
    description="Customer uploads missing documents or details requested by the Agent, returning application to Agent Review."
)
async def customer_provide_more_info(
    application_id: str,
    req_in: ProvideMoreInfoRequest,
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    """
    Customer resubmits requested info/documents.
    """
    return CustomerService.provide_more_information(application_id, req_in, current_customer, db)



# =========================================================================
# Agent Renewal Review & Approval
# =========================================================================

@agent_router.get(
    "/renewals",
    response_model=List[RenewalResponse],
    summary="List Approaching Renewals for Agent Review",
    description="Retrieves renewal requests submitted by customers awaiting review and approval."
)
async def list_agent_renewals(
    status_filter: Optional[str] = None,
    _staff: dict = Depends(get_current_agent_or_staff),
    db: Session = Depends(get_db)
):
    """
    List pending policy renewal requests for agent review.
    """
    return CustomerService.get_agent_renewals(db, status_filter=status_filter)


@agent_router.post(
    "/renewals/{renewal_id}/approve",
    response_model=RenewalApprovalResponse,
    summary="Approve Policy Renewal",
    description="Agent approves a customer renewal request, updates status to Approved, extends policy term in PostgreSQL, and notifies customer."
)
async def approve_agent_renewal(
    renewal_id: str,
    _staff: dict = Depends(get_current_agent_or_staff),
    db: Session = Depends(get_db)
):
    """
    Approve policy renewal request in PostgreSQL.
    """
    return CustomerService.approve_renewal(renewal_id, db)


# =========================================================================
# Workflow Notifications (Customer & Agent)
# =========================================================================

@notification_router.get(
    "",
    response_model=List[NotificationResponse],
    summary="Get User Notifications",
    description="Retrieves in-app workflow notifications for the authenticated Customer or Agent."
)
async def get_user_notifications(
    payload: dict = Depends(get_token_payload),
    db: Session = Depends(get_db)
):
    """
    Retrieve workflow notifications for the authenticated user.
    """
    role = payload.get("role", "")
    user_id = payload.get("sub")
    email = payload.get("email")

    # If role is Customer, attempt to find customer_id
    customer_id = None
    if role.strip().lower() == "customer":
        cust = db.query(Customer).filter(
            (Customer.user_id == user_id) | (Customer.customer_id == user_id) | (Customer.email.ilike(email or ""))
        ).first()
        if cust:
            customer_id = cust.customer_id

    return CustomerService.get_notifications(
        role=role,
        customer_id=customer_id,
        user_id=user_id,
        email=email,
        db=db
    )


@notification_router.post(
    "/{notification_id}/read",
    summary="Mark Notification Read",
    description="Marks a workflow notification as read."
)
async def mark_user_notification_read(
    notification_id: str,
    payload: dict = Depends(get_token_payload),
    db: Session = Depends(get_db)
):
    """
    Mark a workflow notification as read.
    """
    return CustomerService.mark_notification_read(notification_id, db)

