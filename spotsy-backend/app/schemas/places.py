from pydantic import BaseModel, Field
from typing import Optional, List

class PlaceItem(BaseModel):
    place_id: str
    name: str
    category: str
    area: str
    address: str
    latitude: float
    longitude: float
    rating: float = 4.5
    price_level: str = "$$"
    wifi_available: bool = True
    power_outlets: bool = True
    noise_level: str = "Quiet"
    opening_hours: str = "08:00 - 23:00"

class PlaceSearchRequest(BaseModel):
    query: str
    latitude: float = -7.2754
    longitude: float = 112.7912
    category: Optional[str] = None
