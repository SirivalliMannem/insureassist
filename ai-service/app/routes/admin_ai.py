import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status

from app.schemas.admin_ai import AdminChatRequest, AdminChatResponse
from app.services.admin_ai_service import AdminAIService

logger = logging.getLogger("ai_service.routes.admin")

router = APIRouter(
    prefix="/api/v1/ai/admin",
    tags=["Admin AI"]
)


@router.post(
    "/chat",
    response_model=AdminChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Admin AI Assistant Chat",
    description="Processes enterprise governance inquiries using real platform, user, and policy data from Admin Service and Groq LLM."
)
async def admin_chat_endpoint(
    request: AdminChatRequest,
    authorization: Optional[str] = Header(None, description="Optional Admin Bearer Token")
):
    """
    Handle Admin chat inquiries through the Admin AI service layer.
    """
    try:
        response = await AdminAIService.process_admin_chat(
            message=request.message,
            admin_id=request.admin_id,
            conversation_id=request.conversation_id,
            history=request.history,
            context=request.context
        )
        return response
    except Exception as exc:
        logger.error(f"Error handling admin chat request: {type(exc).__name__} - {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the admin AI inquiry."
        )
