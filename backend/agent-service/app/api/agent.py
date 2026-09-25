import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Query
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
    ReminderResponse,
    AgentApplicationResponse,
    AgentApplicationsListResponse,
    ForwardApplicationRequest,
    RequestMoreInfoRequest,
    ChatConversationItem,
    ChatMessageItem,
    CreateConversationRequest,
    SendMessageRequest,
    AgentChatResponse
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


# =========================================================================
# Policy Application Intake, Verification & Underwriter Forwarding
# =========================================================================

@router.get(
    "/applications",
    response_model=AgentApplicationsListResponse,
    summary="List Customer Policy Applications (Agent Intake)",
    description="Returns submitted policy applications from assigned customers for Agent intake and document verification."
)
async def get_agent_applications(
    status: Optional[str] = None,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve applications in Agent queue.
    """
    return AgentService.get_applications(current_agent, db, status_filter=status)


@router.get(
    "/applications/{application_id}",
    response_model=AgentApplicationResponse,
    summary="Get Specific Policy Application Details",
    description="Returns complete application details, risk answers, and uploaded documents for Agent review."
)
async def get_agent_application_detail(
    application_id: str,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve detailed application record for Agent review.
    """
    return AgentService.get_application_detail(application_id, current_agent, db)


@router.post(
    "/applications/{application_id}/forward",
    response_model=AgentApplicationResponse,
    summary="Forward Verified Application to Underwriter",
    description="Validates application & documents, updates status to FORWARDED_TO_UNDERWRITER, records Agent timestamp and audit notes, and routes to Underwriter queue."
)
async def forward_application_to_underwriter(
    application_id: str,
    forward_in: ForwardApplicationRequest,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Agent forwards verified application to Underwriter.
    """
    return AgentService.forward_to_underwriter(application_id, forward_in, current_agent, db)


@router.post(
    "/applications/{application_id}/request-info",
    response_model=AgentApplicationResponse,
    summary="Request Additional Info / Missing Documents from Customer",
    description="Updates application status to MORE_INFORMATION_REQUIRED, stores Agent request notes, and creates customer notification."
)
async def request_more_application_info(
    application_id: str,
    req_in: RequestMoreInfoRequest,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Agent requests missing documents or answers from customer.
    """
    return AgentService.request_more_information(application_id, req_in, current_agent, db)


@router.get(
    "/applications/{application_id}/reviewer",
    summary="Get Application Reviewer / Forwarder",
    description="Returns the agent who reviewed/forwarded a specific application from applications.forwarded_by_agent_id."
)
async def get_application_reviewer_info(
    application_id: str,
    db: Session = Depends(get_db)
):
    """
    Get application reviewing/forwarding agent.
    """
    return AgentService.get_application_reviewer(application_id, db)


@router.get(
    "/customers/{customer_id}/assigned-agent",
    summary="Get Customer Assigned Agent (Static Assignment)",
    description="Returns the customer's static assigned agent from customer_agent_assignments or explicit Unassigned status."
)
async def get_customer_assigned_agent_info(
    customer_id: str,
    db: Session = Depends(get_db)
):
    """
    Get customer assigned agent from customer_agent_assignments.
    """
    return AgentService.get_customer_assigned_agent(customer_id, db)


# =========================================================================
# Persistent Agent AI Assistant Endpoints
# =========================================================================

@router.get(
    "/chat/conversations",
    response_model=List[ChatConversationItem],
    summary="List Agent Chat Conversations",
    description="Retrieves all persistent chat conversations for the authenticated Agent ordered by most recent activity."
)
async def list_agent_conversations(
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    List all chat conversations belonging to the authenticated agent.
    """
    return AgentService.list_chat_conversations(current_agent, db)


@router.post(
    "/chat/conversations",
    response_model=ChatConversationItem,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Agent Chat Conversation",
    description="Initializes a new persistent chat session for the authenticated Agent."
)
async def create_agent_conversation(
    req: CreateConversationRequest,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Create a new conversation session for the authenticated agent.
    """
    return AgentService.create_chat_conversation(current_agent, req, db)


@router.get(
    "/chat/conversations/{conversation_id}/messages",
    response_model=List[ChatMessageItem],
    summary="Get Conversation Messages",
    description="Retrieves full chronological message history for an Agent conversation session."
)
async def get_agent_conversation_messages(
    conversation_id: str,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Get all messages for a specific agent conversation session.
    """
    return AgentService.get_conversation_messages(conversation_id, current_agent, db)


@router.post(
    "/chat/messages",
    response_model=AgentChatResponse,
    summary="Send Agent Chat Message",
    description="Sends a message to the Agent AI Assistant. Automatically retrieves agent-authorized business context and returns Groq-grounded response."
)
async def send_agent_message(
    req: SendMessageRequest,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Send prompt to Agent AI assistant with persistent conversation history and authorized portfolio context.
    """
    return AgentService.send_chat_message(req, current_agent, db)


@router.post(
    "/chat/conversations/{conversation_id}/messages",
    response_model=AgentChatResponse,
    summary="Send Message in Specific Agent Conversation",
    description="Sends a message to a specific existing conversation."
)
async def send_agent_message_in_conv(
    conversation_id: str,
    req: SendMessageRequest,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Send message to a specific conversation session.
    """
    req.conversation_id = conversation_id
    return AgentService.send_chat_message(req, current_agent, db)


@router.delete(
    "/chat/conversations/{conversation_id}",
    summary="Delete Agent Chat Conversation",
    description="Permanently deletes an agent conversation and all associated messages."
)
async def delete_agent_conversation(
    conversation_id: str,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Delete an agent chat conversation.
    """
    return AgentService.delete_chat_conversation(conversation_id, current_agent, db)


# =========================================================================
# Agent PDF Summary Downloads
# =========================================================================

@router.get(
    "/applications/{application_id}/summary/download",
    summary="Download Application Summary PDF",
    description="Generates and streams an InsureAssist-generated Application Summary PDF for agent review."
)
async def download_application_summary_pdf(
    application_id: str,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Download InsureAssist Application Summary PDF.
    """
    pdf_bytes, filename = AgentService.download_application_summary(application_id, current_agent, db)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache"
        }
    )


@router.get(
    "/policies/{policy_id}/summary/download",
    summary="Download Policy Summary PDF",
    description="Generates and streams an InsureAssist-generated Policy Summary PDF."
)
async def download_policy_summary_pdf(
    policy_id: str,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Download InsureAssist Policy Summary PDF.
    """
    pdf_bytes, filename = AgentService.download_policy_summary(policy_id, current_agent, db)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache"
        }
    )


@router.get(
    "/claims/{claim_id}/summary/download",
    summary="Download Claim Summary PDF",
    description="Generates and streams an InsureAssist-generated Claim Summary PDF."
)
async def download_claim_summary_pdf(
    claim_id: str,
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Download InsureAssist Claim Summary PDF.
    """
    pdf_bytes, filename = AgentService.download_claim_summary(claim_id, current_agent, db)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache"
        }
    )


@router.get(
    "/documents/download",
    summary="Download Document Summary PDF",
    description="Resolves and downloads an InsureAssist-generated summary PDF for applications, policies, or claims."
)
async def download_document_summary_pdf(
    doc_type: str = Query(..., description="Document type: application, policy, or claim"),
    ref_id: str = Query(..., description="Reference ID or Number"),
    current_agent: User = Depends(get_current_agent_user),
    db: Session = Depends(get_db)
):
    """
    Download document summary PDF by type and reference ID.
    """
    pdf_bytes, filename = AgentService.resolve_document_download(doc_type, ref_id, current_agent, db)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache"
        }
    )


