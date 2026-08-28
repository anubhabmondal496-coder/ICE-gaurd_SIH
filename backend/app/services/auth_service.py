import uuid
from typing import Optional
from app.models.user import UserLoginRequest, UserProfile

class AuthService:
    """
    Handles Officer on Watch and Mission Commander authentication.
    """
    def __init__(self):
        self._demo_users = {
            "commander": {
                "password": "sih2026",
                "full_name": "Dr. Rajeshwar Sharma (Mission Director)",
                "role": "MISSION_COMMANDER",
                "agency": "NCPOR / Ministry of Earth Sciences",
                "clearance_level": "LEVEL-4 TOP PRIORITY"
            },
            "navigator": {
                "password": "sih2026",
                "full_name": "Capt. Arvind Nair (Chief Navigator)",
                "role": "CHIEF_NAVIGATOR",
                "agency": "Indian Antarctic Expedition Fleet",
                "clearance_level": "LEVEL-3 MARITIME OPERATIONS"
            },
            "scientist": {
                "password": "sih2026",
                "full_name": "Dr. Ananya Roy (Lead Glaciologist)",
                "role": "POLAR_SCIENTIST",
                "agency": "Maitri & Bharati Research Wing",
                "clearance_level": "LEVEL-2 RESEARCH"
            },
            "guest": {
                "password": "sih2026",
                "full_name": "Guest Observer / SIH Evaluator",
                "role": "GUEST_OBSERVER",
                "agency": "Smart India Hackathon 2026",
                "clearance_level": "LEVEL-1 READ ONLY"
            }
        }

    def authenticate(self, req: UserLoginRequest) -> Optional[UserProfile]:
        username = req.username.lower().strip()
        user_info = self._demo_users.get(username)

        # Allow demo login if password matches or if password is sih2026 / password
        if user_info:
            if req.password == user_info["password"] or req.password in ["sih2026", "password", "admin", "123456"]:
                token = f"POLAR-AUTH-{uuid.uuid4().hex[:12].upper()}"
                return UserProfile(
                    user_id=f"USR-{username.upper()}",
                    username=username,
                    full_name=user_info["full_name"],
                    role=user_info["role"],
                    agency=user_info["agency"],
                    clearance_level=user_info["clearance_level"],
                    token=token
                )
        return None

auth_service = AuthService()
