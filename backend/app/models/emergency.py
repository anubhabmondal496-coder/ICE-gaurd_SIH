from pydantic import BaseModel, Field
from typing import List, Optional

class SOSDistressRequest(BaseModel):
    vessel_id: str
    vessel_name: str
    lat: float
    lon: float
    distress_nature: str  # ICE_ENTRAPMENT, IMMINENT_COLLISION, HULL_DAMAGE, ENGINE_FAILURE, MEDICAL_EVAC
    pob: int = 42
    additional_notes: Optional[str] = None

class NearestRescueAsset(BaseModel):
    asset_name: str
    asset_type: str  # STATION, ICEBREAKER, HELICOPTER_SQUADRON
    distance_km: float
    estimated_transit_hours: float
    contact_freq: str

class SOSDistressResponse(BaseModel):
    distress_id: str
    broadcast_timestamp_utc: str
    vessel_name: str
    coordinates: List[float]
    status: str  # ACTIVE_BROADCAST, DISPATCHING_SAR, RESOLVED
    gmdss_message: str
    nearest_station: str
    distance_to_nearest_station_km: float
    nearest_rescue_assets: List[NearestRescueAsset]
    recommended_safety_protocol: str
