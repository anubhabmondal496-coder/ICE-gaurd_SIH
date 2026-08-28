from fastapi import APIRouter, HTTPException
from app.models.user import UserLoginRequest, UserProfile
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication & Roles"])

@router.post("/login", response_model=UserProfile)
def login_user(req: UserLoginRequest):
    """Authenticate Officer on Watch or Mission Commander."""
    user = auth_service.authenticate(req)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid officer credentials. Use demo: commander / sih2026")
    return user
