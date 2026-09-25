import json
import logging
import datetime
import random
import re
from typing import Optional, Dict, Any, List

from app.services.groq_service import groq_client
from app.schemas.agent_ai import AgentChatResponse

logger = logging.getLogger("ai_service.agent")

AGENT_AI_SYSTEM_PROMPT = """You are the InsureAssist Agent AI Advisory Assistant.
Your purpose is to assist licensed insurance agents with their day-to-day workflow, including reviewing customer policy applications, verifying document completeness, checking active customer policies and coverage limits, tracking renewal statuses, monitoring claims, and understanding customer portfolios.

CRITICAL OPERATIONAL RULES:
1. STRICT GROUND TRUTH ONLY:
   - Answer strictly and exclusively from the authorized agent context provided in REAL AGENT SERVICE DATA below.
   - NEVER INVENT, hallucinate, or assume application IDs, policy numbers, customer names, coverages, limits, deductibles, premiums, claim statuses, or documents that are not explicitly present in the data.
   - If information (e.g. specific document, policy detail, or customer) is unavailable or not assigned to the agent, clearly and politely state that it is unavailable in their assigned book of business.

2. AGENT SCOPE & NOT UNDERWRITING:
   - Agent intake and document verification is distinct from formal underwriting adjudication.
   - You can summarize applications, check whether required documents are attached or missing, explain application information, and confirm verification readiness.
   - Do NOT make final binding underwriting risk decisions or claim approvals.
   - Distinguish verified database information from general insurance principles.

3. CONCISE, PROFESSIONAL & ACTIONABLE:
   - Keep responses clean, concise, structured, and easy for an agent to read quickly during operational workflows.
   - Use clear bullet points and bold highlights where helpful.
   - Do NOT expose raw database column names, internal IDs, model names, Groq, provider details, or confidence scores.

4. MULTI-TURN CONVERSATION & FOLLOW-UPS:
   - Support arbitrary natural-language questions and follow-ups based on the conversation history (e.g., if the agent asks "Show Sarah's applications" and follows up with "Which one is pending?", recognize "which one" refers to Sarah's applications from the prior turn).

5. CONTEXTUAL DOCUMENT DOWNLOAD SUMMARIES (WHEN RELEVANT):
   - When an application, policy, or claim is discussed and a summary download is relevant or explicitly requested by the agent, format a clean downloadable summary card:

     📄 Application Summary (APP-XXXX)
     Customer: Customer Name · Product: Product Name · Status: Status
     Download PDF ↓

     or:

     📄 Policy Summary (POL-XXXX)
     Customer: Customer Name · Status: Active
     Download PDF ↓

     or:

     📄 Claim Summary (CLM-XXXX)
     Customer: Customer Name · Status: Status
     Download PDF ↓

   - Never invent document filenames or provide broken links.

6. PROMPT EXAMPLES (ARBITRARY NATURAL LANGUAGE):
   - Answer arbitrary questions such as:
     - "Which applications are waiting for my review?"
     - "Show me my pending applications."
     - "Which applications have been forwarded to underwriting?"
     - "Show Sarah Mitchell's applications."
     - "What documents are missing for this application?"
     - "What deductible does this customer's homeowners policy have?"
     - "What policies does this customer currently have?"
     - "What claims does this customer have?"
     - "Why is this application still pending?"
     - "What should I verify before forwarding this application?"
"""


class AgentAIService:
    """
    Handles Agent AI business logic, prompt assembly with authorized context, and Groq generation.
    """

    @classmethod
    def format_agent_context(cls, context: Optional[Dict[str, Any]]) -> str:
        """
        Formats the authorized agent context into a clean text block for the LLM.
        """
        if not context:
            return "No specific agent context was provided for this inquiry."

        lines = ["=== REAL AGENT SERVICE DATA ==="]

        # Agent Profile
        agent_prof = context.get("agent_profile") or {}
        if agent_prof:
            lines.append(f"Authenticated Agent: {agent_prof.get('name', 'Agent')} (ID: {agent_prof.get('user_id', 'N/A')}, Email: {agent_prof.get('email', 'N/A')})")

        # Assigned Customers
        customers = context.get("assigned_customers") or []
        lines.append(f"\nAssigned Customers Total: {len(customers)}")
        for c in customers[:20]:
            lines.append(f"- Customer ID: {c.get('customer_id')}, Name: {c.get('name')}, Email: {c.get('email')}, Phone: {c.get('mobile', 'N/A')}")

        # Policy Applications
        apps = context.get("applications") or []
        lines.append(f"\nPolicy Applications in Agent Scope: {len(apps)}")
        for a in apps[:25]:
            docs_summary = []
            docs_raw = a.get("documents")
            if isinstance(docs_raw, list):
                docs_summary = [f"{d.get('doc_type', 'Document')} ({d.get('file_name', 'file.pdf')})" for d in docs_raw]
            elif isinstance(docs_raw, str):
                try:
                    parsed = json.loads(docs_raw)
                    if isinstance(parsed, list):
                        docs_summary = [f"{d.get('doc_type', 'Document')} ({d.get('file_name', 'file.pdf')})" for d in parsed]
                except Exception:
                    docs_summary = [docs_raw]

            docs_str = ", ".join(docs_summary) if docs_summary else "No documents uploaded"
            lines.append(
                f"- Application ID: {a.get('application_id')}, Customer: {a.get('customer_name', a.get('customer_id'))}, "
                f"Product: {a.get('product_name', a.get('policy_type'))}, Status: {a.get('status')}, "
                f"Verification Status: {a.get('verification_status', 'PENDING_AGENT_REVIEW')}, "
                f"Coverage Limit: ${float(a.get('coverage_limit') or 0):,.2f}, Deductible: ${float(a.get('deductible') or 0):,.2f}, "
                f"Estimated Premium: ${float(a.get('estimated_premium') or 0):,.2f}, "
                f"Forwarded: {'Yes (by ' + str(a.get('forwarded_by_agent_id')) + ')' if a.get('forwarded_by_agent_id') else 'No'}, "
                f"Documents on File: [{docs_str}], Notes: {a.get('agent_notes') or 'None'}"
            )

        # Customer Policies
        policies = context.get("policies") or []
        lines.append(f"\nAssigned Customer Policies Total: {len(policies)}")
        for p in policies[:30]:
            covs = p.get("coverages") or []
            cov_strs = [f"{cov.get('coverage_name')} (Limit: ${float(cov.get('coverage_limit') or 0):,.2f}, Ded: ${float(cov.get('deductible') or 0):,.2f})" for cov in covs] if covs else []
            excls = p.get("exclusions") or []
            excl_strs = [ex.get('exclusion_name') for ex in excls] if excls else []

            lines.append(
                f"- Policy Number: {p.get('policy_number', p.get('policy_id'))}, Customer: {p.get('customer_name', p.get('customer_id'))}, "
                f"Type: {p.get('policy_type')}, Status: {p.get('status')}, Premium: ${float(p.get('premium') or 0):,.2f}, "
                f"Effective: {p.get('start_date')} to {p.get('end_date')}, "
                f"Coverages: [{'; '.join(cov_strs) if cov_strs else 'Standard'}], "
                f"Exclusions: [{', '.join(excl_strs) if excl_strs else 'Standard exclusions'}]"
            )

        # Claims
        claims = context.get("claims") or []
        lines.append(f"\nAssigned Customer Claims Total: {len(claims)}")
        for clm in claims[:20]:
            lines.append(
                f"- Claim Number: {clm.get('claim_number', clm.get('claim_id'))}, Customer: {clm.get('customer_name', clm.get('customer_id'))}, "
                f"Policy: {clm.get('policy_number', clm.get('policy_id'))}, Status: {clm.get('claim_status')}, "
                f"Incident Date: {clm.get('incident_date')}, Amount: ${float(clm.get('claim_amount') or 0):,.2f}, "
                f"Description: {clm.get('incident_description')}"
            )

        # Renewal Requests
        renewals = context.get("renewals") or []
        if renewals:
            lines.append(f"\nUpcoming Renewals Total: {len(renewals)}")
            for r in renewals[:15]:
                lines.append(
                    f"- Renewal ID: {r.get('renewal_id')}, Policy: {r.get('policy_number')}, Customer: {r.get('customer_name')}, "
                    f"Renewal Date: {r.get('renewal_date')}, Premium: ${float(r.get('renewal_premium') or 0):,.2f}, Status: {r.get('status')}"
                )

        return "\n".join(lines)

    @classmethod
    async def process_agent_chat(
        cls,
        message: str,
        agent_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
        history: Optional[List[Dict[str, Any]]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> AgentChatResponse:
        """
        Processes an Agent AI inquiry, formats context, and calls Groq LLM.
        """
        conv_id = conversation_id or f"conv-agt-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        formatted_context = cls.format_agent_context(context)

        # Bounded conversation history
        history_context = ""
        if history:
            history_lines = ["\nRECENT CONVERSATION HISTORY:"]
            for item in history[-8:]:
                sender = "Agent" if item.get("sender") in ("user", "agent") or item.get("sender_type") == "user" else "Assistant"
                content = item.get("content") or item.get("message") or ""
                if content and not item.get("isTyping"):
                    history_lines.append(f"{sender}: {content}")
            if len(history_lines) > 1:
                history_context = "\n".join(history_lines)

        full_system_prompt = f"{AGENT_AI_SYSTEM_PROMPT}\n\n{formatted_context}{history_context}"

        # Call Groq LLM
        completion_result = await groq_client.generate_response(
            system_prompt=full_system_prompt,
            user_prompt=message,
            temperature=0.2,
            max_tokens=1024
        )

        response_text = completion_result.get("response", "")

        # Fallback if empty or failure
        if not response_text:
            response_text = cls._generate_grounded_fallback(message, context)

        # Generate conversation title if new
        title = None
        if not conversation_id or conversation_id.startswith("temp-"):
            clean_title = re.sub(r'[^a-zA-Z0-9\s]', '', message).strip()
            title = (clean_title[:32] + "...") if len(clean_title) > 32 else (clean_title or "Agent Advisory Session")

        return AgentChatResponse(
            conversation_id=conv_id,
            title=title,
            response=response_text,
            message_id=f"msg-agt-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}",
            created_at=datetime.datetime.utcnow().isoformat() + "Z"
        )

    @classmethod
    def _generate_grounded_fallback(cls, message: str, context: Optional[Dict[str, Any]]) -> str:
        """
        Deterministic grounded fallback engine for offline or rate-limited environments.
        """
        msg_lower = message.lower()
        ctx = context or {}
        apps = ctx.get("applications") or []
        policies = ctx.get("policies") or []
        claims = ctx.get("claims") or []
        customers = ctx.get("assigned_customers") or []

        # 1. Pending applications inquiry
        if any(k in msg_lower for k in ("pending", "waiting for my review", "need verification", "intake")):
            pending_apps = [a for a in apps if "pending" in str(a.get("status", "")).lower() or "pending" in str(a.get("verification_status", "")).lower() or not a.get("forwarded_by_agent_id")]
            if pending_apps:
                out = [f"You currently have **{len(pending_apps)} application(s)** awaiting agent review and verification:"]
                for a in pending_apps:
                    cust_name = a.get("customer_name") or a.get("customer_id")
                    prod = a.get("product_name") or a.get("policy_type")
                    app_id = a.get("application_id")
                    status = a.get("status", "SUBMITTED")
                    out.append(f"- **{app_id}** — {cust_name} ({prod}) · Status: `{status}`")
                    out.append(f"  📄 Application Summary ({app_id})\n  Download PDF ↓")
                return "\n".join(out)
            else:
                return "You have no applications currently pending agent review in your queue."

        # 2. Forwarded applications inquiry
        if "forwarded" in msg_lower:
            fwd_apps = [a for a in apps if a.get("forwarded_by_agent_id") or "forward" in str(a.get("status", "")).lower()]
            if fwd_apps:
                out = [f"You have **{len(fwd_apps)} application(s)** forwarded to underwriting:"]
                for a in fwd_apps:
                    out.append(f"- **{a.get('application_id')}** — {a.get('customer_name', a.get('customer_id'))} ({a.get('product_name', a.get('policy_type'))}) · Status: `{a.get('status')}`")
                return "\n".join(out)
            else:
                return "You currently have no applications with forwarded status in your queue."

        # 3. Specific customer inquiry (e.g. Sarah, Priya, etc.)
        for c in customers:
            first_name = c.get("name", "").split()[0].lower()
            if len(first_name) >= 3 and first_name in msg_lower:
                c_name = c.get("name")
                c_id = c.get("customer_id")
                c_pols = [p for p in policies if p.get("customer_id") == c_id or p.get("customer_name") == c_name]
                c_apps = [a for a in apps if a.get("customer_id") == c_id or a.get("customer_name") == c_name]
                c_clms = [clm for clm in claims if clm.get("customer_id") == c_id or clm.get("customer_name") == c_name]

                out = [f"### Client Overview: {c_name} (ID: {c_id})"]
                if c_pols:
                    out.append(f"**Active Policies ({len(c_pols)}):**")
                    for p in c_pols:
                        out.append(f"- **{p.get('policy_number')}** — {p.get('policy_type')} (Premium: ${float(p.get('premium') or 0):,.2f}, Status: {p.get('status')})")
                        out.append(f"  📄 Policy Summary ({p.get('policy_number')})\n  Download PDF ↓")
                if c_apps:
                    out.append(f"\n**Applications ({len(c_apps)}):**")
                    for a in c_apps:
                        out.append(f"- **{a.get('application_id')}** — {a.get('product_name', a.get('policy_type'))} (Status: {a.get('status')})")
                if c_clms:
                    out.append(f"\n**Claims ({len(c_clms)}):**")
                    for clm in c_clms:
                        out.append(f"- **{clm.get('claim_number')}** — {clm.get('incident_description', 'Claim')} (Status: {clm.get('claim_status')})")
                return "\n".join(out)

        # 4. Missing documents inquiry
        if any(k in msg_lower for k in ("missing document", "document", "documents missing", "verification")):
            out = ["### Application Verification & Document Status:"]
            if apps:
                for a in apps[:5]:
                    app_id = a.get("application_id")
                    cust = a.get("customer_name", a.get("customer_id"))
                    docs_raw = a.get("documents")
                    docs_count = 0
                    if isinstance(docs_raw, list):
                        docs_count = len(docs_raw)
                    elif isinstance(docs_raw, str):
                        try:
                            docs_count = len(json.loads(docs_raw))
                        except Exception:
                            docs_count = 1 if docs_raw else 0

                    if docs_count == 0:
                        out.append(f"- **{app_id}** ({cust}): ⚠️ **Missing all required documents** (Identity / Proof of Ownership / Risk Assessment).")
                    else:
                        out.append(f"- **{app_id}** ({cust}): ✅ {docs_count} document(s) uploaded. Verification status: `{a.get('verification_status', 'PENDING')}`.")
                return "\n".join(out)
            else:
                return "No applications are currently registered in your assigned queue to check documents."

        # 5. Policies inquiry
        if "policies" in msg_lower or "policy" in msg_lower:
            if policies:
                out = [f"You manage **{len(policies)} total policy record(s)** across your assigned customer book:"]
                for p in policies[:5]:
                    out.append(f"- **{p.get('policy_number')}** — {p.get('customer_name', 'Customer')} ({p.get('policy_type')}) · ${float(p.get('premium') or 0):,.2f}/yr")
                return "\n".join(out)
            else:
                return "No active policies are currently assigned to your agent account."

        # 6. Claims inquiry
        if "claim" in msg_lower or "claims" in msg_lower:
            if claims:
                out = [f"There are **{len(claims)} claim(s)** on file for your assigned client accounts:"]
                for clm in claims[:5]:
                    out.append(f"- **{clm.get('claim_number')}** — {clm.get('customer_name', 'Customer')} · Status: `{clm.get('claim_status')}` (Amount: ${float(clm.get('claim_amount') or 0):,.2f})")
                return "\n".join(out)
            else:
                return "There are currently no claims filed for your assigned customer accounts."

        # Default general helpful guidance
        return (
            f"I have access to your assigned portfolio of **{len(customers)} customers**, **{len(policies)} policies**, and **{len(apps)} applications**.\n\n"
            "You can ask me to:\n"
            "- List pending applications requiring agent verification\n"
            "- Check document completeness for specific submissions\n"
            "- Summarize a customer's active policies and coverage limits\n"
            "- Review open claims and renewal deadlines across your client accounts"
        )
