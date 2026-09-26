from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.auth import get_current_adjuster
from app.services.adjuster_service import AdjusterService
from app.schemas.adjuster import (
    AdjusterStatsResponse,
    AdjusterClaimSummary,
    AdjusterClaimDetail,
    AdjusterDecisionRequest,
    AdjusterDecisionResponse
)

router = APIRouter(
    prefix="/adjuster",
    tags=["Adjuster Claims Management"]
)


@router.get(
    "/stats",
    response_model=AdjusterStatsResponse,
    summary="Get Adjuster Dashboard Summary Stats",
    description="Returns aggregate claim counts for Total Claims, Pending Review, More Information, and Resolved Claims in the shared queue."
)
async def get_adjuster_stats(
    current_adjuster: Dict[str, Any] = Depends(get_current_adjuster),
    db: Session = Depends(get_db)
):
    return AdjusterService.get_adjuster_stats(db=db)


@router.get(
    "/claims",
    response_model=List[AdjusterClaimSummary],
    summary="Get Claims Queue",
    description="Returns all claims in the shared Adjuster queue with support for searching across Claim ID, Customer name, Policy number, Claim type, and status filtering."
)
async def get_claims_queue(
    search: Optional[str] = Query(None, description="Search term for claim number, customer, policy, or claim type"),
    status: Optional[str] = Query(None, description="Filter by status (e.g., 'Pending Review', 'More Information Required', 'Approved', 'Rejected', 'All')"),
    current_adjuster: Dict[str, Any] = Depends(get_current_adjuster),
    db: Session = Depends(get_db)
):
    return AdjusterService.get_claims_queue(db=db, search=search, status_filter=status)


@router.get(
    "/claims/{claim_id}",
    response_model=AdjusterClaimDetail,
    summary="Get Detailed Claim Assessment Data",
    description="Returns comprehensive claim assessment view with full claim information, real customer profile, real policy coverages and exclusions, and document records."
)
async def get_claim_detail(
    claim_id: str,
    current_adjuster: Dict[str, Any] = Depends(get_current_adjuster),
    db: Session = Depends(get_db)
):
    return AdjusterService.get_claim_detail(claim_id=claim_id, db=db)


@router.post(
    "/claims/{claim_id}/decision",
    response_model=AdjusterDecisionResponse,
    summary="Submit Adjuster Claim Decision",
    description="Processes final decision (Approved, Rejected, or More Information Required), updates database record, and dispatches in-app notifications to Customer and Agent."
)
async def submit_claim_decision(
    claim_id: str,
    payload: AdjusterDecisionRequest,
    current_adjuster: Dict[str, Any] = Depends(get_current_adjuster),
    db: Session = Depends(get_db)
):
    return AdjusterService.process_claim_decision(
        claim_id=claim_id,
        payload=payload,
        adjuster_user=current_adjuster,
        db=db
    )
