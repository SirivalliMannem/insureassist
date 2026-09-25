import json
import logging
import re
from typing import Optional, Dict, Any, List

from app.services.groq_service import groq_client
from app.services.customer_context_service import CustomerContextService
from app.schemas.customer_ai import CustomerChatResponse, GlossaryExplainResponse, CoverageCheckResponse

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

GLOSSARY_AI_SYSTEM_PROMPT = """You are the InsureAssist Insurance Glossary & Policy Education Assistant.
Your purpose is to provide clear, accessible, plain-language explanations and real-world practical examples for Property & Casualty (P&C) insurance terms.

STRICT OPERATIONAL RULES:
1. PLAIN LANGUAGE EXPLANATION:
   - Explain the insurance term in simple, jargon-free English that any policyholder can readily understand.
   - Use the provided glossary definition as your primary factual guide.
2. CONCRETE REAL-WORLD EXAMPLE:
   - Give one clear, everyday insurance scenario demonstrating how this term applies in practice.
3. PERSONALIZED POLICY APPLICATION:
   - If customer policy context is supplied and contains relevant policy details (e.g., active policy numbers, actual deductibles, limits, endorsements), explain how this concept applies specifically to their active policies.
   - ONLY cite policy numbers, deductibles, or coverages that exist verbatim in the supplied context.
   - NEVER invent or assume policy values.
   - If no relevant customer policy context is provided or applicable, leave this field as an empty string ("").
4. PRACTICAL KEY TAKEAWAYS:
   - Provide 2 to 3 concise, highly practical takeaways as a list of strings.
5. NO JARGON OR CONFIDENTIAL DATA:
   - Never output confidence percentages, internal model identifiers, or raw JSON debug traces.
   - Keep answers professional, friendly, and empowering.

REQUIRED OUTPUT JSON FORMAT:
You MUST respond with a valid JSON object strictly matching this schema:
{
  "term": "Term Name",
  "simplified_explanation": "Simple plain-language explanation...",
  "example": "Clear real-world insurance scenario...",
  "your_policy_context": "How it applies to customer's active policies (or empty string if not applicable)...",
  "key_takeaways": [
    "First practical takeaway",
    "Second practical takeaway"
  ]
}
"""

COVERAGE_CHECK_SYSTEM_PROMPT = """You are the InsureAssist AI Coverage Evaluation Specialist.
Your purpose is to analyze customer-submitted incident scenarios against ONLY the customer's actual active Property & Casualty (P&C) policy data and provide an objective, educational coverage assessment.

CRITICAL OPERATIONAL & LEGAL GUIDELINES:
1. NOT A FINAL CLAIMS ADJUDICATION:
   - You are an AI informational assistant, NOT a claims adjuster or legal authority.
   - NEVER state that a claim "will definitely be approved" or "is 100% covered".
   - Never promise claim settlement amounts.
   - Use measured, professional insurance terms.
2. THREE ALLOWED ASSESSMENTS:
   - "assessment" MUST BE EXACTLY ONE OF THESE THREE STRINGS:
     a) "Potentially Covered" -> If the incident matches a standard peril/coverage line under an active policy and no explicit exclusion clearly bars it.
     b) "Not Listed in Available Coverage" -> If no active policy or coverage line item in the supplied customer records applies to this scenario (e.g., international travel medical, unpurchased flood/earthquake).
     c) "Requires Policy Review" -> If coverage is conditional, borderline, or depends heavily on cause of loss investigation or specific endorsement terms.
3. GROUND TRUTH POLICY CONTEXT ONLY:
   - ONLY reference active policy numbers (e.g. HOM-883920, POL-2026-0120920), policy types, coverage line items, deductibles, and exclusions that exist verbatim in the supplied context.
   - NEVER invent or fabricate policy numbers, coverage names, limits, deductibles, or policy clauses/quotes.
   - NEVER invent fake policy quotes or clauses with quotation marks.
   - If an applicable deductible exists on the matching policy, state it clearly (e.g. "$1,000", "$500"). If not found, leave as null.
   - If a specific exclusion is present in the customer's records that applies to the scenario, cite it in "relevant_exclusion".
4. CONCISE & PRACTICAL:
   - Keep "reason", "status_description", and "recommended_action" concise, clear, and actionable.
5. ARBITRARY NATURAL-LANGUAGE INPUT & STRICT GROUNDING:
   - The customer scenario may be phrased in arbitrary natural language (e.g., "My washing machine leaked and damaged my kitchen floor", "A tree fell on my garage during a storm", "Someone stole my laptop from my house", "My car was damaged while it was parked", "A pipe froze and burst", "I accidentally damaged my neighbor's property").
   - Understand different phrasing and semantic meanings for similar incidents.
   - Analyze the scenario against the customer's actual policy context.
   - If the scenario cannot be matched confidently to the available policy information, return "assessment": "Requires Policy Review" and clearly explain that the available policy information is insufficient.
   - Do not invent coverage merely because the scenario sounds similar to a known insurance peril.

REQUIRED JSON OUTPUT FORMAT:
You MUST respond with a valid JSON object strictly matching this schema:
{
  "scenario": "Customer scenario text",
  "assessment": "Potentially Covered" | "Not Listed in Available Coverage" | "Requires Policy Review",
  "status_description": "Clear high-level summary of the assessment...",
  "reason": "Detailed explanation referencing why the policy applies or does not apply...",
  "relevant_policy": "Policy Name & Number (or null if none applies)",
  "relevant_coverage": "Specific coverage line item (or null if none applies)",
  "relevant_exclusion": "Specific exclusion or limitation if applicable (or null)",
  "applicable_deductible": "$Amount (or null)",
  "recommended_action": "Actionable next step for the customer..."
}
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

    @classmethod
    async def explain_glossary_term(
        cls,
        term: str,
        definition: Optional[str] = None,
        custom_question: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
        auth_token: Optional[str] = None
    ) -> GlossaryExplainResponse:
        """
        Generates a simplified, plain-English explanation, real-world example,
        personalized policy context (if available), and key takeaways for an insurance glossary term.
        """
        logger.info(f"Generating AI glossary explanation for term: '{term}'")

        # Format grounded context if available
        grounded_context = ""
        if context:
            grounded_context = CustomerContextService._format_structured_context(context, term)
        elif auth_token:
            grounded_context = await CustomerContextService.retrieve_grounded_context(
                message=term,
                auth_token=auth_token,
                explicit_context=context
            )

        user_content_parts = [
            f"Please explain the insurance term: '{term}'.",
            f"Base Glossary Definition: {definition}" if definition else "",
            f"Customer Specific Question: {custom_question}" if custom_question else "",
            f"REAL CUSTOMER POLICY CONTEXT:\n{grounded_context}" if grounded_context else "No customer-specific policy context provided."
        ]
        user_prompt = "\n".join([p for p in user_content_parts if p])

        full_system_prompt = f"{GLOSSARY_AI_SYSTEM_PROMPT}"

        result = await groq_client.generate_response(
            system_prompt=full_system_prompt,
            user_prompt=user_prompt
        )

        raw_response = result.get("response", "").strip()

        # Try to parse JSON from LLM response
        parsed_data = {}
        try:
            cleaned = re.sub(r"^```(?:json)?\s*", "", raw_response, flags=re.MULTILINE)
            cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE).strip()
            parsed_data = json.loads(cleaned)
        except Exception as e:
            logger.warning(f"Could not parse JSON directly from LLM glossary response: {e}. Attempting regex extraction.")
            json_match = re.search(r"\{.*\}", raw_response, re.DOTALL)
            if json_match:
                try:
                    parsed_data = json.loads(json_match.group(0))
                except Exception:
                    pass

        # Build clean response object with fallbacks
        simplified = parsed_data.get("simplified_explanation") or (definition or f"A standard insurance term referring to {term.lower()}.")
        example = parsed_data.get("example") or f"For example, in a standard policy, {term.lower()} determines how coverage conditions apply."
        policy_context = parsed_data.get("your_policy_context") or ""
        takeaways = parsed_data.get("key_takeaways") or [
            f"Review how {term.lower()} is specified on your declarations page.",
            "Contact your assigned insurance agent if you have questions about this term."
        ]

        # Ensure takeaways is a list of clean strings
        if isinstance(takeaways, str):
            takeaways = [takeaways]
        elif not isinstance(takeaways, list):
            takeaways = []

        return GlossaryExplainResponse(
            term=parsed_data.get("term") or term,
            simplified_explanation=simplified,
            example=example,
            your_policy_context=policy_context,
            key_takeaways=takeaways
        )

    @classmethod
    async def check_coverage_scenario(
        cls,
        scenario: str,
        context: Optional[Dict[str, Any]] = None,
        auth_token: Optional[str] = None
    ) -> CoverageCheckResponse:
        """
        Evaluates a customer incident scenario against active policies, coverages, limits, deductibles, and exclusions.
        Returns a structured assessment ("Potentially Covered", "Not Listed in Available Coverage", "Requires Policy Review").
        """
        logger.info(f"Checking coverage evaluation for scenario: '{scenario[:80]}...'")

        # Format grounded context if available
        grounded_context = ""
        if context:
            grounded_context = CustomerContextService.format_coverage_context(context)
        elif auth_token:
            grounded_context = await CustomerContextService.retrieve_grounded_context(
                message=scenario,
                auth_token=auth_token,
                explicit_context=context
            )

        user_content_parts = [
            f"Customer Incident Scenario to Evaluate:\n\"{scenario}\"",
            f"REAL CUSTOMER POLICY & COVERAGE CONTEXT:\n{grounded_context}" if grounded_context else "No active customer policy context available."
        ]
        user_prompt = "\n\n".join(user_content_parts)

        full_system_prompt = f"{COVERAGE_CHECK_SYSTEM_PROMPT}"

        result = await groq_client.generate_response(
            system_prompt=full_system_prompt,
            user_prompt=user_prompt
        )

        raw_response = result.get("response", "").strip()

        # Try to parse JSON from LLM response
        parsed_data = {}
        try:
            cleaned = re.sub(r"^```(?:json)?\s*", "", raw_response, flags=re.MULTILINE)
            cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE).strip()
            parsed_data = json.loads(cleaned)
        except Exception as e:
            logger.warning(f"Could not parse JSON directly from LLM coverage response: {e}. Attempting regex extraction.")
            json_match = re.search(r"\{.*\}", raw_response, re.DOTALL)
            if json_match:
                try:
                    parsed_data = json.loads(json_match.group(0))
                except Exception:
                    pass

        # Normalize assessment
        assessment = parsed_data.get("assessment", "Requires Policy Review")
        valid_assessments = ["Potentially Covered", "Not Listed in Available Coverage", "Requires Policy Review"]
        if assessment not in valid_assessments:
            if "potential" in assessment.lower() or ("cover" in assessment.lower() and "not" not in assessment.lower()):
                assessment = "Potentially Covered"
            elif "not" in assessment.lower() or "unlisted" in assessment.lower() or "exclude" in assessment.lower():
                assessment = "Not Listed in Available Coverage"
            else:
                assessment = "Requires Policy Review"

        status_desc = parsed_data.get("status_description") or (
            "This scenario may be eligible under your active insurance coverage." if assessment == "Potentially Covered"
            else "No matching coverage line was identified in your active policy records." if assessment == "Not Listed in Available Coverage"
            else "This scenario requires additional policy review or claims verification."
        )

        reason = parsed_data.get("reason") or "Based on the available policy data, please review your coverage terms or contact your agent."
        rel_policy = parsed_data.get("relevant_policy") or None
        rel_coverage = parsed_data.get("relevant_coverage") or None
        rel_exclusion = parsed_data.get("relevant_exclusion") or None
        deductible = parsed_data.get("applicable_deductible") or None
        action = parsed_data.get("recommended_action") or "Contact your assigned insurance agent or submit an inquiry in the Report a Claim portal."

        return CoverageCheckResponse(
            scenario=scenario,
            assessment=assessment,
            status_description=status_desc,
            reason=reason,
            relevant_policy=rel_policy,
            relevant_coverage=rel_coverage,
            relevant_exclusion=rel_exclusion,
            applicable_deductible=deductible,
            recommended_action=action
        )


