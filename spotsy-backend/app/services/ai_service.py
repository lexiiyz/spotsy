import datetime
import asyncio
from typing import List, Optional
from app.core.config import settings
from app.schemas.places import PlaceItem
from app.schemas.busyness import BusynessData, PopularTimeDay
from app.schemas.traffic import LocationCoords, RouteTrafficInfo
from app.schemas.chat import ChatResponse, PlaceRecommendationResult
from app.services.places_service import search_places
from app.services.busyness_service import get_busyness
from app.services.traffic_service import get_traffic_route

async def process_chat_query(prompt: str, lat: float, lng: float, session_id: Optional[str] = None) -> ChatResponse:
    """Orchestrate search_places, get_busyness, and get_traffic_route tool execution."""
    # Step 1: Search candidate places
    places: List[PlaceItem] = await search_places(prompt, lat, lng)

    # Step 2: Parallel execution of get_busyness & get_traffic_route
    user_coords = LocationCoords(lat=lat, lng=lng)

    async def _fetch_place_details(place: PlaceItem) -> PlaceRecommendationResult:
        dest_coords = LocationCoords(lat=place.latitude, lng=place.longitude)
        
        # Parallel sub-tasks
        busyness_task = asyncio.create_task(get_busyness(place.place_id))
        traffic_info = get_traffic_route(user_coords, dest_coords)
        
        busyness_res = await busyness_task
        
        return PlaceRecommendationResult(
            place=place,
            busyness=busyness_res.data,
            traffic=traffic_info
        )

    # Execute all place details fetching in parallel
    recommendations: List[PlaceRecommendationResult] = await asyncio.gather(
        *[_fetch_place_details(p) for p in places]
    )

    # Step 3: Sort recommendations (prioritize Quiet / low popularity & short ETA)
    recommendations.sort(
        key=lambda r: (r.busyness.current_popularity * 0.7) + (r.traffic.duration_in_traffic_mins * 0.3)
    )

    quiet_count = sum(1 for r in recommendations if r.busyness.current_popularity < 40)

    # Step 4: AI Text Generation (Groq / OpenAI / Smart Synthesis)
    summary_text = await _generate_llm_summary(prompt, recommendations, quiet_count)

    return ChatResponse(
        text=summary_text,
        recommendations=recommendations,
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        session_id=session_id
    )

async def _generate_llm_summary(prompt: str, recommendations: List[PlaceRecommendationResult], quiet_count: int) -> str:
    """Generate friendly summary text using LLM API if available, or fallback synthesis."""
    # Attempt Groq LLM if key is present
    if settings.GROQ_API_KEY:
        try:
            from groq import AsyncGroq
            client = AsyncGroq(api_key=settings.GROQ_API_KEY)
            places_summary = "\n".join([
                f"- {r.place.name} ({r.place.category}, {r.place.area}): Popularity {r.busyness.current_popularity}%, Traffic {r.traffic.duration_in_traffic_mins} min ({r.traffic.distance_km} km)"
                for r in recommendations[:3]
            ])
            system_prompt = "Kamu adalah Spotsy, asisten tempat lokal yang ramah. Berikan 1-2 kalimat rangkuman singkat dalam bahasa Indonesia tanpa karakter markdown bintang (**) mentah."
            user_prompt = f"Pengguna mencari: '{prompt}'. Ditemukan {len(recommendations)} tempat ({quiet_count} sepi):\n{places_summary}"
            
            res = await client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=120,
                temperature=0.7
            )
            if res.choices and res.choices[0].message.content:
                return res.choices[0].message.content.strip()
        except Exception as e:
            print(f"Warning: Groq LLM API call failed ({e}), using fallback synthesis.")

    # Attempt OpenAI LLM if key is present
    if settings.OPENAI_API_KEY:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            places_summary = "\n".join([
                f"- {r.place.name} ({r.place.category}, {r.place.area}): Popularity {r.busyness.current_popularity}%, Traffic {r.traffic.duration_in_traffic_mins} min"
                for r in recommendations[:3]
            ])
            system_prompt = "Kamu adalah Spotsy, asisten tempat lokal yang ramah. Berikan 1-2 kalimat rangkuman singkat dalam bahasa Indonesia tanpa karakter bintang mentah."
            
            res = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Pengguna mencari: '{prompt}'. Rekomendasi:\n{places_summary}"}
                ],
                max_tokens=120
            )
            if res.choices and res.choices[0].message.content:
                return res.choices[0].message.content.strip()
        except Exception as e:
            print(f"Warning: OpenAI LLM API call failed ({e}), using fallback synthesis.")

    # Fallback smart synthesis
    if quiet_count > 0:
        return f"Berikut {len(recommendations)} rekomendasi tempat untuk \"{prompt}\". Ada {quiet_count} pilihan dengan suasana yang sepi dan rute perjalanan yang lancar."
    return f"Berikut {len(recommendations)} tempat yang tersedia untuk \"{prompt}\" beserta estimasi waktu tempuh menuju lokasi."
