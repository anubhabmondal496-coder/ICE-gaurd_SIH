from pydantic import BaseModel, Field
from typing import List, Optional

class IcebergRiskDetail(BaseModel):
    iceberg_id: str
    iceberg_name: str
    cpa_km: float
    tcpa_hours: float
    collision_probability_pct: float
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    hazard_score: float  # 0 to 100
    closest_approach_point: List[float]  # [lat, lon]
    recommended_action: str

class NavigationRiskSummary(BaseModel):
    overall_risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    composite_risk_score: float  # 0 to 100
    collision_probability_pct: float
    closest_approach_km: float
    time_to_closest_approach: str
    target_iceberg_id: Optional[str] = None
    target_iceberg_name: Optional[str] = None
    active_alerts: List[str] = Field(default_factory=list)
    detailed_threats: List[IcebergRiskDetail] = Field(default_factory=list)
