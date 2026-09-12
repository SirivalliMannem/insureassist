import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Agent Service configuration settings loaded from environment variables or .env file.
    """
    APP_NAME: str = "InsureAssist Agent Service"
    APP_ENV: str = "development"
    PORT: int = 8003
    HOST: str = "0.0.0.0"

    # JWT Security Configuration
    JWT_SECRET_KEY: str = "insureassist-super-secret-jwt-key-for-development-mode"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Database Connection URL
    DATABASE_URL: str = "postgresql://insureassist:Test%40123@localhost:5435/insureassist"

    # CORS Allowed Origins
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8080,http://127.0.0.1:5500,http://localhost:5500,http://127.0.0.1:3000,*"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = [".env", "../.env", "../../.env"]
        extra = "allow"


settings = Settings()
