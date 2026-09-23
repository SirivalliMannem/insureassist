import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status

from app.schemas.customer_ai import CustomerChatRequest, CustomerChatResponse
from app.services.customer_ai_service import CustomerAIService

logger = logging.getLogger("ai_service.routes.customer")

router = APIRouter(
    prefix="/api/v1/ai/customer",
    tags=["Customer AI"]
)


@router.post(
    "/chat",
    response_model=CustomerChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Customer AI Assistant Chat",
    description="Processes customer inquiries using real customer/policy/application data from Customer Service and Groq LLM."
)
async def customer_chat(
    request: CustomerChatRequest,
    authorization: Optional[str] = Header(None, description="Optional Customer Bearer Token for authorization")
):
    """
    Handle customer chat inquiries through the Customer AI service layer.
    Retrieves real customer context from Customer Service when customer identity or token is provided.
    """
    try:
        response = await CustomerAIService.process_customer_chat(
            message=request.message,
            customer_id=request.customer_id,
            conversation_id=request.conversation_id,
            history=request.history,
            auth_token=authorization,
            context=request.context
        )
        return response
    except Exception as exc:
        logger.error(f"Error handling customer chat request: {type(exc).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the customer AI inquiry."
        )
