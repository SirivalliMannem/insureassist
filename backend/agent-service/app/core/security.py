import logging
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.agent import User

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


def get_current_agent_user(
    payload: dict = Depends(get_token_payload),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency that extracts Agent identity from JWT, verifies the Agent role,
    and queries PostgreSQL for the Agent's user record in the 'users' table.
    Rejects missing/invalid tokens with 401, and non-Agent users with 403.
    """
    # 1. Verify Role
    role = (payload.get("role") or "").strip().lower()
    allowed_agent_roles = ["agent", "broker", "agent/broker"]
    if role not in allowed_agent_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access forbidden: User role '{payload.get('role')}' is not authorized for Agent Service operations."
        )

    user_id = payload.get("sub")
    email = payload.get("email")

    if not user_id and not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing user identity claims."
        )

    # 2. Query Agent User from PostgreSQL 'users' table
    agent_user = None

    if user_id:
        agent_user = db.query(User).filter(User.user_id == str(user_id)).first()

    if not agent_user and email:
        agent_user = db.query(User).filter(User.email.ilike(email.strip())).first()

    if not agent_user:
        logger.warning(f"Agent user record not found in PostgreSQL for user_id={user_id}, email={email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent user record not found in database."
        )

    return agent_user
