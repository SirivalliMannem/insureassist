from enum import Enum
from typing import Optional
from pydantic import BaseModel


class UserRole(str, Enum):
    """
    Supported enterprise user roles in InsureAssist.
    """
    CUSTOMER = "customer"
    AGENT = "agent"
    UNDERWRITER = "underwriter"
    ADMIN = "admin"
    QA = "qa"


def parse_user_role(role_val: str) -> UserRole:
    """
    Safely normalize and parse role string to UserRole enum.
    """
    if not role_val:
        return UserRole.CUSTOMER
    normalized = str(role_val).strip().lower()
    for role in UserRole:
        if role.value == normalized:
            return role
    return UserRole.CUSTOMER


class UserInDB(BaseModel):
    """
    Internal user model stored in the database / mock store.
    """
    id: str
    name: str
    email: str
    hashed_password: str
    role: UserRole
    is_active: bool = True
    phone: Optional[str] = None
    title: Optional[str] = None
