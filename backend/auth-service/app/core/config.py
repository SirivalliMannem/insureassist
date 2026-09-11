import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or .env file.
    """
    APP_NAME: str = "InsureAssist Auth Service"
    APP_ENV: str = "development"
    PORT: int = 8001
    HOST: str = "0.0.0.0"

    # JWT Authentication
    JWT_SECRET_KEY: str = "insureassist-super-secret-jwt-key-for-development-mode"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Database Configuration
    DATABASE_URL: str = "postgresql://insureassist:Test%40123@localhost:5435/insureassist"

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8080,http://127.0.0.1:5500,http://localhost:5500,*"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
