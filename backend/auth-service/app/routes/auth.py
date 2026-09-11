from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import Optional, List
from sqlalchemy.orm import Session
from app.schemas.auth import LoginRequest, LoginResponse, UserInfo
from app.services.auth_service import auth_service
from app.core.security import decode_access_token
from app.db.database import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Authenticate User and Generate JWT Token",
    description="Validates email and password against the user repository and generates a signed JWT token containing user identity and role claims."
)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user credentials and issue a JWT bearer token.
    """
    user = auth_service.authenticate_user(login_data, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return auth_service.generate_login_response(user)


@router.get(
    "/me",
    response_model=UserInfo,
    summary="Get Current Authenticated User",
    description="Validates the incoming JWT bearer token from the Authorization header and returns user metadata."
)
async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Extract and validate current user from Authorization: Bearer <token> header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header. Use 'Bearer <token>'.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired JWT token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = auth_service.get_user_by_id(payload["sub"], db=db)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found or deactivated.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return UserInfo(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        phone=user.phone,
        title=user.title
    )


@router.get(
    "/demo-users",
    response_model=List[UserInfo],
    summary="List Demo Accounts for Prototyping",
    description="Returns public details of available demo accounts across all 4 roles (default password: 'Test@123')."
)
async def get_demo_users():
    """
    Convenience endpoint to discover demo credentials for testing all 4 roles.
    """
    return [
        UserInfo(
            id=u.id,
            name=u.name,
            email=u.email,
            role=u.role,
            phone=u.phone,
            title=u.title
        )
        for u in auth_service._users_db.values()
    ]
