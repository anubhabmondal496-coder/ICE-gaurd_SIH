import asyncio
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1.icebergs import router as icebergs_router
from app.api.v1.trajectory import router as trajectory_router
from app.api.v1.environment import router as environment_router
from app.api.v1.risk import router as risk_router
from app.api.v1.routes import router as routes_router
from app.api.v1.satellite import router as satellite_router
from app.api.v1.scenarios import router as scenarios_router
from app.api.v1.fleet import router as fleet_router
from app.api.v1.emergency import router as emergency_router
from app.api.v1.auth import router as auth_router
from app.services.scenario_manager import scenario_manager

# WebSocket Connection Manager for live telemetry broadcast
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    async def simulation_loop():
        while True:
            if scenario_manager.is_playing:
                scenario_manager.step_simulation()
                await manager.broadcast(scenario_manager.get_full_state())
            await asyncio.sleep(1.0)
    
    sim_task = asyncio.create_task(simulation_loop())
    yield
    sim_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Antarctic Iceberg Intelligence & Safe Navigation Decision Support API",
    lifespan=lifespan
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(icebergs_router, prefix=settings.API_V1_PREFIX)
app.include_router(trajectory_router, prefix=settings.API_V1_PREFIX)
app.include_router(environment_router, prefix=settings.API_V1_PREFIX)
app.include_router(risk_router, prefix=settings.API_V1_PREFIX)
app.include_router(routes_router, prefix=settings.API_V1_PREFIX)
app.include_router(satellite_router, prefix=settings.API_V1_PREFIX)
app.include_router(scenarios_router, prefix=settings.API_V1_PREFIX)
app.include_router(fleet_router, prefix=settings.API_V1_PREFIX)
app.include_router(emergency_router, prefix=settings.API_V1_PREFIX)
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "system": "ICEGUARD AI",
        "status": "ONLINE",
        "mission": "Antarctic Iceberg Intelligence & Safe Navigation",
        "version": settings.VERSION
    }

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_json(scenario_manager.get_full_state())
        while True:
            data = await websocket.receive_text()
            try:
                cmd = json.loads(data)
                if cmd.get("action") == "step":
                    scenario_manager.step_simulation()
                elif cmd.get("action") == "play":
                    scenario_manager.is_playing = True
                elif cmd.get("action") == "pause":
                    scenario_manager.is_playing = False
                elif cmd.get("action") == "set_speed":
                    scenario_manager.speed_multiplier = cmd.get("speed", 1.0)
                await websocket.send_json(scenario_manager.get_full_state())
            except Exception:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
