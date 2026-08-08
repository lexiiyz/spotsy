import math
import httpx
import asyncio
from app.schemas.traffic import LocationCoords, RouteTrafficInfo

def calculate_haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate Great Circle distance between two points in kilometers."""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

async def get_traffic_route_async(origin: LocationCoords, destination: LocationCoords) -> RouteTrafficInfo:
    """Calculate real road network distance & travel time using OSRM Routing Engine."""
    try:
        osrm_url = f"http://router.project-osrm.org/route/v1/driving/{origin.lng},{origin.lat};{destination.lng},{destination.lat}?overview=false"
        async with httpx.AsyncClient(timeout=4.0) as client:
            res = await client.get(osrm_url)
            if res.status_code == 200:
                data = res.json()
                routes = data.get("routes", [])
                if routes:
                    dist_meters = routes[0].get("distance", 0)
                    duration_sec = routes[0].get("duration", 0)

                    dist_km = round(dist_meters / 1000.0, 1)
                    duration_mins = max(1, round(duration_sec / 60.0))

                    if duration_mins <= 10:
                        condition = "Lancar"
                    elif duration_mins <= 25:
                        condition = "Sedang"
                    else:
                        condition = "Padat Merayap"

                    return RouteTrafficInfo(
                        distance_km=dist_km,
                        duration_in_traffic_mins=duration_mins,
                        traffic_condition=condition
                    )
    except Exception as e:
        print(f"Warning: OSRM Routing API failed ({e}), using Haversine calculation fallback.")

    return get_traffic_route(origin, destination)

def get_traffic_route(origin: LocationCoords, destination: LocationCoords) -> RouteTrafficInfo:
    """Fallback Haversine travel time calculation."""
    dist = calculate_haversine_distance_km(origin.lat, origin.lng, destination.lat, destination.lng)
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
