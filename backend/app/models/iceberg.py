from pydantic import BaseModel, Field
from typing import List, Optional

class UncertaintyEllipse(BaseModel):
    semi_major_km: float
    semi_minor_km: float
    rotation_deg: float

class PredictedPoint(BaseModel):
    horizon_hours: int
    lat: float
    lon: float
    confidence_pct: float
    drift_distance_km: float
    position_error_km: float
    uncertainty: UncertaintyEllipse

class IcebergHistoricalPoint(BaseModel):
    timestamp_offset_hours: int
    lat: float
    lon: float

class Iceberg(BaseModel):
    id: str
    name: str
    lat: float
    lon: float
    size_category: str  # Mega, Large, Medium, Small, Growler
    length_km: float
    width_km: float
    area_sq_km: float
    thickness_m: float
    mass_megatons: float
    drift_speed_knots: float
    drift_heading_deg: float
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    source: str  # USNIC, NIC, Sentinel-1 SAR
    last_updated: str
    notes: Optional[str] = None
    historical_track: List[IcebergHistoricalPoint] = Field(default_factory=list)
    predictions: List[PredictedPoint] = Field(default_factory=list)
