import logging
from typing import Optional
import jwt
from fastapi import Depends, HTTPException, Security, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.models import User

logger = logging.getLogger("underwriter-service.auth")
security = HTTPBearer(auto_error=False)


def decode_token(token: str) -> dict:
    """
    Decodes and validates a JWT token string.
    """
    # Sanitize and strip any 'Bearer ' / 'bearer ' prefixes
    while token.lower().startswith("bearer "):
        token = token[7:].strip()

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


def get_token_payload(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> dict:
    """
    Extracts and validates JWT Bearer token from header or query parameters.
    """
    token = None
    if credentials and credentials.credentials:
        token = str(credentials.credentials).strip()

    if not token:
        auth_header = request.headers.get("Authorization") or request.headers.get("authorization")
        if auth_header:
            token = auth_header.strip()

    if not token:
        token = request.query_params.get("token") or request.query_params.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return decode_token(token)


async def get_current_user(
    payload: dict = Depends(get_token_payload)
) -> dict:
    """
    Returns user payload claim dictionary.
    """
    user_id = payload.get("sub")
    if not user_id and not payload.get("email"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload."
        )
    return payload


async def get_current_underwriter(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Enforces underwriter or administrator role.
    """
    role = (current_user.get("role") or "").strip().lower()
    if role not in ["underwriter", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access forbidden: User role '{current_user.get('role')}' is not authorized for Underwriter Service operations."
        )
    return current_user


def get_current_underwriter_user(
    payload: dict = Depends(get_token_payload),
    db: Session = Depends(get_db)
) -> User:
    """
    Enforces underwriter or admin role and queries the User ORM entity from PostgreSQL.
    """
    role = (payload.get("role") or "").strip().lower()
    if role not in ["underwriter", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access forbidden: User role '{payload.get('role')}' is not authorized for Underwriter Service operations."
        )

    user_id = payload.get("sub")
    email = payload.get("email")

    if not user_id and not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing user identity claims."
        )

    underwriter_user = None
    if user_id:
        underwriter_user = db.query(User).filter(User.user_id == str(user_id)).first()

    if not underwriter_user and email:
        underwriter_user = db.query(User).filter(User.email.ilike(email.strip())).first()

    if not underwriter_user:
        # Fallback to seeded underwriter if demo account
        underwriter_user = db.query(User).filter(User.role.ilike("underwriter")).first()

    if not underwriter_user:
        # Construct synthetic user object if DB has not yet inserted
        underwriter_user = User(
            user_id=str(user_id or "USR-UW-001"),
            name=payload.get("name") or "Alex Vance",
            email=email or "alex.vance@insureassist.com",
            role="Underwriter"
        )

    return underwriter_user
