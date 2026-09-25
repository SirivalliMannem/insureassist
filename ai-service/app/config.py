import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    AI Service configuration settings loaded from environment variables or .env file.
    """
    APP_NAME: str = "InsureAssist AI Service"
    APP_ENV: str = "development"
    PORT: int = 8006
    HOST: str = "0.0.0.0"

    # LLM / Groq Configuration (OpenAI-compatible)
    GROQ_API_KEY: str = ""
    GROQ_API_URL: str = "https://api.groq.com/openai/v1"
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    USE_MOCK_GROQ: bool = False

    # Security & Authentication (Shared standard with other InsureAssist microservices)
    JWT_SECRET_KEY: str = "insureassist-super-secret-jwt-key-for-development-mode"
    JWT_ALGORITHM: str = "HS256"

    # Downstream Microservice URLs
    CUSTOMER_SERVICE_URL: str = "http://customer-service:8002"
    AUTH_SERVICE_URL: str = "http://auth-service:8001"

    # CORS Allowed Origins
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8080,http://127.0.0.1:5500,http://localhost:5500,http://127.0.0.1:3000,*"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    def is_mock_enabled(self) -> bool:
        """
        Returns True if explicitly configured for mock mode or if API key is not supplied.
        """
        return self.USE_MOCK_GROQ or not self.GROQ_API_KEY or self.GROQ_API_KEY.strip() == ""

    def __repr__(self) -> str:
        return f"Settings(APP_NAME='{self.APP_NAME}', GROQ_MODEL='{self.GROQ_MODEL}', USE_MOCK_GROQ={self.USE_MOCK_GROQ})"

    class Config:
        env_file = [".env", "../.env", "../../.env"]
        extra = "allow"


settings = Settings()
