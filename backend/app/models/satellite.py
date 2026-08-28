from pydantic import BaseModel, Field
from typing import List, Optional

class SARTarget(BaseModel):
    target_id: str
    lat: float
    lon: float
    length_m: float
    width_m: float
    area_sq_km: float
    radar_cross_section_db: float
    confidence_pct: float
    classification: str  # Iceberg Calved, Tabular Iceberg, Ice Island, Bergy Bit
    matched_iceberg_id: Optional[str] = None

class SARPass(BaseModel):
    pass_id: str
    satellite: str  # Sentinel-1A, Sentinel-1B, RADARSAT Constellation
    acquisition_time_utc: str
    polarization: str  # HH+HV, VV+VH
    resolution_m: float
    swath_mode: str  # Extra Wide (EW), Interferometric Wide (IW)
    bbox: List[float]  # [min_lat, min_lon, max_lat, max_lon]
    detected_targets_count: int
    targets: List[SARTarget] = Field(default_factory=list)

class DataSourceStatus(BaseModel):
    name: str
    agency: str
    dataset_type: str
    variables: List[str]
    update_frequency: str
    last_ingested_utc: str
    status: str  # OPERATIONAL, SYNCING, DEGRADED
    latency_seconds: int
    data_quality_pct: float
    api_endpoint: str
