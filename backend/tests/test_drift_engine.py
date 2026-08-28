import pytest
from app.services.drift_engine import drift_engine

def test_drift_vector_computation():
    speed_knots, heading_deg = drift_engine.compute_drift_vector(
        current_speed_ms=0.32,
        current_dir_deg=37.0,
        wind_speed_ms=7.2,
        wind_dir_deg=41.0,
        sea_ice_pct=72.0,
        iceberg_mass_mt=28400.0,
        iceberg_area_sq_km=143.5
    )
    assert speed_knots > 0.0
    assert 0.0 <= heading_deg <= 360.0

def test_trajectory_predictions_horizons():
    preds = drift_engine.predict_trajectory(
        start_lat=-64.23,
        start_lon=45.72,
        drift_speed_knots=0.25,
        drift_heading_deg=37.0,
        horizons_hours=[6, 12, 24, 48]
    )
    assert len(preds) == 4
    assert preds[0].horizon_hours == 6
    assert preds[3].horizon_hours == 48
    # Uncertainty and position error should grow with time
    assert preds[0].position_error_km < preds[3].position_error_km
    assert preds[0].uncertainty.semi_major_km < preds[3].uncertainty.semi_major_km
    # Confidence decays over time
    assert preds[0].confidence_pct > preds[3].confidence_pct
