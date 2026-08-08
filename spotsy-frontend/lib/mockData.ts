export interface PlaceItem {
  place_id: string;
  name: string;
  category: string; // "Kafe", "Warkop", "Resto", "Coworking"
  address: string;
  area: string;
  latitude: number;
  longitude: number;
  rating: number;
  price_level: string; // "$", "$$", "$$$"
  wifi_available: boolean;
  power_outlets: boolean;
  noise_level: "Quiet" | "Moderate" | "Loud";
  opening_hours: string;
  photo_url?: string;
}

export interface RouteTrafficInfo {
  distance_km: number;
  duration_in_traffic_mins: number;
  traffic_condition: "Light" | "Moderate" | "Heavy" | "Severe";
}

export const MOCK_PLACES: PlaceItem[] = [
  {
    place_id: "place_1",
    name: "Kopi Kenangan Sejiwa - Manyar",
    category: "Kafe",
    address: "Jl. Manyar Kertoarjo No. 42, Surabaya",
    area: "Manyar",
    latitude: -7.2785,
    longitude: 112.7612,
    rating: 4.7,
    price_level: "$$",
    wifi_available: true,
    power_outlets: true,
    noise_level: "Quiet",
    opening_hours: "08.00 - 23.00",
  },
  {
    place_id: "place_2",
    name: "Warkop Cak Mat (Wifi Kencang)",
    category: "Warkop",
    address: "Jl. Gebang Putih No. 18, Sukolilo, Surabaya",
    area: "Sukolilo",
    latitude: -7.2821,
    longitude: 112.7915,
    rating: 4.5,
    price_level: "$",
    wifi_available: true,
    power_outlets: true,
    noise_level: "Moderate",
    opening_hours: "24 Jam",
  },
  {
    place_id: "place_3",
    name: "Calma Study & Coffee",
    category: "Coworking",
    address: "Jl. Raya Gubeng No. 88, Surabaya",
    area: "Gubeng",
    latitude: -7.2710,
    longitude: 112.7520,
    rating: 4.8,
    price_level: "$$",
    wifi_available: true,
    power_outlets: true,
    noise_level: "Quiet",
    opening_hours: "07.00 - 24.00",
  },
  {
    place_id: "place_4",
    name: "Titik Kumpul Cafe & Lounge",
    category: "Kafe",
    address: "Jl. Dharmahusada Indah No. 12, Surabaya",
    area: "Dharmahusada",
    latitude: -7.2689,
    longitude: 112.7754,
    rating: 4.3,
    price_level: "$$",
    wifi_available: true,
    power_outlets: false,
    noise_level: "Loud",
    opening_hours: "10.00 - 22.00",
  },
  {
    place_id: "place_5",
    name: "Kedai Kopi Sepi Tenang",
    category: "Kafe",
    address: "Jl. Ngagel Jaya Selatan No. 5, Surabaya",
    area: "Ngagel",
    latitude: -7.2912,
    longitude: 112.7543,
    rating: 4.6,
    price_level: "$",
    wifi_available: true,
    power_outlets: true,
    noise_level: "Quiet",
    opening_hours: "09.00 - 23.00",
  },
];

export function mockSearchPlaces(query: string, userLat?: number, userLng?: number): PlaceItem[] {
  const q = query.toLowerCase();
  
  // Filter by query if applicable, otherwise return all mock places
  const matches = MOCK_PLACES.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      q.includes("sepi") ||
      q.includes("nugas") ||
      q.includes("kafe") ||
      q.includes("warkop")
    );
  });

  return matches.length > 0 ? matches : MOCK_PLACES.slice(0, 3);
}

export function mockGetTrafficRoute(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): RouteTrafficInfo {
  // Approximate distance calculation using Pythagorean distance in degrees
  const dLat = (destLat - originLat) * 111;
  const dLng = (destLng - originLng) * 111;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
  const distanceKm = Math.max(0.8, Math.round(dist * 10) / 10);

  const durationMins = Math.round(distanceKm * 3.5 + (Math.random() * 4));
  
  let traffic: "Light" | "Moderate" | "Heavy" | "Severe" = "Light";
  if (durationMins > 20) traffic = "Heavy";
  else if (durationMins > 12) traffic = "Moderate";

  return {
    distance_km: distanceKm,
    duration_in_traffic_mins: durationMins,
    traffic_condition: traffic,
  };
}
