from fastapi import APIRouter, HTTPException
from typing import List
from app.models.fleet import FleetVesselSummary, FleetStatusResponse
from app.services.fleet_service import fleet_service
from app.services.scenario_manager import scenario_manager

router = APIRouter(prefix="/fleet", tags=["Fleet Tracking"])

@router.get("", response_model=FleetStatusResponse)
def get_fleet_status():
    """Retrieve full polar fleet status with all active vessels."""
    return fleet_service.get_fleet_summary()

@router.get("/{vessel_id}", response_model=FleetVesselSummary)
def get_vessel_details(vessel_id: str):
    """Retrieve detailed telemetry for a single vessel."""
    v = fleet_service.get_vessel_by_id(vessel_id)
    if not v:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return v

@router.post("/{vessel_id}/select")
def select_active_vessel(vessel_id: str):
    """Select active vessel to navigate and monitor from fleet."""
    scenario_manager.select_vessel_from_fleet(vessel_id)
    return {"status": "success", "active_vessel_id": vessel_id}
