from fastapi import APIRouter, Query
from typing import List, Optional
from app.schemas.places import PlaceItem
from app.services.places_service import search_places

router = APIRouter()

@router.get("/places/search", response_model=List[PlaceItem])
async def search_places_endpoint(
    query: str = Query("", description="Search query string"),
    lat: Optional[float] = Query(None, description="Dynamic user latitude from browser GPS"),
    lng: Optional[float] = Query(None, description="Dynamic user longitude from browser GPS")
):
    """Search candidate places dynamically by query and user GPS coordinates."""
    # Use default Surabaya coordinates only if browser GPS is not provided
    user_lat = lat if lat is not None else -7.2754
    user_lng = lng if lng is not None else 112.7912
    return await search_places(query, user_lat, user_lng)
