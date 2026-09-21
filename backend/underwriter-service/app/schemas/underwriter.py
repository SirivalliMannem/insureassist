from typing import Optional, List
from pydantic import BaseModel, Field


class DecisionRequest(BaseModel):
    item_id: str = Field(..., description="ID of the queue item or renewal request")
    decision: str = Field(..., description="Approved, Rejected, or Needs More Information")
    notes: Optional[str] = Field(default="", description="Underwriter notes or remarks")


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
