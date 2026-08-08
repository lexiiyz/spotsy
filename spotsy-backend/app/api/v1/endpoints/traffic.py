from fastapi import APIRouter
from app.schemas.traffic import TrafficRouteRequest, RouteTrafficInfo
from app.services.traffic_service import get_traffic_route

router = APIRouter()

@router.post("/traffic", response_model=RouteTrafficInfo)
async def get_traffic_route_endpoint(request: TrafficRouteRequest):
    """Calculate distance, ETA in traffic, and congestion status."""
    return get_traffic_route(request.origin, request.destination)
