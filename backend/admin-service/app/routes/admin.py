import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.auth import get_current_admin
from app.services.admin_service import AdminService
from app.schemas.admin import UserCreateRequest, PasswordResetRequest, ConfirmAccessRequest

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/stats", summary="Fetch Admin Dashboard Stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    """
    Returns real statistics for the Admin dashboard KPI cards and system overview.
    """
    try:
        return AdminService.get_stats(db)
    except Exception as e:
        logger.error(f"Error fetching admin stats: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch admin stats: {str(e)}"
        )


@router.get("/users", summary="List All Users")
def get_admin_users(
    role: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    """
    Returns real user accounts from the database.
    """
    try:
        return AdminService.get_users(db, role, search, limit, offset)
    except Exception as e:
        logger.error(f"Error fetching admin users: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch admin users: {str(e)}"
        )


@router.post("/users", summary="Create User Account")
def create_admin_user(
    req: UserCreateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    """
    Creates a new user record directly in the PostgreSQL database.
    """
    try:
        res = AdminService.create_user(req.dict(), db)
        if not res.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=res.get("message", "Failed to create user")
            )
        return res
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating user: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )


@router.get("/policies", summary="Browse All Policies (Admin)")
def get_admin_policies(
    status_filter: Optional[str] = Query(None, alias="status"),
    policy_type: Optional[str] = Query(None, alias="type"),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    """
    Returns real policies from the database for admin overview.
    """
    try:
        return AdminService.get_policies(db, status_filter, policy_type, search, limit, offset)
    except Exception as e:
        logger.error(f"Error fetching admin policies: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch admin policies: {str(e)}"
        )


@router.get("/audit", summary="Fetch Audit / Activity Logs")
def get_admin_audit(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    """
    Returns system audit logs / activity history from real events.
    """
    try:
        return AdminService.get_audit_logs(db, limit, offset)
    except Exception as e:
        logger.error(f"Error fetching admin audit logs: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch audit logs: {str(e)}"
        )


@router.post("/users/password-reset", summary="Send Password Reset to User")
def reset_user_password(
    req: PasswordResetRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    """
    Dispatches a real password reset link/token to the user and logs the administrative audit event.
    """
    try:
        res = AdminService.reset_user_password(req.dict(), db)
        if not res.get("success"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=res.get("message", "User not found")
            )
        return res
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending password reset: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to dispatch password reset: {str(e)}"
        )


@router.post("/users/confirm-access", summary="Confirm User RBAC Access")
def confirm_user_access(
    req: ConfirmAccessRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    """
    Confirms and verifies the user's role-based access control (RBAC) permissions.
    """
    try:
        res = AdminService.confirm_user_access(req.dict(), db)
        if not res.get("success"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=res.get("message", "User not found")
            )
        return res
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error confirming user access: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to confirm user access: {str(e)}"
        )

