from pydantic import BaseModel

class LocationCoords(BaseModel):
    lat: float
    lng: float

class TrafficRouteRequest(BaseModel):
    origin: LocationCoords
    destination: LocationCoords

class RouteTrafficInfo(BaseModel):
    distance_km: float
    duration_in_traffic_mins: int
    traffic_condition: str
