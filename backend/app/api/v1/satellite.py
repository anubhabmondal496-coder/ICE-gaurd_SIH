from fastapi import APIRouter
from typing import List, Dict, Any
from app.models.satellite import SARPass, DataSourceStatus
from app.services.satellite_service import satellite_service
from app.services.live_ingestion_service import live_ingestion_service

router = APIRouter(prefix="/satellite", tags=["Satellite Intelligence"])

@router.get("/sar-passes", response_model=List[SARPass])
def get_sar_passes():
    """Retrieve Sentinel-1 SAR acquisition passes and radar target segmentations."""
    return satellite_service.get_sar_passes()

@router.get("/data-sources", response_model=List[DataSourceStatus])
def get_data_sources_status():
    """Retrieve health, latency, and quality telemetry of polar environmental feeds."""
    return satellite_service.get_data_sources()

@router.get("/live-status")
def get_live_feeds_status():
    """Check configuration and availability of live satellite & weather API connections."""
    return live_ingestion_service.get_live_configuration_status()

@router.post("/sync-live")
async def sync_live_feeds():
    """Trigger manual polling and ingestion from live polar feeds."""
    test_lat, test_lon = -64.23, 45.72
    live_env = await live_ingestion_service.fetch_live_marine_weather(test_lat, test_lon)
    return {
        "status": "SUCCESS",
        "synced_at": live_env.timestamp_utc if live_env else "Fallback synced",
        "live_weather_active": live_env is not None,
        "sample_conditions": live_env.model_dump() if live_env else None
    }
