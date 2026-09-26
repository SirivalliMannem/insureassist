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
    ADJUSTER = "adjuster"
    QA = "qa"


def parse_user_role(role_val: str) -> str:
    """
    Safely normalize and parse role string to UserRole value or preserve custom role.
    """
    if not role_val:
        return UserRole.CUSTOMER.value
    normalized = str(role_val).strip().lower()
    for role in UserRole:
        if role.value == normalized:
            return role.value
    return str(role_val).strip()


class UserInDB(BaseModel):
    """
    Internal user model stored in the database / mock store.
    """
    id: str
    name: str
    email: str
    hashed_password: str
    role: str
    is_active: bool = True
    phone: Optional[str] = None
    title: Optional[str] = None
