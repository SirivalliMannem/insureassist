import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "InsureAssist Underwriter Service"
    APP_ENV: str = "development"
    PORT: int = 8004
    HOST: str = "0.0.0.0"

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://insureassist:Test%40123@localhost:5435/insureassist"
    )

    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "insureassist-super-secret-jwt-key-for-development-mode"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:8080,http://127.0.0.1:5500,http://localhost:5500,http://127.0.0.1:3000,*"
    )

    class Config:
        case_sensitive = True


settings = Settings()
