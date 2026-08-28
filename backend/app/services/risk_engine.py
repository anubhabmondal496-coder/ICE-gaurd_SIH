import math
from typing import List, Dict, Tuple
from app.models.vessel import Vessel
from app.models.iceberg import Iceberg
from app.models.risk import NavigationRiskSummary, IcebergRiskDetail
from app.utils.geo_math import compute_cpa_tcpa, haversine_distance_km
from app.services.iceberg_service import iceberg_service
from app.services.environmental_service import environmental_service

class NavigationRiskEngine:
    """
    Evaluates multi-variable polar maritime collision risks, CPA/TCPA calculations,
    and alert threshold triggers.
    """
    def evaluate_vessel_risk(self, vessel: Vessel) -> NavigationRiskSummary:
        icebergs = iceberg_service.get_all_icebergs()
        detailed_threats: List[IcebergRiskDetail] = []
        alerts: List[str] = []

        highest_hazard = 0.0
        primary_threat_id = None
        primary_threat_name = None
        min_cpa = 9999.0
        tcpa_for_min_cpa = "N/A"

        for berg in icebergs:
            # Distance from vessel to iceberg right now
            current_dist = haversine_distance_km(
                vessel.current_lat, vessel.current_lon,
                berg.lat, berg.lon
            )

            # Skip icebergs further than 500 km
            if current_dist > 500.0:
                continue

            cpa_km, tcpa_hours = compute_cpa_tcpa(
                vessel_lat=vessel.current_lat,
                vessel_lon=vessel.current_lon,
                vessel_speed_knots=vessel.speed_knots,
                vessel_heading_deg=vessel.heading_deg,
                iceberg_lat=berg.lat,
                iceberg_lon=berg.lon,
                iceberg_speed_knots=berg.drift_speed_knots,
                iceberg_heading_deg=berg.drift_heading_deg
            )

            # Calculate collision probability based on CPA vs iceberg dimensions and uncertainty
            # If CPA is within safety margin (e.g., < 15 km), probability scales exponentially
            safety_radius = max(5.0, (berg.length_km / 2.0) + 4.0)
            
            if cpa_km <= safety_radius:
                col_prob = max(10.0, min(95.0, (1.0 - (cpa_km / safety_radius)) * 90.0 + 10.0))
            elif cpa_km < 30.0:
                col_prob = max(1.0, (1.0 - ((cpa_km - safety_radius) / (30.0 - safety_radius))) * 25.0)
            else:
                col_prob = 0.5

            # Environmental penalty at iceberg position
            env = environmental_service.get_conditions_at(berg.lat, berg.lon)
            ice_penalty = (env.sea_ice_concentration_pct / 100.0) * 15.0

            # Iceberg size factor (0..20)
            size_factor = min(20.0, (berg.area_sq_km / 200.0) * 20.0)

            # Composite hazard score (0..100)
            hazard_score = min(100.0, (col_prob * 0.55) + ice_penalty + size_factor)
            
            # Risk Level
            if hazard_score >= 65.0 or (cpa_km < 8.0 and tcpa_hours < 24.0):
                risk_lvl = "HIGH"
                rec_action = f"Immediate detour recommended. Iceberg {berg.id} encroaches route within {cpa_km:.1f} km."
                alerts.append(f"CRITICAL PROXIMITY: Iceberg {berg.id} predicted CPA {cpa_km:.1f} km in {tcpa_hours:.1f}h.")
            elif hazard_score >= 35.0 or (cpa_km < 20.0 and tcpa_hours < 36.0):
                risk_lvl = "MEDIUM"
                rec_action = f"Maintain enhanced radar watch on {berg.id}. Closest approach {cpa_km:.1f} km."
            else:
                risk_lvl = "LOW"
                rec_action = "Routine monitoring. Trajectory diverges from planned track."

            if hazard_score > highest_hazard:
                highest_hazard = hazard_score
                primary_threat_id = berg.id
                primary_threat_name = berg.name

            if cpa_km < min_cpa:
                min_cpa = cpa_km
                tcpa_for_min_cpa = f"{int(tcpa_hours)}h {int((tcpa_hours % 1) * 60)}m"

            detailed_threats.append(IcebergRiskDetail(
                iceberg_id=berg.id,
                iceberg_name=berg.name,
                cpa_km=cpa_km,
                tcpa_hours=tcpa_hours,
                collision_probability_pct=round(col_prob, 1),
                risk_level=risk_lvl,
                hazard_score=round(hazard_score, 1),
                closest_approach_point=[round(berg.lat + 0.1, 4), round(berg.lon - 0.1, 4)],
                recommended_action=rec_action
            ))

        # Overall summary
        if highest_hazard >= 65.0:
            overall_lvl = "HIGH"
        elif highest_hazard >= 35.0:
            overall_lvl = "MEDIUM"
        else:
            overall_lvl = "LOW"

        if min_cpa == 9999.0:
            min_cpa = 45.0
            tcpa_for_min_cpa = "36h 00m"

        return NavigationRiskSummary(
            overall_risk_level=overall_lvl,
            composite_risk_score=round(highest_hazard, 1),
            collision_probability_pct=round(detailed_threats[0].collision_probability_pct if detailed_threats else 5.0, 1),
            closest_approach_km=round(min_cpa, 1),
            time_to_closest_approach=tcpa_for_min_cpa,
            target_iceberg_id=primary_threat_id,
            target_iceberg_name=primary_threat_name,
            active_alerts=alerts,
            detailed_threats=sorted(detailed_threats, key=lambda x: x.hazard_score, reverse=True)
        )

risk_engine = NavigationRiskEngine()
