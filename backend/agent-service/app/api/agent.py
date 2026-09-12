import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_agent_user
from app.db.database import get_db
from app.models.agent import User
from app.schemas.agent import (
    AgentProfileResponse,
    AgentDashboardResponse,
    AgentCustomersListResponse,
    AgentPoliciesListResponse,
    AgentPolicyDetailResponse,
    ReminderResponse
)
from app.services.agent_service import AgentService

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/agent",
    tags=["Agent Operations"]
)


@router.get(
    "/me",
    response_model=AgentProfileResponse,
    summary="Get Current Agent Profile",
    description="Returns the profile and authentication metadata of the currently authenticated Agent from PostgreSQL."
)
async def get_agent_me(
    current_agent: User = Depends(get_current_agent_user)
):
    """
    Retrieve authenticated Agent identity from database.
    """
    return AgentService.get_profile(current_agent)


@router.get(
    "/dashboard",
    response_model=AgentDashboardResponse,
    summary="Get Agent Dashboard Summary",
    description="Returns high-level portfolio metrics, renewal requests count, and assignment status for the authenticated Agent."
)
async def get_agent_dashboard(
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve real database-driven dashboard metrics for the authenticated Agent.
    """
    return AgentService.get_dashboard(current_agent, db)


@router.get(
    "/customers",
    response_model=AgentCustomersListResponse,
    summary="List Assigned Customers",
    description="Returns only the customers assigned to the authenticated Agent based on PostgreSQL data relationships."
)
async def get_agent_customers(
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve customers assigned to this Agent.
    """
    return AgentService.get_customers(current_agent, db)


@router.get(
    "/policies",
    response_model=AgentPoliciesListResponse,
    summary="List Assigned Policies",
    description="Returns only the policies assigned or accessible to the authenticated Agent based on PostgreSQL data relationships."
)
async def get_agent_policies(
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve policies assigned or accessible to this Agent.
    """
    return AgentService.get_policies(current_agent, db)


@router.get(
    "/policies/{policy_id}",
    response_model=AgentPolicyDetailResponse,
    summary="Get Specific Policy Details",
    description="Returns full PostgreSQL policy record including real coverages, exclusions, claims, and renewal status for an assigned customer."
)
async def get_agent_policy_detail(
    policy_id: str,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve detailed record for a specific policy.
    """
    detail = AgentService.get_policy_detail(policy_id, current_agent, db)
    if not detail:
        raise HTTPException(status_code=404, detail="Policy not found or not assigned to current agent.")
    return detail


@router.get(
    "/renewals",
    summary="List Assigned Customer Renewal Requests",
    description="Returns upcoming renewal requests for customers assigned to this Agent."
)
async def get_agent_renewals(
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve upcoming renewal requests for this Agent.
    """
    return AgentService.get_renewals(current_agent, db)


@router.post(
    "/renewals/{renewal_id}/approve",
    summary="Approve Policy Renewal Request",
    description="Agent approves customer policy renewal request, extends term in PostgreSQL, and generates customer notification."
)
async def approve_agent_renewal(
    renewal_id: str,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Approve policy renewal request.
    """
    return AgentService.approve_renewal(renewal_id, current_agent, db)


@router.post(
    "/policies/{policy_id}/send-reminder",
    response_model=ReminderResponse,
    summary="Send Policy Renewal Reminder to Customer",
    description="Agent sends a renewal reminder to assigned customer. Persists a Notification record in PostgreSQL."
)
async def send_policy_renewal_reminder(
    policy_id: str,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Send renewal outreach reminder for an expiring policy.
    """
    return AgentService.send_renewal_reminder(policy_id, current_agent, db)

