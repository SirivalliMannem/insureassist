import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.auth import get_current_underwriter, get_current_underwriter_user
from app.models.models import User
from app.services.underwriter_service import UnderwriterService
from app.schemas.underwriter import (
    DecisionRequest,
    CreateConversationRequest,
    SendMessageRequest,
    ChatConversationItem,
    ChatMessageItem,
    UnderwriterChatResponse
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/underwriter",
    tags=["Underwriter"]
)


@router.get("/queue", summary="Fetch Underwriting Review Queue")
def get_underwriter_queue(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_underwriter)
):
    """
    Returns pending renewals, pending policies, and near-expiry active policies requiring underwriting review.
    """
    try:
        items = UnderwriterService.get_queue(db)
        return items
    except Exception as e:
        logger.error(f"Error fetching underwriter queue: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch underwriter queue: {str(e)}"
        )


@router.get("/stats", summary="Fetch Underwriter Dashboard Stats")
def get_underwriter_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_underwriter)
):
    """
    Returns real statistics for underwriter dashboard KPI cards and analytics.
    """
    try:
        stats = UnderwriterService.get_stats(db)
        return stats
    except Exception as e:
        logger.error(f"Error fetching underwriter stats: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch underwriter stats: {str(e)}"
        )


@router.post("/decision", summary="Submit Underwriting Decision")
def submit_underwriting_decision(
    req: DecisionRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_underwriter)
):
    """
    Records an underwriting decision (Approved, Rejected, Needs More Information)
    and updates the policy or renewal request in the database.
    """
    try:
        res = UnderwriterService.make_decision(req.item_id, req.decision, req.notes, db)
        if not res.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=res.get("message", "Failed to submit decision")
            )
        return res
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting underwriter decision: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit underwriting decision: {str(e)}"
        )


@router.get("/policies", summary="Browse Policy Catalog (Underwriter)")
def get_underwriter_policies(
    status_filter: Optional[str] = Query(None, alias="status"),
    policy_type: Optional[str] = Query(None, alias="type"),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_underwriter)
):
    """
    Returns real policies from the database for underwriter reference.
    """
    try:
        return UnderwriterService.get_policies(db, status_filter, policy_type, search, limit, offset)
    except Exception as e:
        logger.error(f"Error fetching underwriter policies: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch policies: {str(e)}"
        )


# =========================================================================
# Underwriter AI & Persistent Chat Endpoints
# =========================================================================

@router.get(
    "/chat/conversations",
    response_model=List[ChatConversationItem],
    summary="List Underwriter Chat Conversations",
    description="Retrieves all persistent chat conversations for the authenticated Underwriter."
)
async def list_underwriter_conversations(
    current_underwriter: User = Depends(get_current_underwriter_user),
    db: Session = Depends(get_db)
):
    """
    Get all chat conversations for the authenticated underwriter.
    """
    return UnderwriterService.list_chat_conversations(current_underwriter, db)


@router.post(
    "/chat/conversations",
    response_model=ChatConversationItem,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Underwriter Chat Conversation",
    description="Initializes a new persistent chat session for the authenticated Underwriter."
)
async def create_underwriter_conversation(
    req: CreateConversationRequest,
    current_underwriter: User = Depends(get_current_underwriter_user),
    db: Session = Depends(get_db)
):
    """
    Create a new conversation session for the authenticated underwriter.
    """
    return UnderwriterService.create_chat_conversation(current_underwriter, req, db)


@router.get(
    "/chat/conversations/{conversation_id}/messages",
    response_model=List[ChatMessageItem],
    summary="Get Underwriter Conversation Messages",
    description="Retrieves full chronological message history for an Underwriter conversation session."
)
async def get_underwriter_conversation_messages(
    conversation_id: str,
    current_underwriter: User = Depends(get_current_underwriter_user),
    db: Session = Depends(get_db)
):
    """
    Get all messages for a specific underwriter conversation session.
    """
    return UnderwriterService.get_conversation_messages(conversation_id, current_underwriter, db)


@router.post(
    "/chat/messages",
    response_model=UnderwriterChatResponse,
    summary="Send Underwriter Chat Message",
    description="Sends a prompt to the Underwriter AI Assistant with PostgreSQL-grounded context and Groq LLM."
)
async def send_underwriter_message(
    req: SendMessageRequest,
    current_underwriter: User = Depends(get_current_underwriter_user),
    db: Session = Depends(get_db)
):
    """
    Send prompt to Underwriter AI assistant with persistent conversation history and authorized underwriting context.
    """
    return UnderwriterService.send_chat_message(req, current_underwriter, db)


@router.post(
    "/chat/conversations/{conversation_id}/messages",
    response_model=UnderwriterChatResponse,
    summary="Send Message in Specific Underwriter Conversation",
    description="Sends a message in a specific existing underwriter conversation session."
)
async def send_underwriter_message_in_conv(
    conversation_id: str,
    req: SendMessageRequest,
    current_underwriter: User = Depends(get_current_underwriter_user),
    db: Session = Depends(get_db)
):
    """
    Send message to a specific conversation session.
    """
    req.conversation_id = conversation_id
    return UnderwriterService.send_chat_message(req, current_underwriter, db)


@router.delete(
    "/chat/conversations/{conversation_id}",
    summary="Delete Underwriter Chat Conversation",
    description="Permanently deletes an underwriter conversation and its messages."
)
async def delete_underwriter_conversation(
    conversation_id: str,
    current_underwriter: User = Depends(get_current_underwriter_user),
    db: Session = Depends(get_db)
):
    """
    Delete an underwriter chat conversation.
    """
    return UnderwriterService.delete_chat_conversation(conversation_id, current_underwriter, db)


# =========================================================================
# Underwriter PDF Summary Downloads
# =========================================================================

@router.get(
    "/applications/{application_id}/summary/download",
    summary="Download Underwriting Application Summary PDF",
    description="Generates and streams an InsureAssist-generated Application Summary PDF for underwriting review."
)
async def download_underwriting_application_summary_pdf(
    application_id: str,
    current_underwriter: User = Depends(get_current_underwriter_user),
    db: Session = Depends(get_db)
):
    """
    Download InsureAssist Underwriting Application Summary PDF.
    """
    pdf_bytes, filename = UnderwriterService.download_application_summary(application_id, current_underwriter, db)
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
    summary="Download Underwriting Policy Summary PDF",
    description="Generates and streams an InsureAssist-generated Policy Summary PDF."
)
async def download_underwriting_policy_summary_pdf(
    policy_id: str,
    current_underwriter: User = Depends(get_current_underwriter_user),
    db: Session = Depends(get_db)
):
    """
    Download InsureAssist Policy Summary PDF.
    """
    pdf_bytes, filename = UnderwriterService.download_policy_summary(policy_id, current_underwriter, db)
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
    summary="Download Underwriting Claim Summary PDF",
    description="Generates and streams an InsureAssist-generated Claim Summary PDF."
)
async def download_underwriting_claim_summary_pdf(
    claim_id: str,
    current_underwriter: User = Depends(get_current_underwriter_user),
    db: Session = Depends(get_db)
):
    """
    Download InsureAssist Claim Summary PDF.
    """
    pdf_bytes, filename = UnderwriterService.download_claim_summary(claim_id, current_underwriter, db)
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
    summary="Download Underwriting Document Summary PDF",
    description="Resolves and downloads an InsureAssist-generated summary PDF for applications, policies, or claims."
)
async def download_underwriting_document_summary_pdf(
    doc_type: str = Query(..., description="Document type: application, policy, or claim"),
    ref_id: str = Query(..., description="Reference ID or Number"),
    current_underwriter: User = Depends(get_current_underwriter_user),
    db: Session = Depends(get_db)
):
    """
    Download document summary PDF by type and reference ID.
    """
    pdf_bytes, filename = UnderwriterService.resolve_document_download(doc_type, ref_id, current_underwriter, db)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache"
        }
    )
