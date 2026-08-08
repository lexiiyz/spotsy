from pydantic import BaseModel
from typing import List, Optional

class PopularTimeDay(BaseModel):
    day: str
    data: List[int]

class BusynessData(BaseModel):
    is_live_available: bool
    current_popularity: int
    busyness_status: str
    typical_popular_times: List[PopularTimeDay]

class BusynessResponse(BaseModel):
    status: str = "success"
    place_id: str
    data: BusynessData
    fetched_at: str
