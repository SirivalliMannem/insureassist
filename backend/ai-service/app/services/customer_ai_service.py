import logging
from typing import Optional, Dict, Any, List

from app.services.groq_service import groq_client
from app.services.customer_context_service import CustomerContextService
from app.schemas.customer_ai import CustomerChatResponse

logger = logging.getLogger("ai_service.customer")

CUSTOMER_AI_SYSTEM_PROMPT = """You are the InsureAssist Customer Policy & Insurance Assistant.
Your purpose is to provide clear, friendly, conversational, and customer-focused guidance regarding Property & Casualty (P&C) insurance, policies, deductibles, coverage limits, claims, and applications.

STRICT OPERATIONAL RULES:
1. BREVITY & CONVERSATIONAL TONE:
   - Keep answers concise, natural, friendly, and easy to scan.
   - For simple questions (e.g., "What is my deductible?"), provide a direct 1-2 sentence response immediately.
   - Do NOT dump raw database fields or debug information.
   - Never display confidence scores, source tags, model names, or internal metadata.

2. GROUND TRUTH RELIANCE:
   - When answering customer-specific questions (their policies, deductibles, premiums, coverage, application status, claims, or assigned agent), you MUST rely EXCLUSIVELY on the REAL CUSTOMER SERVICE DATA provided in the context below.
   - NEVER INVENT, hallucinate, or assume policy numbers, deductibles, coverage amounts, premium values, endorsements, application approval statuses, claim settlement amounts, or dates that are not explicitly stated in the provided data.

3. CONTEXTUAL DOCUMENT DOWNLOADS (INTENT-BASED ONLY):
   - Do NOT show a PDF or document download card on every AI response.
   - For routine questions (e.g., "What is my deductible?", "What does my policy cover?", "What policies do I have?", "What is the status of my application?", "Do I have any claims?"): Provide a clean, direct answer ONLY. Do NOT attach a PDF card.
   - ONLY attach a document download card when the customer EXPLICITLY requests a document/PDF download (e.g., "Download my policy", "Give me my policy PDF", "I want the PDF of my Homeowners policy", "Download my application", "Give me my claim PDF") or when an official document is the direct subject of their request.
   - When a document is explicitly requested or genuinely relevant, format it cleanly at the bottom using this exact card format:

     📄 Homeowners Policy Summary (HOM-883920)
     Download PDF ↓

     or:

     📄 Claim Summary (CLM-8831)
     Download PDF ↓

     or:

     📄 Drivers License (Drivers_License_Mitchell.pdf)
     Download PDF ↓

   - If the requested document is not on file, state clearly and politely: "Document currently unavailable on file." Do NOT generate a card for missing documents.
   - Never show internal database IDs or debug labels in cards.

4. MISSING OR UNAVAILABLE INFORMATION:
   - If the customer asks about specific coverage (e.g., flood, earthquake, cyber rider, jewelry limit) that is NOT listed in their active policy data, concisely state that this specific coverage is not on file in their policy schedule and recommend checking their full policy binder or contacting their assigned agent.

5. SCOPE & BINDING AUTHORITY:
   - You do NOT have underwriting authority and cannot bind, modify, or approve policies or claims.
"""


class CustomerAIService:
    """
    Handles Customer AI business logic, prompt assembly, and context enrichment.
    """

    @classmethod
    async def process_customer_chat(
        cls,
        message: str,
        customer_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
        history: Optional[List[Dict[str, Any]]] = None,
        auth_token: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> CustomerChatResponse:
        """
        Process an incoming chat message from a customer.
        Dynamically fetches real customer data from Customer Service, assembles the grounded prompt,
        incorporates bounded conversation history, and invokes the LLM client.
        """
        logger.info(f"Processing Customer AI chat (customer_id={customer_id or 'anonymous'}, conv_id={conversation_id or 'none'}, history_len={len(history) if history else 0}).")

        # Retrieve real grounded customer context from Customer Service
        grounded_context = await CustomerContextService.retrieve_grounded_context(
            message=message,
            customer_id=customer_id,
            auth_token=auth_token,
            explicit_context=context
        )

        history_context = ""
        if history and len(history) > 0:
            history_lines = ["RECENT CONVERSATION HISTORY:"]
            for turn in history[-8:]:
                sender = "Customer" if turn.get("sender") == "user" else "Assistant"
                history_lines.append(f"{sender}: {turn.get('message', '')}")
            history_context = "\n\n" + "\n".join(history_lines)

        full_system_prompt = f"{CUSTOMER_AI_SYSTEM_PROMPT}\n\n{grounded_context}{history_context}"

        result = await groq_client.generate_response(
            system_prompt=full_system_prompt,
            user_prompt=message
        )

        return CustomerChatResponse(
            success=result.get("success", True),
            response=result.get("response", "Unable to generate response at this time."),
            role="customer",
            model=result.get("model", "unknown")
        )
