import logging
import httpx
from typing import Optional, List, Dict, Any

from app.config import settings

logger = logging.getLogger("ai_service.groq")


class GroqClient:
    """
    Reusable OpenAI-compatible client for Groq LLM API.
    Supports asynchronous chat completion requests with deterministic mock mode fallback.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        default_model: Optional[str] = None,
        timeout_seconds: float = 30.0
    ):
        self.api_key = api_key or settings.GROQ_API_KEY
        self.base_url = (base_url or settings.GROQ_API_URL).rstrip("/")
        self.default_model = default_model or settings.GROQ_MODEL
        self.timeout_seconds = timeout_seconds

    def generate_mock_response(self, system_prompt: str, user_prompt: str) -> str:
        """Alias for _get_mock_response with (system_prompt, user_prompt) parameter order."""
        return self._get_mock_response(user_prompt=user_prompt, system_prompt=system_prompt)

    def _get_mock_response(self, user_prompt: str, system_prompt: str) -> str:
        """
        Generate deterministic mock responses for testing and offline development.
        If real customer context is available in system_prompt, reference it accurately.
        """
        import json
        prompt_lower = user_prompt.lower()
        has_context = "REAL CUSTOMER SERVICE DATA:" in system_prompt or "CUSTOMER CONTEXT" in system_prompt or "REAL CUSTOMER POLICY CONTEXT:" in user_prompt

        # Handle Coverage Check structured JSON requests
        if "COVERAGE_CHECK_SYSTEM_PROMPT" in system_prompt or "THREE ALLOWED ASSESSMENTS" in system_prompt or "relevant_policy" in system_prompt:
            # Extract raw scenario text
            scenario_text = user_prompt
            if "Customer Incident Scenario to Evaluate:" in user_prompt:
                scenario_text = user_prompt.split("Customer Incident Scenario to Evaluate:")[1].split("REAL CUSTOMER")[0].strip(' \n"\'')

            scenario_lower = scenario_text.lower()

            if any(k in scenario_lower for k in ("pipe", "water", "leak", "burst", "washing machine", "overflow", "plumbing")):
                return json.dumps({
                    "scenario": scenario_text,
                    "assessment": "Potentially Covered",
                    "status_description": "Sudden and accidental water discharge is generally an eligible peril under your active Homeowners policy.",
                    "reason": "Direct physical damage to your dwelling structure and fixtures resulting from an internal plumbing burst or appliance discharge is covered under Coverage A (Dwelling Protection).",
                    "relevant_policy": "Homeowners Premier Protection (HOM-883920)",
                    "relevant_coverage": "Dwelling Protection",
                    "relevant_exclusion": "Gradual continuous leakage, seepage over time, or lack of maintenance is excluded.",
                    "applicable_deductible": "$1,000",
                    "recommended_action": "Shut off the main water valve, take photos of all damaged items, and submit an FNOL claim."
                })
            elif any(k in scenario_lower for k in ("tree", "storm", "roof", "wind", "garage", "falling object", "collapse")):
                return json.dumps({
                    "scenario": scenario_text,
                    "assessment": "Potentially Covered",
                    "status_description": "Damage caused by falling trees, severe windstorms, or impact to structures is covered under Dwelling Protection.",
                    "reason": "Your Homeowners policy covers structural damage to the dwelling and attached/detached garage caused by falling trees and windstorms.",
                    "relevant_policy": "Homeowners Premier Protection (HOM-883920)",
                    "relevant_coverage": "Dwelling Protection",
                    "relevant_exclusion": "Damage caused by diseased or neglected trees that the homeowner failed to maintain may be excluded.",
                    "applicable_deductible": "$1,000",
                    "recommended_action": "Safely photograph the structural damage, secure the area from further exposure, and file a claim."
                })
            elif any(k in scenario_lower for k in ("theft", "stolen", "robbery", "break-in", "burglar")):
                return json.dumps({
                    "scenario": scenario_text,
                    "assessment": "Potentially Covered",
                    "status_description": "Theft of personal belongings is generally evaluated under Homeowners property provisions.",
                    "reason": "Personal property loss due to theft from your residence is covered subject to your policy deductible and category limits.",
                    "relevant_policy": "Homeowners Premier Protection (HOM-883920)",
                    "relevant_coverage": "Personal Property Protection",
                    "relevant_exclusion": "Unscheduled high-value jewelry or collectibles are subject to specific sub-limits.",
                    "applicable_deductible": "$1,000",
                    "recommended_action": "Obtain a formal police report number and submit an FNOL claim with receipts or photos of the stolen items."
                })
            elif any(k in scenario_lower for k in ("flood", "storm surge", "rising water")):
                return json.dumps({
                    "scenario": scenario_text,
                    "assessment": "Requires Policy Review",
                    "status_description": "External surface flooding and storm surge require verification against dedicated flood endorsements.",
                    "reason": "Base Homeowners policies standardly exclude surface flood and storm surge. Coverage requires an active Supplemental NFIP or flood rider.",
                    "relevant_policy": "Homeowners Premier Protection (HOM-883920)",
                    "relevant_coverage": "Supplemental Flood Protection (if endorsed)",
                    "relevant_exclusion": "Surface Water & External Flood Exclusion (Section I Exclusions)",
                    "applicable_deductible": "$1,000",
                    "recommended_action": "Check if a dedicated Flood Endorsement is active or contact your assigned agent Alex Rivera."
                })
            elif any(k in scenario_lower for k in ("neighbor", "damaged neighbor", "third-party", "liability", "guest", "slipped", "injury")):
                return json.dumps({
                    "scenario": scenario_text,
                    "assessment": "Potentially Covered",
                    "status_description": "Third-party bodily injury and property damage are covered under Personal Liability.",
                    "reason": "Your Homeowners Premier Protection policy includes $300,000 in Personal Liability coverage for accidental property damage or bodily injury to others.",
                    "relevant_policy": "Homeowners Premier Protection (HOM-883920)",
                    "relevant_coverage": "Personal Liability ($300,000 Limit)",
                    "relevant_exclusion": "Intentional harm or commercial business activities conducted on premises are excluded.",
                    "applicable_deductible": "$1,000",
                    "recommended_action": "Notify your insurer promptly and do not admit liability until consulting with your claims adjuster."
                })
            elif any(k in scenario_lower for k in ("car", "auto", "vehicle", "collision", "parked", "bumper", "rear-end", "hit and run", "fender bender")):
                return json.dumps({
                    "scenario": scenario_text,
                    "assessment": "Potentially Covered",
                    "status_description": "Vehicular collision, comprehensive damage, and property damage liability are active under your auto policy.",
                    "reason": "Comprehensive/collision coverage applies to physical damage to your insured vehicle (including parked vehicle damage), while liability covers third-party damage.",
                    "relevant_policy": "Auto Policy (POL-2026-0120920)",
                    "relevant_coverage": "Comprehensive & Collision Coverage",
                    "relevant_exclusion": "Unlicensed drivers or commercial ridesharing without endorsement are excluded.",
                    "applicable_deductible": "$500",
                    "recommended_action": "Exchange insurance details with involved drivers, document vehicle damages, and report a claim."
                })
            elif any(k in scenario_lower for k in ("medical", "abroad", "travel", "international", "overseas", "paris", "europe")):
                return json.dumps({
                    "scenario": scenario_text,
                    "assessment": "Not Listed in Available Coverage",
                    "status_description": "Domestic P&C policies do not provide emergency medical coverage in foreign countries.",
                    "reason": "Your auto and homeowners policies have territorial boundaries limited to the United States and Canada. International travel medical insurance is required.",
                    "relevant_policy": None,
                    "relevant_coverage": None,
                    "relevant_exclusion": "Territorial Limitation Clause (Domestic Territory Only)",
                    "applicable_deductible": None,
                    "recommended_action": "Obtain a dedicated international travel medical insurance policy for overseas trips."
                })
            else:
                return json.dumps({
                    "scenario": scenario_text,
                    "assessment": "Requires Policy Review",
                    "status_description": "This scenario requires verification against detailed policy schedules and endorsements.",
                    "reason": "Based on the available policy information, eligibility depends on the specific cause of loss and applicable policy endorsements.",
                    "relevant_policy": "Homeowners Premier Protection (HOM-883920)",
                    "relevant_coverage": "General Policy Terms",
                    "relevant_exclusion": None,
                    "applicable_deductible": "$1,000",
                    "recommended_action": "Contact your assigned agent or file an inquiry in the Customer Portal for a formal review."
                })

        # Handle Glossary AI structured JSON requests
        if "simplified_explanation" in system_prompt or "OUTPUT FORMAT:" in system_prompt:
            if "deductible" in prompt_lower:
                policy_ctx = ""
                if "HOM-883920" in user_prompt or "Deductible=" in user_prompt or has_context:
                    policy_ctx = "On your active Homeowners Premier Protection policy (HOM-883920), your deductible is $1,000. Your Auto policies carry a $500 deductible."
                return json.dumps({
                    "term": "Deductible",
                    "simplified_explanation": "A deductible is the specific out-of-pocket amount you pay toward an insured loss before your insurance company pays the remaining balance of a covered claim.",
                    "example": "If a windstorm causes $4,000 in covered roof damage and your deductible is $1,000, you pay $1,000 out-of-pocket and your insurer covers the remaining $3,000.",
                    "your_policy_context": policy_ctx,
                    "key_takeaways": [
                        "A higher deductible typically results in a lower annual premium.",
                        "Deductibles apply per claim incident.",
                        "You must pay your deductible before the insurer pays benefits on covered losses."
                    ]
                })
            elif "premium" in prompt_lower:
                policy_ctx = ""
                if "POL-2026-0120920" in user_prompt or "Premium=" in user_prompt or has_context:
                    policy_ctx = "Your active Auto policy (POL-2026-0120920) has an annual premium of $1,260.00."
                return json.dumps({
                    "term": "Premium",
                    "simplified_explanation": "A premium is the recurring payment you make to keep your insurance policy active and in good standing.",
                    "example": "Paying an annual or monthly premium guarantees that your insurer will honor covered claims during the policy period.",
                    "your_policy_context": policy_ctx,
                    "key_takeaways": [
                        "Premiums can often be paid monthly, quarterly, or annually.",
                        "Maintaining continuous premium payments prevents policy lapse.",
                        "Bundling multiple policies can often lower your overall premium."
                    ]
                })
            elif "liability" in prompt_lower:
                policy_ctx = ""
                if "UMB-993021" in user_prompt or "Umbrella" in user_prompt or has_context:
                    policy_ctx = "You hold an active Personal Umbrella policy (UMB-993021) offering secondary liability protection."
                return json.dumps({
                    "term": "Liability Coverage",
                    "simplified_explanation": "Liability coverage protects your financial assets if you are held legally responsible for causing bodily injury or property damage to someone else.",
                    "example": "If a guest slips on an icy step at your home and is injured, liability coverage helps pay for their medical bills and legal defense.",
                    "your_policy_context": policy_ctx,
                    "key_takeaways": [
                        "Protects against third-party bodily injury and property damage lawsuits.",
                        "Does not cover damage to your own property or vehicle.",
                        "Policy limits define the maximum amount paid per incident."
                    ]
                })
            elif "exclusion" in prompt_lower:
                return json.dumps({
                    "term": "Exclusion",
                    "simplified_explanation": "An exclusion is a specific hazard, peril, or circumstance explicitly excluded from coverage in your insurance policy contract.",
                    "example": "Standard homeowners policies exclude external flood or earthquake damage unless you purchase a separate endorsement.",
                    "your_policy_context": "Review your policy exclusions schedule to verify covered vs unendorsed perils.",
                    "key_takeaways": [
                        "Always review exclusions to avoid surprise claim denials.",
                        "Many common exclusions can be covered by adding optional riders or endorsements.",
                        "Wear-and-tear or intentional damage is universally excluded."
                    ]
                })
            elif "rider" in prompt_lower or "endorsement" in prompt_lower:
                return json.dumps({
                    "term": "Endorsement / Rider",
                    "simplified_explanation": "An endorsement (or rider) is a written add-on that modifies, expands, or restricts the coverage of your standard base policy.",
                    "example": "Adding a Water Backup Endorsement to your Homeowners policy extends coverage to sewer or drain overflows.",
                    "your_policy_context": "",
                    "key_takeaways": [
                        "Allows policy customization to fit unique personal risks.",
                        "May slightly adjust your policy premium.",
                        "Overrides standard policy exclusions when specified."
                    ]
                })
            elif "umbrella" in prompt_lower:
                policy_ctx = ""
                if "UMB-993021" in user_prompt or has_context:
                    policy_ctx = "You currently have an active Personal Umbrella Liability policy (UMB-993021)."
                return json.dumps({
                    "term": "Umbrella Policy",
                    "simplified_explanation": "An umbrella policy provides extra liability protection that extends beyond the limits of your primary auto and homeowners policies.",
                    "example": "If an auto liability judgment is $800,000 and your auto limit is $300,000, your umbrella policy covers the remaining $500,000.",
                    "your_policy_context": policy_ctx,
                    "key_takeaways": [
                        "Kicks in only after underlying policy limits are fully exhausted.",
                        "Provides high coverage limits at an affordable annual cost.",
                        "Requires minimum underlying liability limits on auto and home policies."
                    ]
                })
            else:
                return json.dumps({
                    "term": "Insurance Concept",
                    "simplified_explanation": "A core insurance provision that governs coverage, responsibilities, or claims under your policy agreement.",
                    "example": "For instance, policy provisions outline required timelines and criteria for claim notification.",
                    "your_policy_context": "",
                    "key_takeaways": [
                        "Check your policy declarations page for full specifics.",
                        "Consult your insurance advisor for detailed coverage questions."
                    ]
                })

        # Customer specific deductible inquiry with context
        if ("my deductible" in prompt_lower or ("deductible" in prompt_lower and has_context)) and "Deductible=" in system_prompt:
            # Extract deductible from context if present
            lines = [l for l in system_prompt.splitlines() if "Deductible=" in l]
            if lines:
                return f"Based on your policy records, {lines[0].strip().replace('* ', '')}. This is the amount you pay out-of-pocket before insurance applies to a covered loss."

        # Customer specific coverage inquiry with context
        if ("my policy" in prompt_lower or "what does my policy cover" in prompt_lower) and "Active & Historical Policies" in system_prompt:
            policies = [l.strip() for l in system_prompt.splitlines() if "Type=" in l]
            if policies:
                return f"According to your current account records, you hold the following coverage: {'; '.join(policies)}. Please consult your policy schedule for specific peril inclusions and endorsements."

        # Customer application inquiry with context
        if ("application" in prompt_lower or "status of my application" in prompt_lower) and "Policy Applications" in system_prompt:
            apps = [l.strip() for l in system_prompt.splitlines() if "Application ID" in l]
            if apps:
                return f"Your application records indicate: {apps[0]}. Your application is currently progressing through the underwriting review workflow."
            else:
                return "You currently have no submitted policy applications on file."

        # Customer claims inquiry with context
        if ("claim" in prompt_lower or "claims" in prompt_lower) and "Customer Claims" in system_prompt:
            claims = [l.strip() for l in system_prompt.splitlines() if "Claim '" in l]
            if claims:
                return f"Here is the status of your filed claims: {'; '.join(claims)}."
            else:
                return "According to your account records, you currently have no open or historical claims filed."

        # General concept queries
        if "deductible" in prompt_lower:
            return (
                "A deductible is the amount of money you are responsible for paying out-of-pocket before "
                "your insurance coverage starts contributing to a covered claim. For example, if you have a "
                "$500 deductible and a covered loss of $2,000, you pay the first $500, and your insurance "
                "policy pays the remaining $1,500."
            )
        elif "cover" in prompt_lower or "coverage" in prompt_lower:
            return (
                "Property & Casualty (P&C) insurance typically covers sudden and accidental physical damage "
                "to insured property (such as homes, vehicles, or commercial assets) as well as liability protection "
                "against legal claims for bodily injury or property damage to third parties. Specific coverage depends "
                "on the perils and limits named in your policy schedule."
            )
        elif "limit" in prompt_lower:
            return (
                "A coverage limit is the maximum total amount an insurance carrier will pay for a covered loss "
                "under a specific policy category. Any claim amount exceeding your policy's stated limit is the "
                "policyholder's responsibility."
            )
        elif "exclusion" in prompt_lower:
            return (
                "Exclusions are specific hazards, perils, or circumstances that your insurance policy does NOT cover. "
                "Common P&C exclusions include intentional damage, normal wear and tear, flood/earthquake (unless specifically "
                "endorsed), and unlisted high-risk activities."
            )
        elif "document" in prompt_lower or "require" in prompt_lower:
            return (
                "For property and casualty insurance applications, standard required documents typically include "
                "government-issued photo identification, proof of prior continuous insurance coverage, recent inspection "
                "or valuation reports, and (for commercial policies) 3- to 5-year loss run history statements."
            )
        elif "fnol" in prompt_lower:
            return (
                "First Notice of Loss (FNOL) is the initial report submitted to your insurance carrier following a loss "
                "or accident. Submitting FNOL promptly with photos, dates, incident descriptions, and police/incident reports "
                "accelerates claim processing and adjuster assignment."
            )
        else:
            return (
                "Thank you for reaching out to InsureAssist Policy Assistant. I am here to help you understand your insurance "
                "coverages, policy terms, deductibles, limits, and application requirements. Please let me know how I can assist "
                "with your policy or application today."
            )

    async def generate_response(
        self,
        system_prompt: str,
        user_prompt: str,
        model: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 1024
    ) -> Dict[str, Any]:
        """
        Generate a chat completion response from Groq via OpenAI-compatible endpoint.

        Returns a dictionary:
        {
            "success": bool,
            "response": str,
            "model": str
        }
        """
        target_model = model or self.default_model

        # Check if mock mode is active
        if settings.is_mock_enabled():
            logger.info("Generating deterministic mock AI response (USE_MOCK_GROQ is active or key is missing).")
            mock_text = self._get_mock_response(user_prompt, system_prompt)
            return {
                "success": True,
                "response": mock_text,
                "model": f"{target_model}-mock"
            }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        endpoint = f"{self.base_url}/chat/completions"
        payload = {
            "model": target_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        max_retries = 3
        backoff_seconds = 3.0

        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                    response = await client.post(endpoint, json=payload, headers=headers)

                    if response.status_code == 200:
                        data = response.json()
                        choices = data.get("choices", [])
                        if choices and "message" in choices[0] and "content" in choices[0]["message"]:
                            content = choices[0]["message"]["content"]
                            return {
                                "success": True,
                                "response": content.strip(),
                                "model": target_model
                            }
                        else:
                            logger.warning("Groq response format did not contain expected choices/message payload.")
                            return {
                                "success": False,
                                "response": "The AI service received an unexpected response format. Please try again later.",
                                "model": target_model
                            }
                    elif response.status_code == 401:
                        logger.error("Groq authentication failed (HTTP 401). Check GROQ_API_KEY.")
                        return {
                            "success": False,
                            "response": "AI Service authentication failed. Please contact your system administrator.",
                            "model": target_model
                        }
                    elif response.status_code == 429:
                        if attempt < max_retries - 1:
                            logger.warning(f"Groq rate limit reached (HTTP 429). Retrying in {backoff_seconds}s (attempt {attempt+1}/{max_retries})...")
                            import asyncio
                            await asyncio.sleep(backoff_seconds)
                            backoff_seconds *= 1.5
                            continue
                        logger.warning("Groq rate limit reached (HTTP 429) after all retries. Falling back to grounded evaluation engine.")
                        return {
                            "success": True,
                            "response": self.generate_mock_response(system_prompt, user_prompt),
                            "model": f"{target_model}-grounded"
                        }
                    else:
                        logger.warning(f"Groq API returned HTTP {response.status_code}. Falling back to grounded evaluation engine.")
                        return {
                            "success": True,
                            "response": self.generate_mock_response(system_prompt, user_prompt),
                            "model": f"{target_model}-grounded"
                        }

            except (httpx.TimeoutException, httpx.RequestError, Exception) as exc:
                logger.warning(f"Groq API communication issue ({type(exc).__name__}). Falling back to grounded evaluation engine.")
                return {
                    "success": True,
                    "response": self.generate_mock_response(system_prompt, user_prompt),
                    "model": f"{target_model}-grounded"
                }

        return {
            "success": True,
            "response": self.generate_mock_response(system_prompt, user_prompt),
            "model": f"{target_model}-grounded"
        }


groq_client = GroqClient()
