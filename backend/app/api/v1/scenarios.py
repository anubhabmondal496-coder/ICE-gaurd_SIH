from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.scenario_manager import scenario_manager

router = APIRouter(prefix="/scenarios", tags=["Scenarios & Simulation"])

class SimulationControlRequest(BaseModel):
    action: str  # play, pause, step, reset, set_speed
    speed_multiplier: float = 1.0

@router.get("", response_model=List[Dict])
def list_scenarios():
    """List available Antarctic operational scenarios."""
    return scenario_manager.get_scenarios()

@router.post("/{scenario_id}/select")
def select_scenario(scenario_id: str):
    """Switch active operational scenario."""
    scenario_manager.select_scenario(scenario_id)
    return {"status": "success", "active_scenario_id": scenario_id}

@router.post("/simulation/control")
def control_simulation(req: SimulationControlRequest):
    """Control simulation state (play, pause, step, speed)."""
    if req.action == "play":
        scenario_manager.is_playing = True
    elif req.action == "pause":
        scenario_manager.is_playing = False
    elif req.action == "step":
        scenario_manager.step_simulation()
    elif req.action == "set_speed":
        scenario_manager.speed_multiplier = max(0.25, min(20.0, req.speed_multiplier))
    return {
        "is_playing": scenario_manager.is_playing,
        "speed_multiplier": scenario_manager.speed_multiplier,
        "step": scenario_manager.simulation_step
    }

@router.get("/state/snapshot")
def get_full_state_snapshot():
    """Retrieve complete synchronized polar operational picture."""
    return scenario_manager.get_full_state()
