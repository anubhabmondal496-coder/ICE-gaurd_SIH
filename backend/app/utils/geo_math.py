import math
from typing import Tuple, List, Dict, Any

# Earth radius in kilometers
EARTH_RADIUS_KM = 6371.0
EARTH_ANGULAR_VELOCITY = 7.2921159e-5  # rad/s

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points in km."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_KM * c

def calculate_bearing_deg(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the initial bearing from point 1 to point 2 in degrees (0..360)."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)

    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    bearing = math.degrees(math.atan2(y, x))
    return (bearing + 360.0) % 360.0

def destination_point(lat: float, lon: float, distance_km: float, bearing_deg: float) -> Tuple[float, float]:
    """Calculate destination point given starting point, distance in km, and bearing in degrees."""
    phi1 = math.radians(lat)
    lambda1 = math.radians(lon)
    theta = math.radians(bearing_deg)
    delta = distance_km / EARTH_RADIUS_KM

    phi2 = math.asin(math.sin(phi1) * math.cos(delta) + math.cos(phi1) * math.sin(delta) * math.cos(theta))
    lambda2 = lambda1 + math.atan2(
        math.sin(theta) * math.sin(delta) * math.cos(phi1),
        math.cos(delta) - math.sin(phi1) * math.sin(phi2)
    )

    lat2 = math.degrees(phi2)
    lon2 = (math.degrees(lambda2) + 540.0) % 360.0 - 180.0
    return lat2, lon2

def coriolis_parameter(lat: float) -> float:
    """Coriolis parameter f = 2 * Omega * sin(latitude)."""
    return 2.0 * EARTH_ANGULAR_VELOCITY * math.sin(math.radians(lat))

def compute_cpa_tcpa(
    vessel_lat: float, vessel_lon: float, vessel_speed_knots: float, vessel_heading_deg: float,
    iceberg_lat: float, iceberg_lon: float, iceberg_speed_knots: float, iceberg_heading_deg: float
) -> Tuple[float, float]:
    """
    Compute Closest Point of Approach (CPA in km) and Time to CPA (TCPA in hours).
    Assumes constant velocity vectors over a local Cartesian projection.
    """
    # Convert speeds from knots to km/h (1 knot = 1.852 km/h)
    v_vessel_kmh = vessel_speed_knots * 1.852
    v_ice_kmh = iceberg_speed_knots * 1.852

    # Relative coordinates (x: East km, y: North km) relative to vessel
    # 1 deg lat ~ 111.12 km, 1 deg lon ~ 111.12 * cos(lat) km
    mid_lat = (vessel_lat + iceberg_lat) / 2.0
    dx = (iceberg_lon - vessel_lon) * 111.12 * math.cos(math.radians(mid_lat))
    dy = (iceberg_lat - vessel_lat) * 111.12

    # Velocity components (East = x, North = y)
    # Heading 0 = North (y+), 90 = East (x+)
    vx_vessel = v_vessel_kmh * math.sin(math.radians(vessel_heading_deg))
    vy_vessel = v_vessel_kmh * math.cos(math.radians(vessel_heading_deg))

    vx_ice = v_ice_kmh * math.sin(math.radians(iceberg_heading_deg))
    vy_ice = v_ice_kmh * math.cos(math.radians(iceberg_heading_deg))

    # Relative velocity of iceberg relative to vessel
    # When vessel approaches iceberg, rx_dot = vx_ice - vx_vessel
    vrx = vx_ice - vx_vessel
    vry = vy_ice - vy_vessel
    vr_sq = vrx * vrx + vry * vry

    current_dist = math.sqrt(dx * dx + dy * dy)

    if vr_sq < 1e-6:
        # Stationary relative movement
        return current_dist, 0.0

    # TCPA = - (r . vr) / |vr|^2
    # r = (dx, dy)
    r_dot_vr = dx * vrx + dy * vry
    tcpa_hours = - r_dot_vr / vr_sq

    if tcpa_hours < 0:
        # Diverging, closest point is in the past or right now
        cpa_km = current_dist
        tcpa_hours = 0.0
    else:
        cpa_x = dx + vrx * tcpa_hours
        cpa_y = dy + vry * tcpa_hours
        cpa_km = math.sqrt(cpa_x * cpa_x + cpa_y * cpa_y)

    return round(cpa_km, 2), round(tcpa_hours, 2)
