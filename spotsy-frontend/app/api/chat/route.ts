import { NextRequest, NextResponse } from "next/server";
import { PlaceItem, RouteTrafficInfo } from "@/lib/mockData";

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
    const { prompt, latitude = -7.2754, longitude = 112.7912, session_id } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    // Call FastAPI Backend Microservice AI Chat Orchestrator endpoint
    const res = await fetch(`${backendUrl}/api/v1/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        latitude,
        longitude,
        session_id,
      }),
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Backend returned status ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error connecting to FastAPI backend chat route:", error);
    return NextResponse.json(
      { error: "Gagal memproses rekomendasi tempat dari backend AI." },
      { status: 500 }
    );
  }
}
