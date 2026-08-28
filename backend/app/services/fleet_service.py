from typing import List, Dict, Optional
from app.models.fleet import FleetVesselSummary, FleetStatusResponse
from app.utils.geo_math import destination_point

class FleetService:
    """
    Manages active polar expedition fleet telemetry and tracking.
    """
    def __init__(self):
        self._fleet: Dict[str, FleetVesselSummary] = {
            "IND-EXP-01": FleetVesselSummary(
                id="IND-EXP-01",
                name="MV Vasiliy Golovnin (NCPOR Flagship)",
                country="India",
                flag="🇮🇳",
                vessel_type="Polar Class 3 Logistics & Cargo Flagship",
                ice_class="Polar Class 3 (PC3) Icebreaker",
                current_lat=-62.50,
                current_lon=15.00,
                speed_knots=12.4,
                heading_deg=165.0,
                destination_name="Maitri Fast-Ice Waypoint (-69.82° S)",
                destination_lat=-69.82,
                destination_lon=11.21,
                status="UNDERWAY",
                fuel_pct=84.0,
                eta_utc="18:42 UTC",
                pob_count=64,
                trail=[[-60.50, 16.20], [-61.20, 15.80], [-61.90, 15.40], [-62.50, 15.00]]
            ),
            "IND-EXP-02": FleetVesselSummary(
                id="IND-EXP-02",
                name="ORV Sagar Nidhi (MoES)",
                country="India",
                flag="🇮🇳",
                vessel_type="Dynamic Positioning Oceanographic Research Vessel",
                ice_class="Polar Class 4 (PC4)",
                current_lat=-62.00,
                current_lon=74.00,
                speed_knots=11.2,
                heading_deg=172.0,
                destination_name="Bharati Coastal Anchorage (-69.41° S)",
                destination_lat=-69.41,
                destination_lon=76.19,
                status="UNDERWAY",
                fuel_pct=78.0,
                eta_utc="21:15 UTC",
                pob_count=48,
                trail=[[-59.50, 72.80], [-60.80, 73.40], [-62.00, 74.00]]
            ),
            "IND-EXP-03": FleetVesselSummary(
                id="IND-EXP-03",
                name="INS Sagardhwani",
                country="India",
                flag="🇮🇳",
                vessel_type="Marine Acoustic & Hydrographic Survey Ship",
                ice_class="Ice-Strengthened Hull (1A)",
                current_lat=-58.20,
                current_lon=-44.50,
                speed_knots=10.5,
                heading_deg=215.0,
                destination_name="Rothera Coastal Anchorage (-67.57° S)",
                destination_lat=-67.57,
                destination_lon=-68.13,
                status="SURVEY_OPS",
                fuel_pct=88.0,
                eta_utc="04:30 UTC",
                pob_count=52,
                trail=[[-56.00, -42.00], [-57.10, -43.20], [-58.20, -44.50]]
            ),
            "INT-BAS-01": FleetVesselSummary(
                id="INT-BAS-01",
                name="RRS Sir David Attenborough",
                country="United Kingdom",
                flag="🇬🇧",
                vessel_type="Polar Research & Logistics Ship",
                ice_class="Polar Class 4 (PC4)",
                current_lat=-64.80,
                current_lon=-64.20,
                speed_knots=13.0,
                heading_deg=190.0,
                destination_name="Rothera Research Station",
                destination_lat=-67.57,
                destination_lon=-68.13,
                status="UNDERWAY",
                fuel_pct=82.0,
                eta_utc="14:00 UTC",
                pob_count=58,
                trail=[[-62.50, -62.00], [-63.60, -63.10], [-64.80, -64.20]]
            ),
            "INT-AWI-01": FleetVesselSummary(
                id="INT-AWI-01",
                name="RV Polarstern",
                country="Germany",
                flag="🇩🇪",
                vessel_type="Heavy Scientific Polar Icebreaker",
                ice_class="Polar Class 2 (PC2)",
                current_lat=-68.40,
                current_lon=-10.50,
                speed_knots=9.8,
                heading_deg=220.0,
                destination_name="Neumayer-Station III",
                destination_lat=-70.67,
                destination_lon=-8.27,
                status="UNDERWAY",
                fuel_pct=72.0,
                eta_utc="11:45 UTC",
                pob_count=94,
                trail=[[-66.00, -8.00], [-67.20, -9.20], [-68.40, -10.50]]
            ),
            "INT-ZAF-01": FleetVesselSummary(
                id="INT-ZAF-01",
                name="S.A. Agulhas II",
                country="South Africa",
                flag="🇿🇦",
                vessel_type="Polar Supply & Research Vessel",
                ice_class="Polar Class 5 (PC5)",
                current_lat=-65.20,
                current_lon=0.50,
                speed_knots=11.5,
                heading_deg=175.0,
                destination_name="SANAE IV Logistics Corridor",
                destination_lat=-71.67,
                destination_lon=-2.83,
                status="UNDERWAY",
                fuel_pct=80.0,
                eta_utc="16:20 UTC",
                pob_count=60,
                trail=[[-63.00, 1.20], [-64.10, 0.90], [-65.20, 0.50]]
            )
        }

    def get_all_vessels(self) -> List[FleetVesselSummary]:
        return list(self._fleet.values())

    def get_vessel_by_id(self, vessel_id: str) -> Optional[FleetVesselSummary]:
        return self._fleet.get(vessel_id)

    def get_fleet_summary(self) -> FleetStatusResponse:
        vessels = self.get_all_vessels()
        flags = list(set([v.country for v in vessels]))
        underway = len([v for v in vessels if v.status == "UNDERWAY"])
        return FleetStatusResponse(
            total_vessels=len(vessels),
            active_underway=underway,
            flag_nations=flags,
            vessels=vessels
        )

    def step_fleet_simulation(self, speed_multiplier: float = 1.0):
        dt_hours = 0.25 * speed_multiplier
        for vessel in self._fleet.values():
            if vessel.status in ["UNDERWAY", "SURVEY_OPS"]:
                dist_km = (vessel.speed_knots * 1.852) * dt_hours
                next_lat, next_lon = destination_point(
                    vessel.current_lat, vessel.current_lon,
                    dist_km, vessel.heading_deg
                )
                vessel.current_lat = round(next_lat, 4)
                vessel.current_lon = round(next_lon, 4)
                vessel.trail.append([vessel.current_lat, vessel.current_lon])
                if len(vessel.trail) > 40:
                    vessel.trail.pop(0)

fleet_service = FleetService()
