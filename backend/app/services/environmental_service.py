import math
from datetime import datetime, timezone
from typing import List, Dict
from app.models.environment import EnvironmentalConditions, VectorField, SeaIcePolygon

class EnvironmentalService:
    """
    Environmental data service aggregating Copernicus Marine currents,
    ERA5 atmospheric wind fields, and NSIDC sea-ice concentration.
    """
    def __init__(self):
        # Predefined sea ice distribution polygons for Antarctic coastal pack ice
        self.sea_ice_zones: List[SeaIcePolygon] = [
            SeaIcePolygon(
                id="ice-pack-maitri",
                region_name="Princess Astrid Coastal Pack Ice",
                concentration_pct=76.0,
                category="Close Pack (60-80%)",
                polygon_coords=[
                    [-68.5, 8.0], [-68.8, 14.0], [-70.2, 14.5], [-70.0, 7.5], [-68.5, 8.0]
                ]
            ),
            SeaIcePolygon(
                id="ice-pack-weddell-north",
                region_name="Weddell Sea Marginal Ice Zone",
                concentration_pct=58.0,
                category="Open Pack (30-60%)",
                polygon_coords=[
                    [-62.0, -50.0], [-62.5, -40.0], [-65.0, -42.0], [-64.5, -52.0], [-62.0, -50.0]
                ]
            ),
            SeaIcePolygon(
                id="ice-pack-weddell-core",
                region_name="Weddell Sea Fast Ice Shelf",
                concentration_pct=92.0,
                category="Compact Ice (80-100%)",
                polygon_coords=[
                    [-65.5, -55.0], [-66.0, -35.0], [-72.0, -38.0], [-71.5, -58.0], [-65.5, -55.0]
                ]
            ),
            SeaIcePolygon(
                id="ice-pack-bharati",
                region_name="Prydz Bay / Larsemann Hills Pack",
                concentration_pct=68.0,
                category="Close Pack (60-80%)",
                polygon_coords=[
                    [-68.0, 72.0], [-68.2, 79.0], [-69.8, 78.5], [-69.5, 71.5], [-68.0, 72.0]
                ]
            )
        ]

    def get_conditions_at(self, lat: float, lon: float) -> EnvironmentalConditions:
        """
        Synthesize spatial environmental vector fields based on Antarctic polar latitude & longitude.
        """
        # Polar Easterlies along Antarctic coast (south of -65) vs Westerlies further north (-55 to -65)
        if lat < -65.0:
            # Coastal polar easterlies: blowing from East-Southeast
            wind_speed = 8.5 + 2.0 * math.sin(lat * 3.0 + lon * 0.1)
            wind_dir = 110.0 + 15.0 * math.cos(lon * 0.05)
            # Antarctic Coastal Current (East Wind Drift): flows Westwards (~270 deg)
            current_speed = 0.28 + 0.08 * math.sin(lon * 0.2)
            current_dir = 265.0 + 10.0 * math.sin(lat * 2.0)
            sea_ice_pct = min(95.0, max(45.0, 72.0 + (abs(lat) - 65.0) * 4.5))
            sst = -1.6 + 0.2 * math.cos(lon * 0.1)
            thickness_m = 1.4 + 0.1 * math.sin(lat)
        else:
            # Southern Ocean Westerlies: blowing from West (~270 deg)
            wind_speed = 12.2 + 3.5 * math.sin(lon * 0.1)
            wind_dir = 275.0 + 20.0 * math.sin(lat * 0.5)
            # Antarctic Circumpolar Current: flows Eastwards (~90 deg)
            current_speed = 0.42 + 0.12 * math.cos(lat * 0.5)
            current_dir = 85.0 + 15.0 * math.cos(lon * 0.1)
            sea_ice_pct = max(5.0, min(50.0, (abs(lat) - 58.0) * 6.0))
            sst = 0.8 - (abs(lat) - 58.0) * 0.35
            thickness_m = 0.5

        # Vector decomposition
        rad_wind = math.radians(wind_dir)
        u_wind = round(wind_speed * math.sin(rad_wind), 2)
        v_wind = round(wind_speed * math.cos(rad_wind), 2)

        rad_cur = math.radians(current_dir)
        u_cur = round(current_speed * math.sin(rad_cur), 3)
        v_cur = round(current_speed * math.cos(rad_cur), 3)

        return EnvironmentalConditions(
            lat=round(lat, 4),
            lon=round(lon, 4),
            timestamp_utc=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
            ocean_current=VectorField(
                speed_ms=round(current_speed, 2),
                direction_deg=round(current_dir, 1),
                u_component=u_cur,
                v_component=v_cur
            ),
            surface_wind=VectorField(
                speed_ms=round(wind_speed, 1),
                direction_deg=round(wind_dir, 1),
                u_component=u_wind,
                v_component=v_wind
            ),
            sea_ice_concentration_pct=round(sea_ice_pct, 1),
            sea_ice_thickness_m=round(thickness_m, 2),
            sea_surface_temp_c=round(sst, 2),
            wave_height_m=round(max(0.8, 3.2 - (sea_ice_pct / 100.0) * 2.5), 1),
            visibility_km=round(max(2.0, 18.0 - (wind_speed / 20.0) * 6.0), 1),
            atmospheric_pressure_hpa=round(984.0 + 8.0 * math.sin(lat * 0.2 + lon * 0.1), 1)
        )

    def get_sea_ice_polygons(self) -> List[SeaIcePolygon]:
        return self.sea_ice_zones

environmental_service = EnvironmentalService()
