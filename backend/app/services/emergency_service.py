import uuid
from datetime import datetime, timezone
from typing import List
from app.models.emergency import SOSDistressRequest, SOSDistressResponse, NearestRescueAsset
from app.utils.geo_math import haversine_distance_km
from app.services.fleet_service import fleet_service

class EmergencyService:
    """
    Handles emergency distress beacons, GMDSS packet generation,
    and Search and Rescue (SAR) asset dispatch calculations.
    """
    def __init__(self):
        # Indian Antarctic Stations & Logistics coordinates
        self.stations = [
            {"name": "Maitri Research Station (India)", "lat": -70.766, "lon": 11.736, "freq": "VHF Ch 16 / HF 8291 kHz"},
            {"name": "Bharati Research Station (India)", "lat": -69.408, "lon": 76.187, "freq": "VHF Ch 16 / Iridium Primary"},
            {"name": "Princess Astrid Logistics Fast-Ice Depot", "lat": -69.820, "lon": 11.210, "freq": "Marine VHF Ch 16"},
            {"name": "Neumayer-Station III (Germany)", "lat": -70.670, "lon": -8.270, "freq": "VHF Ch 16 / MF 2182 kHz"}
        ]

    def trigger_sos(self, req: SOSDistressRequest) -> SOSDistressResponse:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        distress_id = f"SOS-ANT-{uuid.uuid4().hex[:6].upper()}"

        # 1. Find nearest station
        nearest_station = None
        min_dist_station = 99999.0
        for st in self.stations:
            d = haversine_distance_km(req.lat, req.lon, st["lat"], st["lon"])
            if d < min_dist_station:
                min_dist_station = d
                nearest_station = st

        # 2. Find nearest rescue fleet vessels
        rescue_assets: List[NearestRescueAsset] = []
        # Add nearest station team
        if nearest_station:
            rescue_assets.append(NearestRescueAsset(
                asset_name=f"{nearest_station['name']} SAR Team",
                asset_type="STATION",
                distance_km=round(min_dist_station, 1),
                estimated_transit_hours=round(min_dist_station / 35.0, 1),  # Snowcat / Helicopter transit
                contact_freq=nearest_station["freq"]
            ))

        # Check surrounding vessels
        for v in fleet_service.get_all_vessels():
            if v.id != req.vessel_id:
                d_vessel = haversine_distance_km(req.lat, req.lon, v.current_lat, v.current_lon)
                if d_vessel < 800.0:  # Within 800 km
                    speed = max(8.0, v.speed_knots * 1.852)
                    rescue_assets.append(NearestRescueAsset(
                        asset_name=f"{v.name} ({v.ice_class})",
                        asset_type="ICEBREAKER",
                        distance_km=round(d_vessel, 1),
                        estimated_transit_hours=round(d_vessel / speed, 1),
                        contact_freq="VHF Ch 16 / GMDSS DSC 2187.5 kHz"
                    ))

        # Sort rescue assets by distance
        rescue_assets.sort(key=lambda x: x.distance_km)

        # 3. Format official GMDSS distress message
        lat_dir = "S" if req.lat < 0 else "N"
        lon_dir = "E" if req.lon >= 0 else "W"
        pos_str = f"{abs(req.lat):.2f}° {lat_dir}, {abs(req.lon):.2f}° {lon_dir}"

        gmdss_msg = (
            f"MAYDAY MAYDAY MAYDAY\n"
            f"THIS IS {req.vessel_name.upper()}\n"
            f"DISTRESS ID: {distress_id}\n"
            f"POSITION: {pos_str}\n"
            f"NATURE OF DISTRESS: {req.distress_nature.replace('_', ' ')}\n"
            f"PERSONS ON BOARD: {req.pob}\n"
            f"NEAREST BASE: {nearest_station['name']} ({min_dist_station:.1f} KM)\n"
            f"IRIDIUM / GMDSS BROADCAST ACTIVE TO NCPOR GOA MRCC"
        )

        return SOSDistressResponse(
            distress_id=distress_id,
            broadcast_timestamp_utc=now_str,
            vessel_name=req.vessel_name,
            coordinates=[req.lat, req.lon],
            status="ACTIVE_BROADCAST",
            gmdss_message=gmdss_msg,
            nearest_station=nearest_station["name"],
            distance_to_nearest_station_km=round(min_dist_station, 1),
            nearest_rescue_assets=rescue_assets,
            recommended_safety_protocol="Activate EPIRB, power down non-essential systems, prepare survival suits and lifeboats, maintain continuous watch on VHF Ch 16."
        )

emergency_service = EmergencyService()
