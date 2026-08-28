from typing import List, Optional, Dict
from app.models.iceberg import Iceberg, IcebergHistoricalPoint
from app.services.drift_engine import drift_engine
from app.services.environmental_service import environmental_service

class IcebergService:
    """
    Iceberg repository and telemetry manager with USNIC/Sentinel-1 tracks.
    """
    def __init__(self):
        self._icebergs: Dict[str, Iceberg] = {}
        self._initialize_icebergs()

    def _initialize_icebergs(self):
        raw_icebergs = [
            {
                "id": "A76C",
                "name": "Iceberg A-76C",
                "lat": -64.23,
                "lon": 45.72,
                "size_category": "Mega",
                "length_km": 17.5,
                "width_km": 8.2,
                "area_sq_km": 143.5,
                "thickness_m": 220.0,
                "mass_megatons": 28400.0,
                "risk_level": "HIGH",
                "source": "USNIC / Sentinel-1 SAR",
                "last_updated": "2026-08-28 09:30 UTC",
                "notes": "Drifting Northwest towards Princess Astrid shipping corridor. Potential encounter with Maitri supply route.",
                "history": [
                    {"timestamp_offset_hours": -48, "lat": -64.75, "lon": 44.90},
                    {"timestamp_offset_hours": -36, "lat": -64.62, "lon": 45.12},
                    {"timestamp_offset_hours": -24, "lat": -64.48, "lon": 45.35},
                    {"timestamp_offset_hours": -12, "lat": -64.35, "lon": 45.52},
                    {"timestamp_offset_hours": 0, "lat": -64.23, "lon": 45.72}
                ]
            },
            {
                "id": "A23A",
                "name": "Iceberg A-23A",
                "lat": -60.85,
                "lon": -48.30,
                "size_category": "Mega",
                "length_km": 68.0,
                "width_km": 42.0,
                "area_sq_km": 2856.0,
                "thickness_m": 310.0,
                "mass_megatons": 796000.0,
                "risk_level": "CRITICAL",
                "source": "USNIC / MODIS Aqua",
                "last_updated": "2026-08-28 08:45 UTC",
                "notes": "World's largest free-drifting iceberg navigating Weddell Sea gyre into Scotia Sea. Massive radar hazard.",
                "history": [
                    {"timestamp_offset_hours": -48, "lat": -61.40, "lon": -49.10},
                    {"timestamp_offset_hours": -36, "lat": -61.25, "lon": -48.90},
                    {"timestamp_offset_hours": -24, "lat": -61.10, "lon": -48.70},
                    {"timestamp_offset_hours": -12, "lat": -60.98, "lon": -48.50},
                    {"timestamp_offset_hours": 0, "lat": -60.85, "lon": -48.30}
                ]
            },
            {
                "id": "D28",
                "name": "Iceberg D-28",
                "lat": -65.10,
                "lon": 78.40,
                "size_category": "Large",
                "length_km": 32.0,
                "width_km": 14.5,
                "area_sq_km": 464.0,
                "thickness_m": 210.0,
                "mass_megatons": 87600.0,
                "risk_level": "MEDIUM",
                "source": "Sentinel-1 SAR / NIC",
                "last_updated": "2026-08-28 09:15 UTC",
                "notes": "Calved from Amery Ice Shelf, currently drifting along Antarctic coastal current near Prydz Bay.",
                "history": [
                    {"timestamp_offset_hours": -48, "lat": -65.50, "lon": 79.20},
                    {"timestamp_offset_hours": -24, "lat": -65.30, "lon": 78.80},
                    {"timestamp_offset_hours": 0, "lat": -65.10, "lon": 78.40}
                ]
            },
            {
                "id": "B15Y",
                "name": "Iceberg B-15Y (Remnant)",
                "lat": -63.45,
                "lon": 12.80,
                "size_category": "Medium",
                "length_km": 8.4,
                "width_km": 4.1,
                "area_sq_km": 34.4,
                "thickness_m": 160.0,
                "mass_megatons": 4950.0,
                "risk_level": "HIGH",
                "source": "USNIC / RADARSAT",
                "last_updated": "2026-08-28 09:00 UTC",
                "notes": "Fast-moving fragment directly in the approach zone to Maitri Coast.",
                "history": [
                    {"timestamp_offset_hours": -48, "lat": -63.95, "lon": 13.50},
                    {"timestamp_offset_hours": -24, "lat": -63.70, "lon": 13.15},
                    {"timestamp_offset_hours": 0, "lat": -63.45, "lon": 12.80}
                ]
            },
            {
                "id": "C19C",
                "name": "Iceberg C-19C",
                "lat": -66.80,
                "lon": 142.20,
                "size_category": "Medium",
                "length_km": 11.2,
                "width_km": 5.8,
                "area_sq_km": 65.0,
                "thickness_m": 190.0,
                "mass_megatons": 11100.0,
                "risk_level": "LOW",
                "source": "Sentinel-1 SAR",
                "last_updated": "2026-08-28 07:30 UTC",
                "notes": "Trapped in coastal fast ice near Adelie Land. Minimal short-term drift.",
                "history": [
                    {"timestamp_offset_hours": -48, "lat": -66.82, "lon": 142.25},
                    {"timestamp_offset_hours": 0, "lat": -66.80, "lon": 142.20}
                ]
            },
            {
                "id": "A74B",
                "name": "Iceberg A-74B",
                "lat": -74.90,
                "lon": -26.50,
                "size_category": "Large",
                "length_km": 24.0,
                "width_km": 12.0,
                "area_sq_km": 288.0,
                "thickness_m": 240.0,
                "mass_megatons": 62200.0,
                "risk_level": "LOW",
                "source": "USNIC / Landsat-9",
                "last_updated": "2026-08-28 08:00 UTC",
                "notes": "Brunt Ice Shelf sector, grounded against McDonald Ice Rumples.",
                "history": [
                    {"timestamp_offset_hours": -48, "lat": -74.92, "lon": -26.55},
                    {"timestamp_offset_hours": 0, "lat": -74.90, "lon": -26.50}
                ]
            }
        ]

        for item in raw_icebergs:
            env = environmental_service.get_conditions_at(item["lat"], item["lon"])
            speed_knots, heading_deg = drift_engine.compute_drift_vector(
                current_speed_ms=env.ocean_current.speed_ms,
                current_dir_deg=env.ocean_current.direction_deg,
                wind_speed_ms=env.surface_wind.speed_ms,
                wind_dir_deg=env.surface_wind.direction_deg,
                sea_ice_pct=env.sea_ice_concentration_pct,
                iceberg_mass_mt=item["mass_megatons"],
                iceberg_area_sq_km=item["area_sq_km"]
            )
            
            preds = drift_engine.predict_trajectory(
                start_lat=item["lat"],
                start_lon=item["lon"],
                drift_speed_knots=speed_knots,
                drift_heading_deg=heading_deg,
                horizons_hours=[6, 12, 24, 48],
                iceberg_mass_mt=item["mass_megatons"]
            )

            hist_pts = [
                IcebergHistoricalPoint(
                    timestamp_offset_hours=h["timestamp_offset_hours"],
                    lat=h["lat"],
                    lon=h["lon"]
                ) for h in item["history"]
            ]

            iceberg = Iceberg(
                id=item["id"],
                name=item["name"],
                lat=item["lat"],
                lon=item["lon"],
                size_category=item["size_category"],
                length_km=item["length_km"],
                width_km=item["width_km"],
                area_sq_km=item["area_sq_km"],
                thickness_m=item["thickness_m"],
                mass_megatons=item["mass_megatons"],
                drift_speed_knots=speed_knots,
                drift_heading_deg=heading_deg,
                risk_level=item["risk_level"],
                source=item["source"],
                last_updated=item["last_updated"],
                notes=item["notes"],
                historical_track=hist_pts,
                predictions=preds
            )
            self._icebergs[iceberg.id] = iceberg

    def get_all_icebergs(self) -> List[Iceberg]:
        return list(self._icebergs.values())

    def get_iceberg_by_id(self, iceberg_id: str) -> Optional[Iceberg]:
        return self._icebergs.get(iceberg_id.upper())

    def recalculate_predictions(self, iceberg_id: str) -> Optional[Iceberg]:
        iceberg = self._icebergs.get(iceberg_id.upper())
        if not iceberg:
            return None
        env = environmental_service.get_conditions_at(iceberg.lat, iceberg.lon)
        speed_knots, heading_deg = drift_engine.compute_drift_vector(
            current_speed_ms=env.ocean_current.speed_ms,
            current_dir_deg=env.ocean_current.direction_deg,
            wind_speed_ms=env.surface_wind.speed_ms,
            wind_dir_deg=env.surface_wind.direction_deg,
            sea_ice_pct=env.sea_ice_concentration_pct,
            iceberg_mass_mt=iceberg.mass_megatons,
            iceberg_area_sq_km=iceberg.area_sq_km
        )
        iceberg.drift_speed_knots = speed_knots
        iceberg.drift_heading_deg = heading_deg
        iceberg.predictions = drift_engine.predict_trajectory(
            start_lat=iceberg.lat,
            start_lon=iceberg.lon,
            drift_speed_knots=speed_knots,
            drift_heading_deg=heading_deg,
            horizons_hours=[6, 12, 24, 48],
            iceberg_mass_mt=iceberg.mass_megatons
        )
        return iceberg

iceberg_service = IcebergService()
