import json
import logging
import datetime
import random
from typing import Optional, Dict, Any, List

from app.services.groq_service import groq_client
from app.schemas.admin_ai import AdminChatResponse

logger = logging.getLogger("ai_service.admin")

ADMIN_AI_SYSTEM_PROMPT = """You are the InsureAssist Enterprise Governance & Administration AI Assistant.
Your purpose is to assist platform administrators and IT governance personnel with system monitoring, user identity lifecycle governance, RBAC role audits, policy portfolio oversight, system audit logs, access verification, and security compliance.

CRITICAL OPERATIONAL RULES:
1. STRICT GROUND TRUTH ONLY:
   - Ground every user count, pending status, role capability, policy metric, audit event, and system detail strictly in the authorized data provided in `=== REAL ADMIN SERVICE DATA ===` below.
   - NEVER INVENT or assume user accounts, email addresses, password hashes, policy counts, audit logs, or system figures that are not explicitly present in the data.
   - Clearly distinguish verified database facts from unverified requests.

2. USER STATUS & PENDING USER INQUIRIES (e.g. "How many users are currently in Pending status?", "Show pending users", "List users"):
   - When asked about pending users or user breakdown:
     - Directly state the exact pending user count from the `User Governance & Identity Overview` in `REAL ADMIN SERVICE DATA`.
     - Provide the breakdown by role (Customer, Agent, Underwriter, Admin).
     - If pending users are listed in the data, list their Name, Email, Role, and Creation Date cleanly.
     - If there are 0 pending users, state: "There are currently 0 users in Pending status across the platform."

3. POLICY PORTFOLIO & CATEGORY INQUIRIES (e.g. "Summarize enterprise policy count by category", "Show policy stats"):
   - Directly state the real policy metrics: total policies, active policies, pending policies, expired policies, total portfolio premium, and category breakdown (Auto, Home, Commercial, Health, etc.) from `REAL ADMIN SERVICE DATA`.
   - Never invent arbitrary policy volumes or fictional premium dollars.

4. AUDIT & ACTIVITY LOG INQUIRIES (e.g. "Check audit log for failed login attempts", "Show recent administrator privilege changes", "Recent audit events"):
   - Review the `=== RECENT AUDIT / ACTIVITY LOGS ===` in the data.
   - Summarize the real recent actions, actors, target entities, timestamps, and outcomes.
   - If no failed logins or privilege modifications appear in the logs, clearly state: "No failed login attempts or unauthorized privilege escalations were recorded in the recent audit logs."

5. ROLE-BASED ACCESS CONTROL (RBAC) PERMISSIONS (e.g. "What are the RBAC permissions for Underwriters?", "Explain Agent vs Underwriter roles"):
   - Summarize the exact authorized permissions for the requested role:
     - **Customer**: View own policies, submit claims (FNOL), track renewal requests, download policy/claim documents, interact with Customer AI Assistant.
     - **Agent / Broker**: Manage assigned customer portfolio, submit and track policy applications, review customer policies/renewals, forward applications to Underwriting, interact with Agent AI Assistant.
     - **Underwriter**: Access underwriting review queue, assess risk scores and loss runs, review submitted documents, approve/reject/request info on applications, prepare underwriting review summaries, interact with Underwriting AI Assistant.
     - **Administrator**: Full platform governance, user lifecycle management (create, reset password, confirm RBAC access), policy catalog oversight, audit log analysis, system security metrics, interact with Enterprise Governance Assistant.

6. CONCISE, PROFESSIONAL & EDITORIAL:
   - Format responses cleanly using structured bullet points, clear bold highlights, and professional enterprise governance terminology.
   - Do NOT expose raw database table names, SQL queries, internal column names, model names, Groq, provider details, or confidence scores.
   - Do NOT show raw Markdown syntax errors.
"""


class AdminAIService:
    """
    Handles Admin AI business logic, prompt assembly with authorized context, and Groq generation.
    """

    @classmethod
    def format_admin_context(cls, context: Optional[Dict[str, Any]]) -> str:
        """
        Formats the authorized admin governance context into a clean text block for the LLM.
        """
        if not context:
            return "No specific admin governance context was provided for this inquiry."

        lines = ["=== REAL ADMIN SERVICE DATA ==="]

        # Admin Profile
        adm_prof = context.get("admin_profile") or {}
        if adm_prof:
            lines.append(f"Authenticated Administrator: {adm_prof.get('name', 'Admin')} (ID: {adm_prof.get('user_id', 'N/A')}, Email: {adm_prof.get('email', 'N/A')}, Role: {adm_prof.get('role', 'Admin')})")

        # System & User Metrics
        user_stats = context.get("user_stats") or {}
        if user_stats:
            lines.append("\n--- User Governance & Identity Overview ---")
            lines.append(f"Total Users: {user_stats.get('total_users', 0)}")
            lines.append(f"Active Users: {user_stats.get('active_users', 0)}")
            lines.append(f"Pending Users: {user_stats.get('pending_users', 0)}")
            by_role = user_stats.get("by_role", {})
            if by_role:
                lines.append(f"Users by Role: {', '.join(f'{k}: {v}' for k, v in by_role.items())}")

        # Pending Users Detail
        pending_list = context.get("pending_users_list") or []
        if pending_list:
            lines.append(f"\n--- Pending User Verification Queue ({len(pending_list)} users) ---")
            for u in pending_list[:10]:
                lines.append(f"  • User ID: {u.get('user_id')} | Name: {u.get('name')} | Email: {u.get('email')} | Role: {u.get('role')} | Registered: {u.get('created_at')}")

        # Policy Portfolio Stats
        pol_stats = context.get("policy_stats") or {}
        if pol_stats:
            lines.append("\n--- Policy Portfolio Overview ---")
            lines.append(f"Total Policies: {pol_stats.get('total_policies', 0)}")
            lines.append(f"Active Policies: {pol_stats.get('active_policies', 0)}")
            lines.append(f"Pending Policies: {pol_stats.get('pending_policies', 0)}")
            lines.append(f"Expired Policies: {pol_stats.get('expired_policies', 0)}")
            lines.append(f"Total Portfolio Premium: ${pol_stats.get('total_premium', 0):,.2f}" if isinstance(pol_stats.get('total_premium'), (int, float)) else f"Total Premium: {pol_stats.get('total_premium')}")
            by_type = pol_stats.get("by_type", {})
            if by_type:
                lines.append(f"Policies by Category: {', '.join(f'{k}: {v}' for k, v in by_type.items())}")

        # Audit Logs
        audit_logs = context.get("recent_audit_logs") or []
        if audit_logs:
            lines.append(f"\n--- Recent Audit / Activity Logs ({len(audit_logs)} events) ---")
            for a in audit_logs[:12]:
                lines.append(f"  • [{a.get('timestamp', 'N/A')}] Actor: {a.get('actor', 'System')} | Action: {a.get('action', 'N/A')} | Target: {a.get('target', 'N/A')} | Status: {a.get('status', 'Success')}")

        # RBAC Roles Reference
        lines.append("\n--- Platform RBAC Role Capabilities ---")
        lines.append("  • Customer: Policyholder access to active policies, FNOL claims, renewals, and customer AI assistant.")
        lines.append("  • Agent / Broker: Intermediary access to assigned customers, application submissions, renewals, and agent AI assistant.")
        lines.append("  • Senior Underwriter: Decision authority for underwriting review queue, risk evaluation, application approvals/rejections, and underwriter AI assistant.")
        lines.append("  • Administrator: Root enterprise access for user lifecycle management, RBAC access control, policy governance, audit logs, and governance AI assistant.")

        return "\n".join(lines)

    @classmethod
    async def process_admin_chat(
        cls,
        message: str,
        admin_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
        history: Optional[List[Dict[str, Any]]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> AdminChatResponse:
        """
        Processes an Admin AI chat prompt through context grounding and Groq LLM.
        """
        now = datetime.datetime.utcnow()
        conv_id = conversation_id or f"conv-adm-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"
        bot_msg_id = f"msg-ab-{now.strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"

        # 1. Format Context
        formatted_context = cls.format_admin_context(context)

        # 2. Build History Prompt Block
        history_lines = []
        if history:
            for item in history[-8:]:
                sender = item.get("sender") or item.get("role") or "user"
                content = item.get("message") or item.get("content") or ""
                if content:
                    label = "Administrator" if sender in ("user", "admin") else "Governance AI"
                    history_lines.append(f"{label}: {content}")

        history_block = ""
        if history_lines:
            history_block = "\n=== RECENT CONVERSATION HISTORY ===\n" + "\n".join(history_lines) + "\n"

        # 3. Assemble User Prompt
        full_user_prompt = f"""{formatted_context}
{history_block}
=== CURRENT INQUIRY ===
Administrator: {message}

Please provide a precise, data-grounded, and structured response following your operational guidelines."""

        # 4. Generate Response via Groq
        llm_res = await groq_client.generate_response(
            user_prompt=full_user_prompt,
            system_prompt=ADMIN_AI_SYSTEM_PROMPT,
            temperature=0.2,
            max_tokens=1024
        )

        response_text = llm_res.get("response", "I am unable to process this governance inquiry right now. Please try again.")

        # 5. Determine title
        title = (message[:32] + "...") if len(message) > 32 else message

        return AdminChatResponse(
            conversation_id=conv_id,
            title=title,
            response=response_text,
            message_id=bot_msg_id,
            created_at=now.isoformat() + "Z"
        )
