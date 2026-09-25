import json
import logging
import datetime
import random
import re
from typing import Optional, Dict, Any, List

from app.services.groq_service import groq_client
from app.schemas.underwriter_ai import UnderwriterChatResponse

logger = logging.getLogger("ai_service.underwriter")

UNDERWRITER_AI_SYSTEM_PROMPT = """You are the InsureAssist Underwriter AI Advisory Assistant.
Your purpose is to assist insurance underwriters with their risk analysis and decision-support workflow, including reviewing pending applications, analyzing risk-related information, checking coverage limits and deductibles, verifying submitted documents, identifying missing information, comparing risk profiles, reviewing prior claims, and preparing underwriting review summaries.

CRITICAL OPERATIONAL RULES:
1. STRICT GROUND TRUTH ONLY:
   - Ground every customer, application, policy, claim, and document fact strictly in the authorized data provided in REAL UNDERWRITER SERVICE DATA below.
   - NEVER INVENT, hallucinate, or assume application IDs, policy numbers, customer names, coverages, limits, deductibles, premiums, claim records, documents, or risk guidelines that are not explicitly present in the data.
   - Clearly distinguish verified available data from missing data. If an application lacks required documentation or risk details, state clearly: "Requires Underwriter Review: missing [specific detail]".

2. QUEUE & HIGH-RISK INQUIRIES (MANDATORY BEHAVIOR):
   - When asked about the queue, pending applications, or high-risk applications (e.g. "Summarize pending queue high-risk applications", "Show me the highest risk pending applications", "Which pending applications need attention?", "Summarize the pending underwriting queue"):
     - You MUST list and summarize the REAL matching applications and pending policies from the `=== HIGH-RISK QUEUE ITEMS ===` and `=== PENDING UNDERWRITING QUEUE ===` data below.
     - Include real database fields: Application ID / Policy Number, Customer Name, Product/Type, Risk Score & Risk Level, Premium, Coverage Limit, Status, and important risk factors (e.g. high exposure amount, coverages, missing documents, agent notes).
     - NEVER give generic textbook advice, generic underwriting guidelines, or hypothetical checklists when asked about the queue. Answer directly with the real queue cases.
     - If the context indicates 0 matching applications, explicitly state: "No matching pending applications were found in the current underwriting queue."

3. SPECIFIC APPLICATION ID INQUIRIES & NOT FOUND HANDLING:
   - If the underwriter asks about a specific application ID (e.g. "Review risk score factors for APP-8802"):
     - If the application is present in the context, provide a detailed risk analysis using its real fields.
     - If the application ID is marked as NOT found in the database (or is absent from the provided context), explicitly state:
       "Application **[ID]** was not found in the underwriting database or active queue."
     - You may suggest reviewing the highest-risk active pending applications currently in the queue instead.
     - NEVER invent fake risk factors, fake premiums, or fake scores for non-existent IDs.

4. DECISION SUPPORT ONLY — NO FINAL BINDING AUTHORITY:
   - You are a DECISION-SUPPORT ASSISTANT, NOT the final underwriting authority.
   - NEVER automatically approve or reject an application (e.g. NEVER say "I approve this application", "Reject this", "This is definitely low risk and should be bound").
   - You may summarize facts: "The application status is currently Approved" or "The application is currently pending review with missing documents."
   - The human underwriter retains sole authority for final Approve & Bind, Reject, or More Information decisions.

5. CONCISE, PROFESSIONAL & EDITORIAL:
   - Format responses cleanly using structured bullet points, clear bold highlights, and professional underwriting terminology.
   - Do NOT expose raw database table names, SQL queries, internal column names, model names, Groq, provider details, or confidence scores.
   - Do NOT show raw Markdown syntax errors.

6. CONTEXTUAL DOCUMENT DOWNLOAD CARDS (WHEN RELEVANT):
   - When an application, policy, or claim is discussed or a summary download is relevant, provide a clean download card:

     📄 Application Summary (APP-XXXX)
     Customer: Customer Name · Product: Product Name · Status: Status
     Download Application Summary ↓

     or:

     📄 Policy Summary (POL-XXXX)
     Customer: Customer Name · Status: Active
     Download Policy Summary ↓

     or:

     📄 Claim Summary (CLM-XXXX)
     Customer: Customer Name · Status: Status
     Download Claim Summary ↓

7. ASSIGNED WORKLOAD & QUEUE METRICS (e.g. "how many are under me", "how many applications are assigned to me", "what is my pending queue", "show my applications", "show my queue"):
   - When asked how many applications are under review or assigned to the underwriter:
     - Directly answer using the exact numbers from `Underwriting Queue Overview` in `REAL UNDERWRITER SERVICE DATA` below.
     - Cite the exact total queue count (e.g. 185 total cases), pending review count (e.g. 136 pending review), and high-risk count (e.g. 157 high-risk).
     - Provide a clear, structured list of the top pending application cases from the queue with their real Case ID, Customer Name, Product, Risk Score, Premium, and Status.
     - Never output generic greetings, ungrounded estimates, or mock boilerplate.
"""


class UnderwriterAIService:
    """
    Handles Underwriter AI business logic, prompt assembly with authorized context, and Groq generation.
    """

    @classmethod
    def format_underwriter_context(cls, context: Optional[Dict[str, Any]]) -> str:
        """
        Formats the authorized underwriter context into a clean text block for the LLM.
        """
        if not context:
            return "No specific underwriter context was provided for this inquiry."

        lines = ["=== REAL UNDERWRITER SERVICE DATA ==="]

        # Underwriter Profile
        uw_prof = context.get("underwriter_profile") or {}
        if uw_prof:
            lines.append(f"Authenticated Underwriter: {uw_prof.get('name', 'Underwriter')} (ID: {uw_prof.get('user_id', 'N/A')}, Email: {uw_prof.get('email', 'N/A')})")

        # Specific Query Status
        specific_id = context.get("specific_id_queried")
        specific_found = context.get("specific_item_found", False)
        if specific_id:
            if specific_found:
                lines.append(f"\nSpecific Query Target: '{specific_id}' WAS FOUND in database records.")
            else:
                lines.append(f"\nSpecific Query Target: '{specific_id}' WAS NOT FOUND in database records or active queue.")

        # Queue Summary
        q_sum = context.get("queue_summary") or {}
        if q_sum:
            lines.append(f"\nUnderwriting Queue Overview: {q_sum.get('total_queue_count', 0)} total cases ({q_sum.get('pending_review_count', 0)} pending review, {q_sum.get('high_risk_count', 0)} high-risk).")

        # High-Risk Queue Items
        high_risk = context.get("high_risk_queue_items") or []
        if high_risk:
            lines.append(f"\n=== HIGH-RISK QUEUE ITEMS (TOTAL: {len(high_risk)}) ===")
            for item in high_risk[:6]:
                covs_str = ", ".join(item.get("coverages", [])) if item.get("coverages") else "Standard"
                lines.append(
                    f"- Case ID: {item.get('id') or item.get('application_id') or item.get('policy_id')}, "
                    f"Customer: {item.get('customer') or item.get('customer_name')}, "
                    f"Product: {item.get('product') or item.get('policy_type')}, "
                    f"Risk Level: {item.get('risk_level', 'High')}, Risk Score: {item.get('risk_score', 90)}/100, "
                    f"Premium: {item.get('premium') or ('$' + str(item.get('premium_raw', 0)))}, "
                    f"Status: {item.get('status', 'Pending Review')}, "
                    f"Submitted: {item.get('submitted_date') or 'Recent'}, "
                    f"Coverages: [{covs_str}]"
                )

        # Pending Queue Items
        pending = context.get("pending_queue_items") or []
        if pending:
            lines.append(f"\n=== PENDING UNDERWRITING QUEUE (TOTAL: {len(pending)}) ===")
            for item in pending[:6]:
                lines.append(
                    f"- Case ID: {item.get('id') or item.get('application_id') or item.get('policy_id')}, "
                    f"Customer: {item.get('customer') or item.get('customer_name')}, "
                    f"Product: {item.get('product') or item.get('policy_type')}, "
                    f"Risk Level: {item.get('risk_level', 'Standard')}, Risk Score: {item.get('risk_score', 50)}/100, "
                    f"Premium: {item.get('premium') or ('$' + str(item.get('premium_raw', 0)))}, "
                    f"Status: {item.get('status', 'Pending Review')}"
                )

        # Applications Table
        apps = context.get("applications") or []
        if apps:
            lines.append(f"\n=== POLICY APPLICATIONS LEDGER (TOTAL: {len(apps)}) ===")
            for a in apps[:6]:
                lines.append(
                    f"- Application ID: {a.get('application_id')}, Customer: {a.get('customer_name') or a.get('customer', a.get('customer_id'))}, "
                    f"Product: {a.get('product_name') or a.get('product', a.get('policy_type'))}, Status: {a.get('status')}, "
                    f"Coverage Limit: ${float(a.get('coverage_limit_raw', a.get('coverage_limit') or 0)):,.2f}, "
                    f"Estimated Premium: ${float(a.get('estimated_premium', a.get('premium_raw') or 0)):,.2f}, "
                    f"Agent: {a.get('forwarded_by_agent_name') or a.get('forwarded_by_agent_id') or 'Direct Intake'}, "
                    f"Agent Notes: {a.get('agent_notes') or 'None'}"
                )

        # Policies
        policies = context.get("policies") or []
        if policies:
            lines.append(f"\n=== ACTIVE POLICIES REFERENCE (TOTAL: {len(policies)}) ===")
            for p in policies[:4]:
                lines.append(
                    f"- Policy: {p.get('policy_number', p.get('policy_id'))}, Customer: {p.get('customer_name') or p.get('customer')}, "
                    f"Type: {p.get('policy_type')}, Status: {p.get('status')}, Premium: ${float(p.get('premium_raw', p.get('premium') or 0)):,.2f}"
                )

        # Claims
        claims = context.get("claims") or []
        if claims:
            lines.append(f"\n=== RELEVANT CLAIMS (TOTAL: {len(claims)}) ===")
            for clm in claims[:4]:
                lines.append(
                    f"- Claim: {clm.get('claim_number', clm.get('claim_id'))}, Customer: {clm.get('customer_name')}, "
                    f"Status: {clm.get('claim_status')}, Amount: ${float(clm.get('claim_amount') or 0):,.2f}, "
                    f"Description: {clm.get('incident_description')}"
                )

        return "\n".join(lines)

    @classmethod
    async def process_underwriter_chat(
        cls,
        message: str,
        underwriter_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
        history: Optional[List[Dict[str, Any]]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> UnderwriterChatResponse:
        """
        Processes an Underwriter AI inquiry, formats context, and calls Groq LLM.
        """
        conv_id = conversation_id or f"conv-uw-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        formatted_context = cls.format_underwriter_context(context)

        # Bounded conversation history
        history_context = ""
        if history:
            history_lines = ["\nRECENT CONVERSATION HISTORY:"]
            for item in history[-8:]:
                sender = "Underwriter" if item.get("sender") in ("user", "underwriter") or item.get("sender_type") == "user" else "Assistant"
                content = item.get("content") or item.get("message") or ""
                if content and not item.get("isTyping"):
                    history_lines.append(f"{sender}: {content}")
            if len(history_lines) > 1:
                history_context = "\n".join(history_lines)

        full_system_prompt = f"{UNDERWRITER_AI_SYSTEM_PROMPT}\n\n{formatted_context}{history_context}"

        # Call Groq LLM
        completion_result = await groq_client.generate_response(
            system_prompt=full_system_prompt,
            user_prompt=message,
            temperature=0.2,
            max_tokens=1500
        )

        response_text = completion_result.get("response", "") if isinstance(completion_result, dict) else str(completion_result)

        return UnderwriterChatResponse(
            conversation_id=conv_id,
            title=message[:32] + "..." if len(message) > 32 else message,
            response=response_text,
            message_id=f"msg-ub-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}",
            created_at=datetime.datetime.utcnow().isoformat() + "Z"
        )
