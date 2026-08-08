import datetime
import asyncio
from typing import Dict
from sqlalchemy import text
from app.db.postgres import AsyncSessionLocal
from app.schemas.busyness import BusynessData, PopularTimeDay, BusynessResponse

# Popular times mock data per day
DEFAULT_POPULAR_TIMES = [
    PopularTimeDay(
        day="Saturday",
        data=[0, 0, 0, 10, 25, 40, 75, 80, 60, 30, 0, 0]
    )
]

MOCK_POPULARITY_MAP: Dict[str, int] = {
    "place-001": 25,  # Quiet
    "place-002": 45,  # Moderate
    "place-003": 80,  # Busy
    "place-004": 30,  # Quiet
    "place-005": 90,  # Very Busy
}

async def get_busyness(place_id: str) -> BusynessResponse:
    """Fetch live or typical busyness data for a place with 3s timeout limit."""
    try:
        # Enforce 3-second maximum execution timeout per PRD Section 8.2
        return await asyncio.wait_for(_fetch_busyness_internal(place_id), timeout=3.0)
    except asyncio.TimeoutError:
        print(f"Warning: Busyness fetch timed out for {place_id}, using historical fallback.")
        return _get_fallback_busyness(place_id)
    except Exception as e:
        print(f"Warning: Busyness fetch failed for {place_id} ({e}), using fallback.")
        return _get_fallback_busyness(place_id)

async def _fetch_busyness_internal(place_id: str) -> BusynessResponse:
    # Try querying DB place_cache popular_times_json if available
    try:
        async with AsyncSessionLocal() as session:
            sql = text("SELECT popular_times_json FROM place_cache WHERE place_id = :pid")
            res = await session.execute(sql, {"pid": place_id})
            row = res.fetchone()
            if row and row.popular_times_json:
                pop_times = [PopularTimeDay(**item) for item in row.popular_times_json]
            else:
                pop_times = DEFAULT_POPULAR_TIMES
    except Exception:
        pop_times = DEFAULT_POPULAR_TIMES

    pop_val = MOCK_POPULARITY_MAP.get(place_id, 35)

    status_label = "Sepi"
    if pop_val >= 70:
        status_label = "Ramai"
    elif pop_val >= 40:
        status_label = "Sedang"

    data = BusynessData(
        is_live_available=True,
        current_popularity=pop_val,
        busyness_status=status_label,
        typical_popular_times=pop_times,
    )

    return BusynessResponse(
        status="success",
        place_id=place_id,
        data=data,
        fetched_at=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )

def _get_fallback_busyness(place_id: str) -> BusynessResponse:
    pop_val = MOCK_POPULARITY_MAP.get(place_id, 35)
    return BusynessResponse(
        status="fallback",
        place_id=place_id,
        data=BusynessData(
            is_live_available=False,
            current_popularity=pop_val,
            busyness_status="Data Historis",
            typical_popular_times=DEFAULT_POPULAR_TIMES,
        ),
        fetched_at=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )
