from fastapi import APIRouter
from app.models.emergency import SOSDistressRequest, SOSDistressResponse
from app.services.emergency_service import emergency_service

router = APIRouter(prefix="/emergency", tags=["Emergency SOS & SAR"])

@router.post("/sos", response_model=SOSDistressResponse)
def trigger_emergency_sos(req: SOSDistressRequest):
    """Trigger emergency SOS distress beacon and dispatch SAR assets."""
    return emergency_service.trigger_sos(req)
