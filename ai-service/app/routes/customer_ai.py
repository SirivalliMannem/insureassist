import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Header, status

from app.schemas.customer_ai import (
    CustomerChatRequest,
    CustomerChatResponse,
    GlossaryExplainRequest,
    GlossaryExplainResponse,
    CoverageCheckRequest,
    CoverageCheckResponse
)
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


@router.post(
    "/glossary/explain",
    response_model=GlossaryExplainResponse,
    status_code=status.HTTP_200_OK,
    summary="Customer AI Glossary Explain",
    description="Generates plain-English simplified definitions, real-world examples, and customer policy context for insurance terms."
)
async def explain_glossary(
    request: GlossaryExplainRequest,
    authorization: Optional[str] = Header(None, description="Optional Customer Bearer Token for authorization")
):
    """
    Generate structured AI explanation for an insurance glossary term.
    """
    try:
        response = await CustomerAIService.explain_glossary_term(
            term=request.term,
            definition=request.definition,
            custom_question=request.custom_question,
            context=request.context,
            auth_token=authorization
        )
        return response
    except Exception as exc:
        logger.error(f"Error handling glossary explanation request: {type(exc).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating the glossary explanation."
        )


@router.post(
    "/coverage/check",
    response_model=CoverageCheckResponse,
    status_code=status.HTTP_200_OK,
    summary="Customer AI Coverage Checker Evaluation",
    description="Evaluates a customer incident scenario against active policies, coverages, limits, deductibles, and exclusions."
)
async def check_coverage_endpoint(
    request: CoverageCheckRequest,
    authorization: Optional[str] = Header(None, description="Optional Customer Bearer Token for authorization")
):
    """
    Evaluate customer incident scenario against real active policies using AI Service.
    """
    try:
        response = await CustomerAIService.check_coverage_scenario(
            scenario=request.scenario,
            context=request.context,
            auth_token=authorization
        )
        return response
    except Exception as exc:
        logger.error(f"Error handling coverage check request: {type(exc).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while evaluating coverage."
        )


