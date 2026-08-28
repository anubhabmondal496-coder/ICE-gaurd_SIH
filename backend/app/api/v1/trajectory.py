from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.models.iceberg import PredictedPoint
from app.services.drift_engine import drift_engine

router = APIRouter(prefix="/trajectory", tags=["Trajectory Prediction"])

class CustomPredictionRequest(BaseModel):
    lat: float
    lon: float
    drift_speed_knots: float
    drift_heading_deg: float
    horizons_hours: List[int] = [6, 12, 24, 48]
    mass_megatons: float = 500.0

@router.post("/predict", response_model=List[PredictedPoint])
def predict_custom_trajectory(req: CustomPredictionRequest):
    """
    Run custom multi-horizon trajectory drift prediction for given initial coordinates & velocity.
    """
    return drift_engine.predict_trajectory(
        start_lat=req.lat,
        start_lon=req.lon,
        drift_speed_knots=req.drift_speed_knots,
        drift_heading_deg=req.drift_heading_deg,
        horizons_hours=req.horizons_hours,
        iceberg_mass_mt=req.mass_megatons
    )
