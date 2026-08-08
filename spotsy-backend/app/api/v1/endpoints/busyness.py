from fastapi import APIRouter, Query
from app.schemas.busyness import BusynessResponse
from app.services.busyness_service import get_busyness

router = APIRouter()

@router.get("/busyness", response_model=BusynessResponse)
async def get_place_busyness(place_id: str = Query(..., description="Place ID to fetch busyness for")):
    """Get live or typical busyness data for a place."""
    return await get_busyness(place_id)
