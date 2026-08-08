from pydantic import BaseModel
from typing import List, Optional
from app.schemas.places import PlaceItem
from app.schemas.busyness import BusynessData
from app.schemas.traffic import RouteTrafficInfo

class PlaceRecommendationResult(BaseModel):
    place: PlaceItem
    busyness: BusynessData
    traffic: RouteTrafficInfo

class ChatRequest(BaseModel):
    prompt: str
    latitude: float = -7.2754
    longitude: float = 112.7912
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    text: str
    recommendations: List[PlaceRecommendationResult]
    timestamp: str
    session_id: Optional[str] = None
