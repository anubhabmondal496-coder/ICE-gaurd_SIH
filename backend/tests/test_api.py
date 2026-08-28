import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["system"] == "ICEGUARD AI"
    assert response.json()["status"] == "ONLINE"

def test_icebergs_endpoint():
    response = client.get("/api/v1/icebergs")
    assert response.status_code == 200
    icebergs = response.json()
    assert len(icebergs) >= 5
    assert any(b["id"] == "A76C" for b in icebergs)

def test_environment_endpoint():
    response = client.get("/api/v1/environment?lat=-64.23&lon=45.72")
    assert response.status_code == 200
    data = response.json()
    assert "ocean_current" in data
    assert "surface_wind" in data
    assert "sea_ice_concentration_pct" in data

def test_risk_endpoint():
    response = client.get("/api/v1/risk")
    assert response.status_code == 200
    data = response.json()
    assert "overall_risk_level" in data
    assert "composite_risk_score" in data

def test_routes_endpoint():
    response = client.get("/api/v1/routes")
    assert response.status_code == 200
    data = response.json()
    assert len(data["routes"]) >= 3
    assert data["best_route_id"] == "route-rec-a"

def test_satellite_endpoint():
    res_passes = client.get("/api/v1/satellite/sar-passes")
    assert res_passes.status_code == 200
    assert len(res_passes.json()) >= 2

    res_sources = client.get("/api/v1/satellite/data-sources")
    assert res_sources.status_code == 200
    assert len(res_sources.json()) >= 5
