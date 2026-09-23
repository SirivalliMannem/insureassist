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

    def _get_mock_response(self, user_prompt: str, system_prompt: str) -> str:
        """
        Generate deterministic mock responses for testing and offline development.
        If real customer context is available in system_prompt, reference it accurately.
        """
        prompt_lower = user_prompt.lower()
        has_context = "REAL CUSTOMER SERVICE DATA:" in system_prompt or "CUSTOMER CONTEXT" in system_prompt

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
                            backoff_seconds *= 2.0
                            continue
                        logger.warning("Groq rate limit reached (HTTP 429) after all retries.")
                        return {
                            "success": False,
                            "response": "AI rate limit reached. Please wait a moment before sending another message.",
                            "model": target_model
                        }
                    else:
                        logger.error(f"Groq API returned HTTP {response.status_code}.")
                        return {
                            "success": False,
                            "response": "The AI assistant is temporarily unavailable. Please try again shortly.",
                            "model": target_model
                        }

            except httpx.TimeoutException:
                logger.error("Groq API request timed out.")
                return {
                    "success": False,
                    "response": "The AI service request timed out. Please try again.",
                    "model": target_model
                }
            except httpx.RequestError as exc:
                logger.error(f"Network error communicating with Groq API: {type(exc).__name__}")
                return {
                    "success": False,
                    "response": "Unable to connect to the AI provider. Please verify network connectivity.",
                    "model": target_model
                }
            except Exception as exc:
                logger.error(f"Unexpected error in Groq client: {type(exc).__name__}")
                return {
                    "success": False,
                    "response": "An unexpected error occurred while processing your request.",
                    "model": target_model
                }

        return {
            "success": False,
            "response": "AI assistant temporarily unavailable after retries.",
            "model": target_model
        }


groq_client = GroqClient()
