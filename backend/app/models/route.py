from pydantic import BaseModel, Field
from typing import List, Optional

class RouteWaypoint(BaseModel):
    name: str
    lat: float
    lon: float
    segment_distance_km: float
    segment_risk: float

class NavigationRoute(BaseModel):
    id: str
    name: str
    route_type: str  # DIRECT_PLANNED, RECOMMENDED_SAFEST, ALTERNATIVE_FAST_SAFE
    is_recommended: bool = False
    total_distance_km: float
    estimated_duration_hours: float
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    composite_risk_score: float
    risk_reduction_pct: float
    fuel_consumption_tons: float
    waypoints: List[RouteWaypoint]
    path_coordinates: List[List[float]]  # [[lat, lon], ...]
    description: str

class RouteAnalysisResponse(BaseModel):
    origin: str
    destination: str
    vessel_id: str
    evaluated_at: str
    routes: List[NavigationRoute]
    best_route_id: str
