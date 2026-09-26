import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SERVICE_NAME: str = "notification-service"
    PORT: int = int(os.getenv("PORT", "8007"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1")

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://insureassist:Test%40123@postgres:5432/insureassist"
    )

    # JWT Settings (must match auth-service)
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "insureassist-super-secret-jwt-key-for-development-mode")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

    # Service-to-service internal authentication secret
    INTERNAL_SERVICE_KEY: str = os.getenv("INTERNAL_SERVICE_KEY", "insureassist-internal-service-secret-key-2026")

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "*",
    ]

    class Config:
        case_sensitive = True


settings = Settings()
