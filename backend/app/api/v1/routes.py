from fastapi import APIRouter
from pydantic import BaseModel
from app.models.route import RouteAnalysisResponse
from app.services.route_optimizer import route_optimizer
from app.services.scenario_manager import scenario_manager

router = APIRouter(prefix="/routes", tags=["Safe Route Planning"])

class PlanRouteRequest(BaseModel):
    origin_name: str
    origin_lat: float
    origin_lon: float
    dest_name: str
    dest_lat: float
    dest_lon: float
    vessel_id: str = "INS-EXPLORER"

@router.get("", response_model=RouteAnalysisResponse)
def get_current_routes():
    """Retrieve multi-objective route evaluations for active vessel."""
    vessel = scenario_manager.vessel
    return route_optimizer.plan_routes(
        origin_name=f"{vessel.name} Position",
        origin_lat=vessel.current_lat,
        origin_lon=vessel.current_lon,
        dest_name=vessel.destination_name,
        dest_lat=vessel.destination_lat,
        dest_lon=vessel.destination_lon,
        vessel_id=vessel.id
    )

@router.post("/plan", response_model=RouteAnalysisResponse)
def plan_custom_route(req: PlanRouteRequest):
    """Calculate safest alternative routes between custom coordinates."""
    return route_optimizer.plan_routes(
        origin_name=req.origin_name,
        origin_lat=req.origin_lat,
        origin_lon=req.origin_lon,
        dest_name=req.dest_name,
        dest_lat=req.dest_lat,
        dest_lon=req.dest_lon,
        vessel_id=req.vessel_id
    )
