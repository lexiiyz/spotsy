import math
from app.schemas.traffic import LocationCoords, RouteTrafficInfo

def calculate_haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the Great Circle distance between two points in kilometers."""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def get_traffic_route(origin: LocationCoords, destination: LocationCoords) -> RouteTrafficInfo:
    """Calculate distance, ETA in traffic, and traffic conditions."""
    dist = calculate_haversine_distance_km(origin.lat, origin.lng, destination.lat, destination.lng)

    # Estimate travel time based on average speed (e.g. 25 km/h city speed)
    base_duration_mins = max(3, round((dist / 25.0) * 60))

    if dist < 2.0:
        condition = "Lancar"
        traffic_duration = base_duration_mins
    elif dist < 5.0:
        condition = "Sedang"
        traffic_duration = base_duration_mins + 3
    else:
        condition = "Padat Merayap"
        traffic_duration = base_duration_mins + 7

    return RouteTrafficInfo(
        distance_km=dist,
        duration_in_traffic_mins=traffic_duration,
        traffic_condition=condition
    )
