from pydantic import BaseModel, Field
from typing import List, Optional

class Waypoint(BaseModel):
    name: str
    lat: float
    lon: float
    eta_hours: Optional[float] = None

class Vessel(BaseModel):
    id: str = "INS-EXPLORER"
    name: str = "INS Explorer"
    vessel_type: str = "Polar Research & Logistics Vessel"
    ice_class: str = "Polar Class 3 (PC3)"
    length_m: float = 130.0
    beam_m: float = 22.0
    draft_m: float = 8.5
    current_lat: float = -62.50
    current_lon: float = 15.00
    speed_knots: float = 12.4
    heading_deg: float = 165.0
    destination_name: str = "Maitri Coastal Fast-Ice Zone"
    destination_lat: float = -69.82
    destination_lon: float = 11.21
    status: str = "UNDERWAY"
    fuel_pct: float = 84.0
    eta_utc: str = "18:42 UTC"
    active_route_id: str = "route-rec-a"
    trail: List[List[float]] = Field(default_factory=list)  # [[lat, lon], ...]
