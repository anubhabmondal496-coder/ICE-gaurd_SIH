from pydantic import BaseModel, Field
from typing import List, Optional
from app.models.vessel import Vessel

class FleetVesselSummary(BaseModel):
    id: str
    name: str
    country: str
    flag: str
    vessel_type: str
    ice_class: str
    current_lat: float
    current_lon: float
    speed_knots: float
    heading_deg: float
    destination_name: str
    destination_lat: float
    destination_lon: float
    status: str  # UNDERWAY, MOORED_FAST_ICE, SURVEY_OPS, EMERGENCY
    fuel_pct: float
    eta_utc: str
    pob_count: int  # Persons on board
    trail: List[List[float]] = Field(default_factory=list)

class FleetStatusResponse(BaseModel):
    total_vessels: int
    active_underway: int
    flag_nations: List[str]
    vessels: List[FleetVesselSummary]
