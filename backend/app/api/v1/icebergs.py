from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.models.iceberg import Iceberg, PredictedPoint
from app.services.iceberg_service import iceberg_service
from app.services.drift_engine import drift_engine

router = APIRouter(prefix="/icebergs", tags=["Icebergs"])

@router.get("", response_model=List[Iceberg])
def get_all_icebergs():
    """Retrieve all actively tracked Antarctic icebergs."""
    return iceberg_service.get_all_icebergs()

@router.get("/{iceberg_id}", response_model=Iceberg)
def get_iceberg_details(iceberg_id: str):
    """Retrieve detailed telemetry and trajectory prediction for a single iceberg."""
    iceberg = iceberg_service.get_iceberg_by_id(iceberg_id)
    if not iceberg:
        raise HTTPException(status_code=404, detail=f"Iceberg '{iceberg_id}' not found")
    return iceberg

@router.post("/{iceberg_id}/predict", response_model=Iceberg)
def trigger_iceberg_prediction(iceberg_id: str):
    """Re-run the physics-informed AI drift engine for an iceberg."""
    updated = iceberg_service.recalculate_predictions(iceberg_id)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Iceberg '{iceberg_id}' not found")
    return updated
