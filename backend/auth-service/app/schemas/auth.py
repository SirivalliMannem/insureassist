from typing import Optional
from pydantic import BaseModel, Field
from app.models.user import UserRole


class LoginRequest(BaseModel):
    """
    Request payload for user authentication.
    Accepts email along with password and optional requested role.
    """
    email: str = Field(..., description="User email address", examples=["sarah.mitchell@email.com"])
    password: str = Field(..., description="User plain text password", examples=["Test@123"])
    role: Optional[str] = Field(None, description="Optional expected role for validation", examples=["customer"])


class UserInfo(BaseModel):
    """
    Sanitized user details returned upon successful authentication.
    """
    id: str
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    title: Optional[str] = None


class LoginResponse(BaseModel):
    """
    Authentication response returning the JWT bearer token and user metadata.
    """
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # In seconds
    user: UserInfo
    role: str


class TokenPayload(BaseModel):
    """
    Decoded JWT token payload claims.
    """
    sub: str  # User ID
    email: str
    name: str
    role: str
    exp: int


class HealthResponse(BaseModel):
    """
    Standard microservice health check response.
    """
    status: str = "ok"
    service: str = "auth-service"
    version: str = "1.0.0"
