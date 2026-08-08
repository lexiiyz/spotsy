from typing import List, Optional
from sqlalchemy import text
from app.db.postgres import AsyncSessionLocal
from app.schemas.places import PlaceItem

FALLBACK_PLACES: List[PlaceItem] = [
    PlaceItem(
        place_id="place-001",
        name="Tropikal Coffee Manyar",
        category="Kafe",
        area="Manyar, Surabaya Timur",
        address="Jl. Keputih Timur No. 12",
        latitude=-7.2819,
        longitude=112.7953,
        rating=4.7,
        price_level="$$",
        wifi_available=True,
        power_outlets=True,
        noise_level="Quiet",
        opening_hours="08:00 - 23:00",
    ),
    PlaceItem(
        place_id="place-002",
        name="Koridor Co-Working Space",
        category="Coworking",
        area="Siwalankerto, Surabaya",
        address="Gedung Siola Lt. 3",
        latitude=-7.255,
        longitude=112.738,
        rating=4.8,
        price_level="$",
        wifi_available=True,
        power_outlets=True,
        noise_level="Quiet",
        opening_hours="08:00 - 21:00",
    ),
    PlaceItem(
        place_id="place-003",
        name="Warkop Pitulikur 24 Jam",
        category="Warkop",
        area="Gubeng, Surabaya",
        address="Jl. Bagong Jinawi No. 27",
        latitude=-7.271,
        longitude=112.752,
        rating=4.5,
        price_level="$",
        wifi_available=True,
        power_outlets=True,
        noise_level="Moderate",
        opening_hours="24 Jam",
    ),
    PlaceItem(
        place_id="place-004",
        name="Common Ground Surabaya",
        category="Kafe",
        area="Darmokali, Surabaya",
        address="Jl. Raya Darmo No. 88",
        latitude=-7.29,
        longitude=112.74,
        rating=4.6,
        price_level="$$$",
        wifi_available=True,
        power_outlets=True,
        noise_level="Quiet",
        opening_hours="07:00 - 22:00",
    ),
    PlaceItem(
        place_id="place-005",
        name="Cangkrukan ITS Sukolilo",
        category="Warkop",
        area="Sukolilo, Surabaya Timur",
        address="Jl. Teknik Kimia ITS",
        latitude=-7.28,
        longitude=112.79,
        rating=4.4,
        price_level="$",
        wifi_available=True,
        power_outlets=True,
        noise_level="Moderate",
        opening_hours="24 Jam",
    ),
]

async def search_places(query: str, lat: float = -7.2754, lng: float = 112.7912) -> List[PlaceItem]:
    """Search places from PostgreSQL DB place_cache table, with fallback dataset."""
    try:
        async with AsyncSessionLocal() as session:
            sql = text("""
                SELECT place_id, name, category, area, address, latitude, longitude, rating, price_level, wifi_available, power_outlets, noise_level, opening_hours
                FROM place_cache
                WHERE LOWER(name) LIKE LOWER(:q) OR LOWER(area) LIKE LOWER(:q) OR LOWER(category) LIKE LOWER(:q)
            """)
            result = await session.execute(sql, {"q": f"%{query}%"})
            rows = result.fetchall()

            if rows:
                return [
                    PlaceItem(
                        place_id=row.place_id,
                        name=row.name,
                        category=row.category,
                        area=row.area,
                        address=row.address or "",
                        latitude=float(row.latitude),
                        longitude=float(row.longitude),
                        rating=float(row.rating or 4.5),
                        price_level=row.price_level or "$$",
                        wifi_available=row.wifi_available if row.wifi_available is not None else True,
                        power_outlets=row.power_outlets if row.power_outlets is not None else True,
                        noise_level=row.noise_level or "Quiet",
                        opening_hours=row.opening_hours or "08:00 - 23:00",
                    )
                    for row in rows
                ]
    except Exception as e:
        print(f"Warning: PostgreSQL DB query failed ({e}), using fallback dataset.")

    # Fallback filtering
    q_lower = query.lower()
    filtered = [
        p for p in FALLBACK_PLACES
        if q_lower in p.name.lower() or q_lower in p.area.lower() or q_lower in p.category.lower() or q_lower in p.noise_level.lower()
    ]
    return filtered if filtered else FALLBACK_PLACES
