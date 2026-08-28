from pydantic import BaseModel
from typing import List, Optional

class UserLoginRequest(BaseModel):
    username: str
    password: str

class UserProfile(BaseModel):
    user_id: str
    username: str
    full_name: str
    role: str  # MISSION_COMMANDER, CHIEF_NAVIGATOR, POLAR_SCIENTIST, GUEST_OBSERVER
    agency: str
    clearance_level: str
    token: str
