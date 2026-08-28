from fastapi import APIRouter
from app.models.risk import NavigationRiskSummary
from app.models.vessel import Vessel
from app.services.risk_engine import risk_engine
from app.services.scenario_manager import scenario_manager

router = APIRouter(prefix="/risk", tags=["Navigation Risk"])

@router.get("", response_model=NavigationRiskSummary)
def get_current_risk():
    """Retrieve comprehensive collision risk evaluation for active vessel."""
    return risk_engine.evaluate_vessel_risk(scenario_manager.vessel)

@router.post("/evaluate", response_model=NavigationRiskSummary)
def evaluate_custom_vessel(vessel: Vessel):
    """Evaluate CPA/TCPA collision risk for a custom vessel profile."""
    return risk_engine.evaluate_vessel_risk(vessel)
