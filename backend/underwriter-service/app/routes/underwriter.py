import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.auth import get_current_underwriter
from app.services.underwriter_service import UnderwriterService
from app.schemas.underwriter import DecisionRequest

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/underwriter",
    tags=["Underwriter"]
)


@router.get("/queue", summary="Fetch Underwriting Review Queue")
def get_underwriter_queue(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_underwriter)
):
    """
    Returns pending renewals, pending policies, and near-expiry active policies requiring underwriting review.
    """
    try:
        items = UnderwriterService.get_queue(db)
        return items
    except Exception as e:
        logger.error(f"Error fetching underwriter queue: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch underwriter queue: {str(e)}"
        )


@router.get("/stats", summary="Fetch Underwriter Dashboard Stats")
def get_underwriter_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_underwriter)
):
    """
    Returns real statistics for underwriter dashboard KPI cards and analytics.
    """
    try:
        stats = UnderwriterService.get_stats(db)
        return stats
    except Exception as e:
        logger.error(f"Error fetching underwriter stats: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch underwriter stats: {str(e)}"
        )


@router.post("/decision", summary="Submit Underwriting Decision")
def submit_underwriting_decision(
    req: DecisionRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_underwriter)
):
    """
    Records an underwriting decision (Approved, Rejected, Needs More Information)
    and updates the policy or renewal request in the database.
    """
    try:
        res = UnderwriterService.make_decision(req.item_id, req.decision, req.notes, db)
        if not res.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=res.get("message", "Failed to submit decision")
            )
        return res
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting underwriter decision: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit underwriting decision: {str(e)}"
        )


@router.get("/policies", summary="Browse Policy Catalog (Underwriter)")
def get_underwriter_policies(
    status_filter: Optional[str] = Query(None, alias="status"),
    policy_type: Optional[str] = Query(None, alias="type"),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_underwriter)
):
    """
    Returns real policies from the database for underwriter reference.
    """
    try:
        return UnderwriterService.get_policies(db, status_filter, policy_type, search, limit, offset)
    except Exception as e:
        logger.error(f"Error fetching underwriter policies: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch policies: {str(e)}"
        )
