from pydantic import BaseModel
import os

class Settings(BaseModel):
    PROJECT_NAME: str = "ICEGUARD AI"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Polar bounds for operations (Antarctic waters)
    MIN_LAT: float = -85.0
    MAX_LAT: float = -55.0
    MIN_LON: float = -180.0
    MAX_LON: float = 180.0
    
    # Default stations
    MAITRI_COAST_LAT: float = -69.82
    MAITRI_COAST_LON: float = 11.21
    
    BHARATI_COAST_LAT: float = -69.41
    BHARATI_COAST_LON: float = 76.19
    
    CAPE_TOWN_LAT: float = -33.92
    CAPE_TOWN_LON: float = 18.42
    
    # Simulation defaults
    SIMULATION_UPDATE_INTERVAL: float = 1.0  # seconds
    DEFAULT_SPEED_MULTIPLIER: float = 1.0

settings = Settings()
