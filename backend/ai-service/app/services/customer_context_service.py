import logging
import re
from typing import Optional, Dict, Any, List, Set

from app.clients.customer_service_client import customer_service_client

logger = logging.getLogger("ai_service.context.customer")


class CustomerContextService:
    """
    Intelligent Context Retrieval & Normalization Service for Customer AI inquiries.
    """

    @classmethod
    def is_general_concept_query(cls, message: str) -> bool:
        """
        Detects if a user query is purely asking for general insurance terminology or definitions
        without referring to their own personal policy or account.
        """
        msg = message.lower().strip()
        personal_indicators = [
            "my ", "mine", "i have", "do i", "am i", "for me", "my policy", "my claim",
            "my application", "my deductible", "my limit", "my agent", "my premium", "my account",
            "what do i", "can i", "is my", "status of my", "who is my"
        ]
        
        has_personal_intent = any(p in msg for p in personal_indicators)
        if has_personal_intent:
            return False

        general_patterns = [
            r"^what is (a|an|the concept of)?\s*[a-z\s]+(\?)?$",
            r"^what are (the)?\s*[a-z\s]+(\?)?$",
            r"^explain (what|how|a|an)?\s*[a-z\s]+(\?)?$",
            r"^define\s+[a-z\s]+(\?)?$",
            r"^how does (a|an)?\s*[a-z\s]+ work(\?)?$",
            r"^meaning of\s+[a-z\s]+(\?)?$"
        ]
        
        return any(re.match(pattern, msg) for pattern in general_patterns)

    @classmethod
    def detect_intents(cls, message: str) -> Set[str]:
        """
        Analyzes the customer message to determine what data domains are relevant.
        Returns a set of domain keys: {'policies', 'applications', 'claims', 'profile'}
        """
        msg = message.lower()
        intents: Set[str] = set()

        policy_keywords = [
            "policy", "policies", "cover", "coverage", "deductible", "limit", "premium",
            "effective", "expiry", "expire", "renewal", "renew", "exclusion", "peril", "insured",
            "protection", "property", "auto", "homeowner"
        ]
        if any(w in msg for w in policy_keywords):
            intents.add("policies")

        app_keywords = [
            "application", "applied", "apply", "submission", "submitted", "intake",
            "verification", "underwriter", "agent review", "pending review", "documents required"
        ]
        if any(w in msg for w in app_keywords):
            intents.add("applications")

        claim_keywords = [
            "claim", "claims", "fnol", "loss", "incident", "accident", "damage", "filed", "settlement"
        ]
        if any(w in msg for w in claim_keywords):
            intents.add("claims")

        profile_keywords = [
            "agent", "assigned agent", "broker", "profile", "contact", "address", "phone", "email"
        ]
        if any(w in msg for w in profile_keywords):
            intents.add("profile")

        # Check for document related keywords
        doc_keywords = ["document", "documents", "uploaded", "paperwork", "form", "pdf", "file", "license", "inspection", "proof", "attach"]
        if any(w in msg for w in doc_keywords):
            intents.update({"policies", "applications"})

        # If no specific intent was detected or message is broad/general account question, fetch all
        if not intents or any(phrase in msg for phrase in ["account", "all my", "overview", "summary", "status"]):
            intents.update({"policies", "applications", "claims", "profile"})

        return intents

    @classmethod
    async def retrieve_grounded_context(
        cls,
        message: str,
        customer_id: Optional[str] = None,
        auth_token: Optional[str] = None,
        explicit_context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Dynamically extracts customer data from explicit context or queries Customer Service
        and formats a grounded context block for the LLM prompt.
        """
        # If the user is asking a purely general terminology definition, omit customer context
        if cls.is_general_concept_query(message) and not explicit_context:
            logger.info("Inquiry classified as general insurance concept. Skipping live customer data fetch.")
            return "Note: This inquiry appears to be a general insurance concept question. Answer using general P&C insurance principles."

        # If caller provided structured customer context (from Customer Service), format it directly
        if explicit_context and isinstance(explicit_context, dict) and any(k in explicit_context for k in ("policies", "applications", "claims", "profile")):
            return cls._format_structured_context(explicit_context, customer_id, message)

        # Determine authentication token to query Customer Service via HTTP
        token = auth_token
        if not token and customer_id:
            logger.info(f"Minting internal service token for customer_id={customer_id}")
            token = customer_service_client.create_service_token(customer_id)

        if not token:
            if explicit_context:
                return cls._format_explicit_context(explicit_context)
            return "CUSTOMER CONTEXT:\n- No customer identity or authentication provided. Cannot retrieve personal policy records."

        intents = cls.detect_intents(message)
        logger.info(f"Detected context retrieval domains for customer inquiry: {intents}")

        context_lines: List[str] = ["REAL CUSTOMER SERVICE DATA:"]

        # 1. Profile / Agent
        if "profile" in intents:
            profile = await customer_service_client.get_profile(token)
            if profile:
                context_lines.append(f"- Customer Profile: {profile.get('name')} (ID: {profile.get('id', customer_id)})")
                context_lines.append(f"  * Email: {profile.get('email')}, Phone: {profile.get('phone')}")
                context_lines.append(f"  * Address: {profile.get('address')}")
                context_lines.append(f"  * Active Policies Count: {profile.get('active_policies_count', 0)}")
                context_lines.append(f"  * Open Claims Count: {profile.get('open_claims_count', 0)}")
                agent = profile.get("assigned_agent")
                if agent:
                    context_lines.append(f"  * Assigned Agent: {agent.get('name')} (Email: {agent.get('email')}, Phone: {agent.get('phone')})")
                else:
                    context_lines.append("  * Assigned Agent: Unassigned")

        # 2. Policies
        if "policies" in intents:
            policies = await customer_service_client.get_policies(token)
            if policies and len(policies) > 0:
                context_lines.append(f"- Active & Historical Policies ({len(policies)} total):")
                for p in policies:
                    pol_num = p.get('policy_number', p.get('id'))
                    pol_type = p.get('type', 'Insurance')
                    context_lines.append(
                        f"  * Policy {pol_num}: Type='{pol_type}', Category='{p.get('category')}', "
                        f"Status='{p.get('status')}', Premium='{p.get('premium')}', Deductible='{p.get('deductible')}', "
                        f"Effective='{p.get('effective_date')}' to '{p.get('expiry_date')}' | "
                        f"Available Document: '{pol_type} Policy' ({pol_num})"
                    )
            else:
                context_lines.append("- Active Policies: Customer has no active insurance policies recorded.")

        # 3. Applications
        if "applications" in intents:
            applications = await customer_service_client.get_applications(token)
            if applications and len(applications) > 0:
                context_lines.append(f"- Policy Applications ({len(applications)} total):")
                for a in applications:
                    raw_docs = a.get("documents", [])
                    doc_items = []
                    for d in raw_docs:
                        if isinstance(d, dict) and (d.get("doc_type") or d.get("file_name")):
                            doc_items.append(f"{d.get('doc_type', 'Document')} ({d.get('file_name', 'file.pdf')})")
                    docs_formatted = ", ".join(doc_items) if doc_items else "None on file"

                    context_lines.append(
                        f"  * Application ID '{a.get('application_id')}': Product='{a.get('product_name', a.get('policy_type'))}', "
                        f"Tier='{a.get('coverage_tier')}', Limit='{a.get('coverage_limit', 'N/A')}', Deductible='{a.get('deductible', 'N/A')}', "
                        f"Est. Premium='{a.get('estimated_premium')}', Status='{a.get('status')}', Verification='{a.get('verification_status')}', "
                        f"Submitted='{a.get('created_at')}', Uploaded Documents: [{docs_formatted}], Agent Notes='{a.get('agent_notes') or 'None'}'"
                    )
            else:
                context_lines.append("- Policy Applications: Customer has no policy applications submitted.")

        # 4. Claims
        if "claims" in intents:
            claims = await customer_service_client.get_claims(token)
            if claims and len(claims) > 0:
                context_lines.append(f"- Customer Claims ({len(claims)} total):")
                for c in claims:
                    context_lines.append(
                        f"  * Claim '{c.get('id')}': Policy='{c.get('policy_name', c.get('policy_id'))}', "
                        f"Incident Date='{c.get('incident_date')}', Status='{c.get('status')}', "
                        f"Est. Settlement='{c.get('estimated_amount')}', Description='{c.get('incident_description')}'"
                    )
            else:
                context_lines.append("- Claims: Customer currently has no filed claims.")

        return "\n".join(context_lines)

    @classmethod
    def _format_structured_context(cls, ctx: Dict[str, Any], customer_id: Optional[str] = None, message: str = "") -> str:
        lines: List[str] = ["REAL CUSTOMER SERVICE DATA:"]
        intents = cls.detect_intents(message) if message else {"policies", "applications", "claims", "profile"}

        # Profile
        profile = ctx.get("profile")
        if profile and isinstance(profile, dict):
            lines.append(f"- Customer Profile: {profile.get('name')} (ID: {profile.get('id', customer_id)})")
            lines.append(f"  * Email: {profile.get('email')}, Phone: {profile.get('phone')}")
            lines.append(f"  * Address: {profile.get('address')}")
            agent = profile.get("assigned_agent")
            if agent and isinstance(agent, dict):
                lines.append(f"  * Assigned Agent: {agent.get('name')} (Email: {agent.get('email')}, Phone: {agent.get('phone')})")
            else:
                lines.append("  * Assigned Agent: Unassigned")

        # Policies
        if "policies" in intents:
            policies = ctx.get("policies")
            if policies and isinstance(policies, list) and len(policies) > 0:
                lines.append(f"- Active & Historical Policies ({len(policies)} total):")
                for p in policies[:8]:
                    pol_num = p.get('policy_number', p.get('id'))
                    pol_type = p.get('type', 'Insurance')
                    lines.append(
                        f"  * Policy {pol_num}: Type='{pol_type}', Category='{p.get('category')}', "
                        f"Status='{p.get('status')}', Premium='{p.get('premium')}', Deductible='{p.get('deductible')}', "
                        f"Effective='{p.get('effective_date')}' to '{p.get('expiry_date')}' | "
                        f"Available Document: '{pol_type} Policy' ({pol_num})"
                    )
            else:
                lines.append("- Active Policies: Customer has no active insurance policies recorded.")

        # Applications
        if "applications" in intents:
            applications = ctx.get("applications")
            if applications and isinstance(applications, list) and len(applications) > 0:
                lines.append(f"- Policy Applications ({len(applications)} total):")
                for a in applications[:6]:
                    raw_docs = a.get("documents", [])
                    doc_items = []
                    if isinstance(raw_docs, list):
                        for d in raw_docs:
                            if isinstance(d, dict) and (d.get("doc_type") or d.get("file_name")):
                                doc_items.append(f"{d.get('doc_type', 'Document')} ({d.get('file_name', 'file.pdf')})")
                    docs_formatted = ", ".join(doc_items) if doc_items else "None on file"

                    lines.append(
                        f"  * Application ID '{a.get('application_id')}': Product='{a.get('product_name', a.get('policy_type'))}', "
                        f"Tier='{a.get('coverage_tier')}', Limit='{a.get('coverage_limit', 'N/A')}', Deductible='{a.get('deductible', 'N/A')}', "
                        f"Est. Premium='{a.get('estimated_premium')}', Status='{a.get('status')}', Verification='{a.get('verification_status')}', "
                        f"Submitted='{a.get('created_at')}', Uploaded Documents: [{docs_formatted}], Agent Notes='{a.get('agent_notes') or 'None'}'"
                    )
            else:
                lines.append("- Policy Applications: Customer has no policy applications submitted.")

        # Claims
        if "claims" in intents:
            claims = ctx.get("claims")
            if claims and isinstance(claims, list) and len(claims) > 0:
                lines.append(f"- Customer Claims ({len(claims)} total):")
                for c in claims[:6]:
                    lines.append(
                        f"  * Claim '{c.get('claim_number', c.get('id'))}': Policy='{c.get('policy_id')}', "
                        f"Incident Date='{c.get('incident_date')}', Status='{c.get('status')}', "
                        f"Est. Settlement='{c.get('estimated_amount')}', Description='{c.get('incident_description')}'"
                    )
            else:
                lines.append("- Claims: Customer currently has no filed claims.")

        return "\n".join(lines)

    @classmethod
    def _format_explicit_context(cls, explicit_context: Dict[str, Any]) -> str:
        lines = ["CUSTOMER CONTEXT (Explicit):"]
        for k, v in explicit_context.items():
            lines.append(f"- {k}: {v}")
        return "\n".join(lines)
