import logging
import datetime
import httpx
import jwt
from typing import Optional, List, Dict, Any

from app.config import settings

logger = logging.getLogger("ai_service.clients.customer")


class CustomerServiceClient:
    """
    HTTP Client for communicating with the InsureAssist Customer Microservice (:8002).
    """

    def __init__(
        self,
        base_url: Optional[str] = None,
        timeout_seconds: float = 6.0
    ):
        self.base_url = (base_url or settings.CUSTOMER_SERVICE_URL).rstrip("/")
        self.timeout_seconds = timeout_seconds

    @staticmethod
    def create_service_token(customer_id: str, email: Optional[str] = None) -> str:
        """
        Generate an authenticated internal service-to-service JWT for Customer Service.
        """
        now = datetime.datetime.now(datetime.timezone.utc)
        payload = {
            "sub": customer_id,
            "role": "Customer",
            "email": email or (f"{customer_id.lower()}@insureassist.com" if "@" not in customer_id else customer_id),
            "iat": int(now.timestamp()),
            "exp": int((now + datetime.timedelta(hours=2)).timestamp())
        }
        return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    async def _get(self, path: str, auth_token: str) -> Optional[Any]:
        """
        Internal helper to execute GET requests against Customer Service.
        """
        clean_token = auth_token.replace("Bearer ", "").strip()
        headers = {
            "Authorization": f"Bearer {clean_token}",
            "Accept": "application/json"
        }
        url = f"{self.base_url}{path}"

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                res = await client.get(url, headers=headers)
                if res.status_code == 200:
                    return res.json()
                elif res.status_code == 404:
                    logger.info(f"Customer Service returned 404 for {path}")
                    return None
                else:
                    logger.warning(f"Customer Service GET {path} returned HTTP {res.status_code}")
                    return None
        except httpx.TimeoutException:
            logger.error(f"Timeout connecting to Customer Service at {url}")
            return None
        except httpx.RequestError as exc:
            logger.error(f"Network error connecting to Customer Service: {type(exc).__name__}")
            return None
        except Exception as exc:
            logger.error(f"Unexpected error querying Customer Service: {type(exc).__name__}")
            return None

    async def get_profile(self, auth_token: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve customer profile information from Customer Service.
        """
        return await self._get("/customer/profile", auth_token)

    async def get_policies(self, auth_token: str) -> List[Dict[str, Any]]:
        """
        Retrieve customer active and historical policies from Customer Service.
        """
        result = await self._get("/customer/policies", auth_token)
        return result if isinstance(result, list) else []

    async def get_claims(self, auth_token: str) -> List[Dict[str, Any]]:
        """
        Retrieve customer claims from Customer Service.
        """
        result = await self._get("/customer/claims", auth_token)
        return result if isinstance(result, list) else []

    async def get_applications(self, auth_token: str) -> List[Dict[str, Any]]:
        """
        Retrieve customer policy applications from Customer Service.
        """
        result = await self._get("/customer/applications", auth_token)
        return result if isinstance(result, list) else []

    async def get_application_detail(self, application_id: str, auth_token: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve specific application details from Customer Service.
        """
        return await self._get(f"/customer/applications/{application_id}", auth_token)


customer_service_client = CustomerServiceClient()
