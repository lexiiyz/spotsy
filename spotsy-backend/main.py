from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(
    title="Spotsy Busyness Microservice",
    description="Microservice for fetching live & historical busyness indicators",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PopularTimeHour(BaseModel):
    hour: int
    occupancy_percent: int


class PopularTimeDay(BaseModel):
    day: str
    data: List[int]


class BusynessData(BaseModel):
    is_live_available: bool
    current_popularity: int
    busyness_status: str  # "Quiet", "Moderate", "Busy", "Very Busy"
    typical_popular_times: List[PopularTimeDay]


class BusynessResponse(BaseModel):
    status: str
    place_id: str
    data: BusynessData
    fetched_at: str


# Mock dataset for popular places
MOCK_BUSYNESS_DB = {
    "place_1": {
        "is_live_available": True,
        "current_popularity": 25,
        "busyness_status": "Quiet",
    },
    "place_2": {
        "is_live_available": True,
        "current_popularity": 55,
        "busyness_status": "Moderate",
    },
    "place_3": {
        "is_live_available": True,
        "current_popularity": 85,
        "busyness_status": "Busy",
    },
    "place_4": {
        "is_live_available": False,
        "current_popularity": 30,
        "busyness_status": "Quiet",
    },
    "place_5": {
        "is_live_available": True,
        "current_popularity": 90,
        "busyness_status": "Very Busy",
    },
}

MOCK_HOURLY_PATTERN = [
    0, 0, 0, 0, 0, 0, 10, 25, 45, 60, 50, 40,
    35, 30, 40, 55, 70, 85, 80, 65, 45, 20, 0, 0
]

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def get_busyness_status(popularity: int) -> str:
    if popularity < 35:
        return "Quiet"
    elif popularity < 65:
        return "Moderate"
    elif popularity < 85:
        return "Busy"
    else:
        return "Very Busy"


@app.get("/")
def read_root():
    return {
        "service": "Spotsy Busyness Microservice",
        "status": "online",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/v1/busyness", response_model=BusynessResponse)
def get_busyness(place_id: str = Query(..., description="ID of the place")):
    mock_entry = MOCK_BUSYNESS_DB.get(place_id)
    
    if mock_entry:
        is_live = mock_entry["is_live_available"]
        popularity = mock_entry["current_popularity"]
        status = mock_entry["busyness_status"]
    else:
        # Fallback dynamic mock based on place_id hash
        hash_val = sum(ord(c) for c in place_id)
        popularity = (hash_val * 7) % 95 + 5
        is_live = (hash_val % 2) == 0
        status = get_busyness_status(popularity)

    typical_popular_times = [
        PopularTimeDay(day=day, data=MOCK_HOURLY_PATTERN) for day in DAYS_OF_WEEK
    ]

    return BusynessResponse(
        status="success",
        place_id=place_id,
        data=BusynessData(
            is_live_available=is_live,
            current_popularity=popularity,
            busyness_status=status,
            typical_popular_times=typical_popular_times
        ),
        fetched_at=datetime.now().isoformat()
    )