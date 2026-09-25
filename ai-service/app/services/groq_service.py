import logging
import httpx
from typing import Optional, List, Dict, Any

from app.config import settings

logger = logging.getLogger("ai_service.groq")


class GroqClient:
    """
    Reusable OpenAI-compatible client for Groq LLM API.
    Supports asynchronous chat completion requests.
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

        if not self.api_key:
            logger.error("GROQ_API_KEY is not configured.")
            return {
                "success": False,
                "response": "I’m unable to retrieve that information right now. Please try again.",
                "model": target_model
            }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "InsureAssist-AI/1.0"
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
                                "response": "I’m unable to retrieve that information right now. Please try again.",
                                "model": target_model
                            }
                    elif response.status_code == 401:
                        logger.error("Groq authentication failed (HTTP 401). Check GROQ_API_KEY.")
                        return {
                            "success": False,
                            "response": "I’m unable to retrieve that information right now. Please try again.",
                            "model": target_model
                        }
                    elif response.status_code == 429:
                        retry_after = response.headers.get("retry-after") or "N/A"
                        rl_reset = response.headers.get("x-ratelimit-reset-tokens") or "N/A"
                        rl_remaining = response.headers.get("x-ratelimit-remaining-tokens") or "N/A"
                        rl_limit = response.headers.get("x-ratelimit-limit-tokens") or "N/A"

                        logger.warning(
                            f"Groq 429\n"
                            f"Retry-After: {retry_after}\n"
                            f"Token reset: {rl_reset}\n"
                            f"Remaining tokens: {rl_remaining}\n"
                            f"Limit tokens: {rl_limit}"
                        )
                        if attempt < max_retries - 1:
                            logger.warning(f"Retrying in {backoff_seconds}s (attempt {attempt+1}/{max_retries})...")
                            import asyncio
                            await asyncio.sleep(backoff_seconds)
                            backoff_seconds *= 2.0
                            continue
                        logger.warning("Groq rate limit reached (HTTP 429) after all retries.")
                        return {
                            "success": False,
                            "response": "I’m unable to retrieve that information right now. Please try again.",
                            "model": target_model
                        }
                    else:
                        logger.warning(f"Groq API returned HTTP {response.status_code}.")
                        return {
                            "success": False,
                            "response": "I’m unable to retrieve that information right now. Please try again.",
                            "model": target_model
                        }

            except (httpx.TimeoutException, httpx.RequestError, Exception) as exc:
                if attempt < max_retries - 1:
                    logger.warning(f"Groq communication error ({type(exc).__name__}). Retrying in {backoff_seconds}s...")
                    import asyncio
                    await asyncio.sleep(backoff_seconds)
                    backoff_seconds *= 2.0
                    continue
                logger.error(f"Groq API communication issue ({type(exc).__name__}): {exc}")
                return {
                    "success": False,
                    "response": "I’m unable to retrieve that information right now. Please try again.",
                    "model": target_model
                }

        return {
            "success": False,
            "response": "I’m unable to retrieve that information right now. Please try again.",
            "model": target_model
        }


groq_client = GroqClient()
