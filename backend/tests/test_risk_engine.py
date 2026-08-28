import pytest
from app.models.vessel import Vessel
from app.services.risk_engine import risk_engine
from app.utils.geo_math import compute_cpa_tcpa

def test_cpa_tcpa_calculation():
    # Vessel heading South, Iceberg heading North-East on intercept
    cpa_km, tcpa_hours = compute_cpa_tcpa(
        vessel_lat=-62.50,
        vessel_lon=15.00,
        vessel_speed_knots=12.0,
        vessel_heading_deg=180.0,
        iceberg_lat=-64.00,
        iceberg_lon=15.20,
        iceberg_speed_knots=0.5,
        iceberg_heading_deg=45.0
    )
    assert cpa_km >= 0.0
    assert tcpa_hours >= 0.0

def test_vessel_risk_evaluation():
    vessel = Vessel(
        current_lat=-64.20,
        current_lon=45.60,
        speed_knots=12.4,
        heading_deg=165.0
    )
    summary = risk_engine.evaluate_vessel_risk(vessel)
    assert summary.overall_risk_level in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert 0.0 <= summary.composite_risk_score <= 100.0
    assert len(summary.detailed_threats) > 0
