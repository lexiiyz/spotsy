from fastapi import APIRouter, Query
from typing import List
from app.schemas.places import PlaceItem
from app.services.places_service import search_places

router = APIRouter()

@router.get("/places/search", response_model=List[PlaceItem])
async def search_places_endpoint(
    query: str = Query(..., description="Search query string"),
    lat: float = Query(-7.2754, description="User latitude"),
    lng: float = Query(112.7912, description="User longitude")
):
    """Search candidate places by query and location."""
    return await search_places(query, lat, lng)
