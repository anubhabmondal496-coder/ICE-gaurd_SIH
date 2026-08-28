import math
from typing import List, Dict, Optional
from app.models.vessel import Vessel
from app.models.iceberg import Iceberg
from app.services.iceberg_service import iceberg_service
from app.services.environmental_service import environmental_service
from app.services.risk_engine import risk_engine
from app.services.route_optimizer import route_optimizer
from app.services.fleet_service import fleet_service
from app.utils.geo_math import destination_point, calculate_bearing_deg, haversine_distance_km

class ScenarioManager:
    """
    Manages operational simulation scenarios, realistic waypoint-following autopilot navigation,
    coastal fast-ice arrival detection, and live telemetry ticks.
    """
    def __init__(self):
        self.active_scenario_id = "maitri-expedition"
        self.is_playing = False
        self.speed_multiplier = 1.0
        self.simulation_step = 0
        self.current_waypoint_index = 0

        # Scenario definitions with realistic nautical waypoints bounded in maritime waters
        self.scenarios = [
            {
                "id": "maitri-expedition",
                "name": "Maitri Station Supply Run 2026",
                "description": "MV Vasiliy Golovnin (NCPOR Flagship) en route to India's Maitri station fast-ice waypoint (-69.82° S, 11.21° E). Follows maritime clearance channel around iceberg A76C.",
                "initial_vessel_lat": -62.50,
                "initial_vessel_lon": 15.00,
                "dest_name": "Princess Astrid Coast Fast-Ice Bay (-69.82° S, 11.21° E)",
                "dest_lat": -69.82,
                "dest_lon": 11.21,
                "focus_iceberg_id": "A76C",
                "waypoints": [
                    [-62.50, 15.00],
                    [-64.30, 16.80],  # Eastward clearance arc
                    [-66.20, 15.60],  # Clearance flank
                    [-68.30, 12.80],  # Approach channel
                    [-69.82, 11.21]   # Mooring destination (Princess Astrid Coast)
                ]
            },
            {
                "id": "bharati-expedition",
                "name": "Prydz Bay & Bharati Station Resupply",
                "description": "ORV Sagar Nidhi transit to India's Bharati Station in Larsemann Hills via Prydz Bay (-69.41° S, 76.19° E).",
                "initial_vessel_lat": -62.00,
                "initial_vessel_lon": 74.00,
                "dest_name": "Bharati Coastal Anchorage (-69.41° S, 76.19° E)",
                "dest_lat": -69.41,
                "dest_lon": 76.19,
                "focus_iceberg_id": "D28",
                "waypoints": [
                    [-62.00, 74.00],
                    [-64.50, 74.80],
                    [-67.00, 75.60],
                    [-69.41, 76.19]   # Coastal anchorage
                ]
            },
            {
                "id": "weddell-mega-berg",
                "name": "Weddell Sea A23A Mega-Berg Navigation",
                "description": "Acoustic survey by INS Sagardhwani navigating South Orkney channels to Rothera Coastal Anchorage (-67.57° S, -68.13° W).",
                "initial_vessel_lat": -58.20,
                "initial_vessel_lon": -44.50,
                "dest_name": "Rothera Coastal Anchorage (-67.57° S, -68.13° W)",
                "dest_lat": -67.57,
                "dest_lon": -68.13,
                "focus_iceberg_id": "A23A",
                "waypoints": [
                    [-58.20, -44.50],
                    [-61.50, -52.00],
                    [-64.80, -60.00],
                    [-67.57, -68.13]
                ]
            }
        ]

        # Initialize active route waypoints
        self.active_waypoints = self.scenarios[0]["waypoints"]

        # Initialize primary vessel
        self.vessel = Vessel(
            id="IND-EXP-01",
            name="MV Vasiliy Golovnin (NCPOR Flagship)",
            vessel_type="Ice-Class Polar Logistics & Research Flagship",
            ice_class="Polar Class 3 (PC3) Icebreaker",
            current_lat=-62.50,
            current_lon=15.00,
            speed_knots=12.4,
            heading_deg=165.0,
            destination_name="Princess Astrid Coast Fast-Ice Bay (-69.82° S)",
            destination_lat=-69.82,
            destination_lon=11.21,
            status="UNDERWAY",
            fuel_pct=84.0,
            eta_utc="18:42 UTC",
            active_route_id="route-rec-a",
            trail=[
                [-60.50, 16.20],
                [-61.20, 15.80],
                [-61.90, 15.40],
                [-62.50, 15.00]
            ]
        )

    def get_scenarios(self) -> List[Dict]:
        return self.scenarios

    def select_scenario(self, scenario_id: str):
        self.active_scenario_id = scenario_id
        self.simulation_step = 0
        self.current_waypoint_index = 0
        self.is_playing = False

        sc = next((s for s in self.scenarios if s["id"] == scenario_id), self.scenarios[0])
        self.active_waypoints = sc["waypoints"]

        if scenario_id == "maitri-expedition":
            self.vessel.id = "IND-EXP-01"
            self.vessel.name = "MV Vasiliy Golovnin (NCPOR Flagship)"
            self.vessel.vessel_type = "Ice-Class Polar Logistics & Research Flagship"
            self.vessel.ice_class = "Polar Class 3 (PC3) Icebreaker"
            self.vessel.current_lat = sc["initial_vessel_lat"]
            self.vessel.current_lon = sc["initial_vessel_lon"]
            self.vessel.destination_name = sc["dest_name"]
            self.vessel.destination_lat = sc["dest_lat"]
            self.vessel.destination_lon = sc["dest_lon"]
            self.vessel.speed_knots = 12.4
            self.vessel.heading_deg = 165.0
            self.vessel.status = "UNDERWAY"
            self.vessel.trail = [[-60.50, 16.20], [-61.20, 15.80], [-62.50, 15.00]]
        elif scenario_id == "bharati-expedition":
            self.vessel.id = "IND-EXP-02"
            self.vessel.name = "ORV Sagar Nidhi (MoES Oceanographic Vessel)"
            self.vessel.vessel_type = "Dynamic Positioning Polar Research Vessel"
            self.vessel.ice_class = "Polar Class 4 (PC4)"
            self.vessel.current_lat = sc["initial_vessel_lat"]
            self.vessel.current_lon = sc["initial_vessel_lon"]
            self.vessel.destination_name = sc["dest_name"]
            self.vessel.destination_lat = sc["dest_lat"]
            self.vessel.destination_lon = sc["dest_lon"]
            self.vessel.speed_knots = 11.2
            self.vessel.heading_deg = 172.0
            self.vessel.status = "UNDERWAY"
            self.vessel.trail = [[-60.00, 73.00], [-62.00, 74.00]]
        elif scenario_id == "weddell-mega-berg":
            self.vessel.id = "IND-EXP-03"
            self.vessel.name = "INS Sagardhwani (Polar Survey Vessel)"
            self.vessel.vessel_type = "Marine Oceanographic Acoustic Research Ship"
            self.vessel.ice_class = "Ice-Strengthened Hull (1A)"
            self.vessel.current_lat = sc["initial_vessel_lat"]
            self.vessel.current_lon = sc["initial_vessel_lon"]
            self.vessel.destination_name = sc["dest_name"]
            self.vessel.destination_lat = sc["dest_lat"]
            self.vessel.destination_lon = sc["dest_lon"]
            self.vessel.speed_knots = 10.5
            self.vessel.heading_deg = 215.0
            self.vessel.status = "SURVEY_OPS"
            self.vessel.trail = [[-56.00, -42.00], [-58.20, -44.50]]

    def select_vessel_from_fleet(self, vessel_id: str):
        v = fleet_service.get_vessel_by_id(vessel_id)
        if v:
            self.vessel.id = v.id
            self.vessel.name = v.name
            self.vessel.vessel_type = v.vessel_type
            self.vessel.ice_class = v.ice_class
            self.vessel.current_lat = v.current_lat
            self.vessel.current_lon = v.current_lon
            self.vessel.speed_knots = v.speed_knots
            self.vessel.heading_deg = v.heading_deg
            self.vessel.destination_name = v.destination_name
            self.vessel.destination_lat = v.destination_lat
            self.vessel.destination_lon = v.destination_lon
            self.vessel.status = v.status
            self.vessel.fuel_pct = v.fuel_pct
            self.vessel.eta_utc = v.eta_utc
            self.vessel.trail = v.trail.copy()

    def step_simulation(self):
        """
        Advance vessel position along its active planned route waypoints with realistic
        autopilot steering, coastal arrival clamping, and hydrodynamic iceberg drift.
        """
        self.simulation_step += 1
        dt_hours = (0.25 * self.speed_multiplier)  # 15 minutes scaled per tick

        # 1. Waypoint-Following Autopilot Navigation
        dest_lat = self.vessel.destination_lat
        dest_lon = self.vessel.destination_lon
        dist_to_destination = haversine_distance_km(
            self.vessel.current_lat, self.vessel.current_lon,
            dest_lat, dest_lon
        )

        # Check if arrived at destination fast-ice mooring point
        if dist_to_destination <= 6.0 or self.vessel.current_lat <= dest_lat:
            self.vessel.current_lat = dest_lat
            self.vessel.current_lon = dest_lon
            self.vessel.speed_knots = 0.0
            self.vessel.status = "MOORED AT FAST-ICE BAY"
            self.vessel.eta_utc = "ARRIVED (FAST ICE)"
            self.is_playing = False
        else:
            # Determine active target waypoint along route
            if self.active_waypoints and len(self.active_waypoints) > 0:
                # Find current target waypoint
                target_wp = self.active_waypoints[min(self.current_waypoint_index + 1, len(self.active_waypoints) - 1)]
                dist_to_wp = haversine_distance_km(
                    self.vessel.current_lat, self.vessel.current_lon,
                    target_wp[0], target_wp[1]
                )

                if dist_to_wp < 12.0 and self.current_waypoint_index < len(self.active_waypoints) - 1:
                    self.current_waypoint_index += 1
                    target_wp = self.active_waypoints[self.current_waypoint_index]

                # Compute steering heading to next waypoint
                bearing = calculate_bearing_deg(
                    self.vessel.current_lat, self.vessel.current_lon,
                    target_wp[0], target_wp[1]
                )
                self.vessel.heading_deg = round(bearing, 1)

            # Advance vessel along steering heading
            dist_km = (self.vessel.speed_knots * 1.852) * dt_hours
            next_lat, next_lon = destination_point(
                self.vessel.current_lat, self.vessel.current_lon,
                dist_km, self.vessel.heading_deg
            )

            # Clamping: Never allow ship to cross south of coastal destination limit
            if next_lat < dest_lat:
                next_lat = dest_lat
                next_lon = dest_lon
                self.vessel.speed_knots = 0.0
                self.vessel.status = "MOORED AT FAST-ICE BAY"
                self.vessel.eta_utc = "ARRIVED (FAST ICE)"
                self.is_playing = False

            self.vessel.current_lat = round(next_lat, 4)
            self.vessel.current_lon = round(next_lon, 4)
            self.vessel.trail.append([self.vessel.current_lat, self.vessel.current_lon])
            if len(self.vessel.trail) > 60:
                self.vessel.trail.pop(0)

        # 2. Advance fleet vessels
        fleet_service.step_fleet_simulation(self.speed_multiplier)

        # 3. Advance icebergs along realistic Antarctic currents (Westward coastal drift / ACC)
        for berg in iceberg_service.get_all_icebergs():
            drift_dist_km = (berg.drift_speed_knots * 1.852) * dt_hours
            # Near coastal shelf, deflect drift westward along the East Wind Drift
            heading = berg.drift_heading_deg
            if berg.lat < -67.5 and (heading > 120 and heading < 240):
                heading = 265.0  # Coastal westward deflecting current

            b_lat, b_lon = destination_point(berg.lat, berg.lon, drift_dist_km, heading)

            # Do not allow icebergs to cross into continental landmass (coastline boundary ~ -70.5° S)
            if b_lat < -70.2:
                b_lat = -70.2

            berg.lat = round(b_lat, 4)
            berg.lon = round(b_lon, 4)

        # 4. Recalculate predictions and risk dynamically
        for berg in iceberg_service.get_all_icebergs():
            iceberg_service.recalculate_predictions(berg.id)

    def get_full_state(self) -> Dict:
        risk_summary = risk_engine.evaluate_vessel_risk(self.vessel)
        env = environmental_service.get_conditions_at(self.vessel.current_lat, self.vessel.current_lon)
        routes = route_optimizer.plan_routes(
            origin_name=f"{self.vessel.name} Position",
            origin_lat=self.vessel.current_lat,
            origin_lon=self.vessel.current_lon,
            dest_name=self.vessel.destination_name,
            dest_lat=self.vessel.destination_lat,
            dest_lon=self.vessel.destination_lon,
            vessel_id=self.vessel.id
        )

        return {
            "vessel": self.vessel.model_dump(),
            "fleet": [v.model_dump() for v in fleet_service.get_all_vessels()],
            "icebergs": [b.model_dump() for b in iceberg_service.get_all_icebergs()],
            "environment": env.model_dump(),
            "sea_ice_zones": [z.model_dump() for z in environmental_service.get_sea_ice_polygons()],
            "risk_summary": risk_summary.model_dump(),
            "routes": routes.model_dump(),
            "simulation": {
                "active_scenario_id": self.active_scenario_id,
                "is_playing": self.is_playing,
                "speed_multiplier": self.speed_multiplier,
                "step": self.simulation_step
            }
        }

scenario_manager = ScenarioManager()
