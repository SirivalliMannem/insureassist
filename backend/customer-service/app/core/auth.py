import logging
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.customer import Customer, User

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)


def get_token_payload(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Extracts and validates the JWT Bearer token from the request Authorization header.
    Returns the decoded token claims dictionary.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid JWT token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_customer(
    payload: dict = Depends(get_token_payload),
    db: Session = Depends(get_db)
) -> Customer:
    """
    Dependency that extracts customer identity from JWT, verifies the Customer role,
    and queries PostgreSQL for the customer's record.
    Strictly isolated: returns ONLY the record corresponding to the authenticated identity.
    """
    # 1. Verify Role
    role = payload.get("role", "")
    if role.strip().lower() != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access forbidden: User role '{role}' is not authorized for Customer Service."
        )

    user_id = payload.get("sub")
    email = payload.get("email")

    if not user_id and not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing user identity claims."
        )

    # 2. Query Customer from Database
    customer = None

    # Try matching user_id
    if user_id:
        customer = db.query(Customer).filter(Customer.user_id == user_id).first()
        if not customer:
            customer = db.query(Customer).filter(Customer.customer_id == user_id).first()

    # Fallback to email match
    if not customer and email:
        customer = db.query(Customer).filter(Customer.email.ilike(email.strip())).first()

    if not customer:
        logger.warning(f"Customer record not found for user_id={user_id}, email={email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer record not found in database for the authenticated user."
        )

    return customer


def get_current_agent_or_staff(
    payload: dict = Depends(get_token_payload)
) -> dict:
    """
    Dependency verifying that the caller has Agent, Underwriter, or Admin privileges.
    """
    role = (payload.get("role") or "").strip().lower()
    allowed_roles = ["agent", "broker", "agent/broker", "underwriter", "admin"]
    if role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access forbidden: User role '{payload.get('role')}' is not authorized for Agent/Staff operations."
        )
    return payload

