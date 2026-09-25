import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status

from app.schemas.agent_ai import AgentChatRequest, AgentChatResponse
from app.services.agent_ai_service import AgentAIService

logger = logging.getLogger("ai_service.routes.agent")

router = APIRouter(
    prefix="/api/v1/ai/agent",
    tags=["Agent AI"]
)


@router.post(
    "/chat",
    response_model=AgentChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Agent AI Assistant Chat",
    description="Processes agent inquiries using authorized client/policy/application data from Agent Service and Groq LLM."
)
async def agent_chat_endpoint(
    request: AgentChatRequest,
    authorization: Optional[str] = Header(None, description="Optional Agent Bearer Token")
):
    """
    Handle Agent chat inquiries through the Agent AI service layer.
    """
    try:
        response = await AgentAIService.process_agent_chat(
            message=request.message,
            agent_id=request.agent_id,
            conversation_id=request.conversation_id,
            history=request.history,
            context=request.context
        )
        return response
    except Exception as exc:
        logger.error(f"Error handling agent chat request: {type(exc).__name__} - {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the agent AI inquiry."
        )
