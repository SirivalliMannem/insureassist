import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status

from app.schemas.underwriter_ai import UnderwriterChatRequest, UnderwriterChatResponse
from app.services.underwriter_ai_service import UnderwriterAIService

logger = logging.getLogger("ai_service.routes.underwriter")

router = APIRouter(
    prefix="/api/v1/ai/underwriter",
    tags=["Underwriter AI"]
)


@router.post(
    "/chat",
    response_model=UnderwriterChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Underwriter AI Assistant Chat",
    description="Processes underwriter inquiries using authorized queue/policy/application data from Underwriter Service and Groq LLM."
)
async def underwriter_chat_endpoint(
    request: UnderwriterChatRequest,
    authorization: Optional[str] = Header(None, description="Optional Underwriter Bearer Token")
):
    """
    Handle Underwriter chat inquiries through the Underwriter AI service layer.
    """
    try:
        response = await UnderwriterAIService.process_underwriter_chat(
            message=request.message,
            underwriter_id=request.underwriter_id,
            conversation_id=request.conversation_id,
            history=request.history,
            context=request.context
        )
        return response
    except Exception as exc:
        logger.error(f"Error handling underwriter chat request: {type(exc).__name__} - {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the underwriter AI inquiry."
        )
