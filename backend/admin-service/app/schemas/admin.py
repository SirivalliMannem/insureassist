from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class UserCreateRequest(BaseModel):
    name: str = Field(..., description="User full name")
    email: str = Field(..., description="User email address")
    role: str = Field(..., description="User role (Customer, Agent, Underwriter, Admin)")
    mobile: Optional[str] = Field(default="", description="Mobile number for customer")
    address: Optional[str] = Field(default="", description="Address for customer")
    password: Optional[str] = Field(default="Welcome123!", description="Initial password")


class PasswordResetRequest(BaseModel):
    user_id: str = Field(..., description="User ID")
    email: Optional[str] = Field(default="", description="User Email")
    role: Optional[str] = Field(default=None, description="User Role")


class ConfirmAccessRequest(BaseModel):
    user_id: str = Field(..., description="User ID")
    role: Optional[str] = Field(default="", description="User Role")


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    port: int
