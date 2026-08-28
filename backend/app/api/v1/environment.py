from fastapi import APIRouter, Query
from typing import List
from app.models.environment import EnvironmentalConditions, SeaIcePolygon
from app.services.environmental_service import environmental_service
from app.services.live_ingestion_service import live_ingestion_service

router = APIRouter(prefix="/environment", tags=["Environmental Intelligence"])

@router.get("", response_model=EnvironmentalConditions)
async def get_environmental_conditions(
    lat: float = Query(-64.23, description="Target Latitude"),
    lon: float = Query(45.72, description="Target Longitude"),
    use_live: bool = Query(True, description="Attempt live atmospheric and marine feed fetch")
):
    """Retrieve ocean current, surface wind, and sea ice data at given polar coordinates."""
    if use_live:
        live_data = await live_ingestion_service.fetch_live_marine_weather(lat, lon)
        if live_data:
            return live_data
    return environmental_service.get_conditions_at(lat, lon)

@router.get("/sea-ice", response_model=List[SeaIcePolygon])
def get_sea_ice_zones():
    """Retrieve active Antarctic sea-ice concentration polygons."""
    return environmental_service.get_sea_ice_polygons()
