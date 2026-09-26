import logging
from typing import Optional, Dict, Any
import jwt
from fastapi import Depends, HTTPException, status, Request, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.notification import User, Customer

logger = logging.getLogger("notification-service.auth")
security = HTTPBearer(auto_error=False)


def decode_token(token: str) -> dict:
    """
    Decodes and validates a JWT token string.
    """
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


async def get_current_user_context(
    payload: dict = Depends(get_token_payload),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Resolves comprehensive user context from the verified JWT token and database.
    Provides user_id, customer_id (if customer), email, role, and name.
    Strictly enforces identity ownership.
    """
    user_id = payload.get("sub")
    email = payload.get("email")
    role = (payload.get("role") or "").strip()
    name = payload.get("name") or "User"

    if not user_id and not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing user identity claims."
        )

    # Query User from database
    user = None
    if user_id:
        user = db.query(User).filter(User.user_id == str(user_id)).first()
    if not user and email:
        user = db.query(User).filter(User.email.ilike(email.strip())).first()

    customer_id = None
    # If Customer role or customer profile exists, find customer_id
    if user:
        actual_user_id = user.user_id
        actual_email = user.email
        actual_role = user.role
        actual_name = user.name
    else:
        actual_user_id = str(user_id) if user_id else ""
        actual_email = str(email) if email else ""
        actual_role = role
        actual_name = name

    # Lookup customer ID if applicable
    cust = None
    if actual_user_id:
        cust = db.query(Customer).filter(Customer.user_id == actual_user_id).first()
        if not cust:
            cust = db.query(Customer).filter(Customer.customer_id == actual_user_id).first()
    if not cust and actual_email:
        cust = db.query(Customer).filter(Customer.email.ilike(actual_email.strip())).first()

    if cust:
        customer_id = cust.customer_id

    return {
        "user_id": actual_user_id,
        "customer_id": customer_id,
        "email": actual_email,
        "role": actual_role,
        "name": actual_name,
        "raw_payload": payload
    }


def verify_service_or_user_auth(
    request: Request,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Authenticates service-to-service creation calls via internal service key or valid JWT.
    """
    # 1. Check internal service key header
    internal_key = (
        request.headers.get("X-Internal-Service-Key")
        or request.headers.get("x-internal-service-key")
        or request.headers.get("X-Internal-Service")
        or request.headers.get("x-internal-service")
    )
    if internal_key and internal_key == settings.INTERNAL_SERVICE_KEY:
        return {"auth_type": "internal_service", "service": "insureassist-backend"}

    # 2. Check JWT Bearer token
    auth_header = request.headers.get("Authorization") or request.headers.get("authorization")
    if auth_header:
        token = auth_header.strip()
        payload = decode_token(token)
        return {"auth_type": "jwt", "payload": payload}

    # If neither is provided, raise 401
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Missing internal service credentials or authorization token."
    )
