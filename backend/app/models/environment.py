from pydantic import BaseModel, Field
from typing import List, Optional

class VectorField(BaseModel):
    speed_ms: float
    direction_deg: float
    u_component: float
    v_component: float

class EnvironmentalConditions(BaseModel):
    lat: float
    lon: float
    timestamp_utc: str
    ocean_current: VectorField
    surface_wind: VectorField
    sea_ice_concentration_pct: float
    sea_ice_thickness_m: float
    sea_surface_temp_c: float
    wave_height_m: float
    visibility_km: float
    atmospheric_pressure_hpa: float

class SeaIcePolygon(BaseModel):
    id: str
    region_name: str
    concentration_pct: float
    category: str  # Compact (80-100%), Close (60-80%), Open (30-60%), Very Open (10-30%)
    polygon_coords: List[List[float]]  # [[lat, lon], ...]
