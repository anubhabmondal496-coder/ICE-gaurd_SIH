import pytest
from app.services.route_optimizer import route_optimizer

def test_route_planner_comparison():
    res = route_optimizer.plan_routes(
        origin_name="Open Ocean",
        origin_lat=-62.50,
        origin_lon=15.00,
        dest_name="Maitri Coast",
        dest_lat=-69.82,
        dest_lon=11.21
    )
    assert len(res.routes) >= 3
    rec_route = next(r for r in res.routes if r.is_recommended)
    direct_route = next(r for r in res.routes if r.route_type == "DIRECT_PLANNED")
    
    assert rec_route.risk_reduction_pct > 50.0
    assert rec_route.composite_risk_score < direct_route.composite_risk_score
    assert len(rec_route.waypoints) > 0
    assert len(rec_route.path_coordinates) > 0
