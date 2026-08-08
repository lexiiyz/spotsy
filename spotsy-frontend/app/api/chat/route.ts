import { NextRequest, NextResponse } from "next/server";
import { mockSearchPlaces, mockGetTrafficRoute, PlaceItem, RouteTrafficInfo } from "@/lib/mockData";

export interface BusynessInfo {
  is_live_available: boolean;
  current_popularity: number;
  busyness_status: string;
}

export interface PlaceRecommendationResult {
  place: PlaceItem;
  busyness: BusynessInfo;
  traffic: RouteTrafficInfo;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, latitude = -7.2754, longitude = 112.7912 } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Step 1: Search candidate places
    const candidates = mockSearchPlaces(prompt, latitude, longitude);

    // Step 2: Parallel execution of get_busyness & get_traffic_route
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    const recommendations: PlaceRecommendationResult[] = await Promise.all(
      candidates.map(async (place) => {
        // Parallel call A: Busyness service (FastAPI)
        let busynessData: BusynessInfo = {
          is_live_available: true,
          current_popularity: 35,
          busyness_status: "Quiet",
        };

        try {
          const res = await fetch(`${backendUrl}/api/v1/busyness?place_id=${place.place_id}`, {
            next: { revalidate: 30 },
          });
          if (res.ok) {
            const json = await res.json();
            if (json.data) {
              busynessData = {
                is_live_available: json.data.is_live_available,
                current_popularity: json.data.current_popularity,
                busyness_status: json.data.busyness_status,
              };
            }
          }
        } catch (e) {
          console.warn("Backend busyness API call failed, using mock fallback:", e);
        }

        // Parallel call B: Traffic & ETA
        const trafficData = mockGetTrafficRoute(
          latitude,
          longitude,
          place.latitude,
          place.longitude
        );

        return {
          place,
          busyness: busynessData,
          traffic: trafficData,
        };
      })
    );

    // Step 3: Sort recommendations (prioritize Quiet / low popularity & short ETA)
    recommendations.sort((a, b) => {
      const scoreA = a.busyness.current_popularity * 0.7 + a.traffic.duration_in_traffic_mins * 0.3;
      const scoreB = b.busyness.current_popularity * 0.7 + b.traffic.duration_in_traffic_mins * 0.3;
      return scoreA - scoreB;
    });

    const quietCount = recommendations.filter((r) => r.busyness.current_popularity < 40).length;

    const summaryText = `Berikut ${recommendations.length} rekomendasi tempat untuk "${prompt}". Ada ${quietCount} pilihan dengan suasana yang sepi dan rute perjalanan yang lancar.`;

    return NextResponse.json({
      text: summaryText,
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Gagal memproses rekomendasi tempat." },
      { status: 500 }
    );
  }
}
