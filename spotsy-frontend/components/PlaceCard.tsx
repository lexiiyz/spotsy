"use client";

import React from "react";
import { PlaceItem, RouteTrafficInfo } from "../lib/mockData";
import { Wifi, Zap, Navigation, Clock, Star, MapPin, Volume2 } from "lucide-react";

export interface PlaceCardProps {
  place: PlaceItem;
  busyness?: {
    is_live_available: boolean;
    current_popularity: number;
    busyness_status: string;
  };
  traffic?: RouteTrafficInfo;
  theme?: "espresso" | "nordic";
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  busyness,
  traffic,
  theme = "espresso",
}) => {
  const popularity = busyness?.current_popularity ?? 35;
  const isEspresso = theme === "espresso";

  let busynessConfig = {
    label: "Sepi",
    dotColor: "bg-[#4caf50]",
    badgeBg: isEspresso
      ? "bg-[#e8f5e9]/15 text-[#a5d6a7] border-[#81c784]/30"
      : "bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]",
    barColor: "bg-[#4caf50]",
  };

  if (popularity >= 70) {
    busynessConfig = {
      label: "Cukup Ramai",
      dotColor: "bg-[#e53935]",
      badgeBg: isEspresso
        ? "bg-[#ffebee]/15 text-[#ef9a9a] border-[#e57373]/30"
        : "bg-[#ffebee] text-[#c62828] border-[#ffcdd2]",
      barColor: "bg-[#e53935]",
    };
  } else if (popularity >= 40) {
    busynessConfig = {
      label: "Sedang",
      dotColor: "bg-[#fb8c00]",
      badgeBg: isEspresso
        ? "bg-[#fff3e0]/15 text-[#ffcc80] border-[#ffb74d]/30"
        : "bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]",
      barColor: "bg-[#fb8c00]",
    };
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-300 border marshmallow-squish ${
        isEspresso
          ? "bg-[#28160d]/90 border-[#3d2317] hover:border-[#8c4a27] shadow-xl shadow-[#0c0503]/60"
          : "bg-[#fffdf9] border-[#e8d8c8] hover:border-[#c28455] shadow-xl shadow-[#3b2016]/8"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                isEspresso
                  ? "bg-[#3d2317] text-[#f8d7c4] border-[#5c3317]"
                  : "bg-[#f5ebd9] text-[#5c3317] border-[#e2d0b7]"
              }`}
            >
              {place.category}
            </span>
            <div className="flex items-center text-[#d99b66] text-xs font-extrabold gap-1">
              <Star className="w-3.5 h-3.5 fill-[#d99b66] stroke-none" />
              <span>{place.rating}</span>
            </div>
            <span className={`text-xs font-semibold ${isEspresso ? "text-[#a89083]" : "text-[#8c7365]"}`}>
              {place.price_level}
            </span>
          </div>
          <h3
            className={`text-lg font-black tracking-tight transition-colors ${
              isEspresso
                ? "text-[#fdf8f0] group-hover:text-[#f8d7c4]"
                : "text-[#3b2016] group-hover:text-[#8c4a27]"
            }`}
          >
            {place.name}
          </h3>
        </div>

        {/* Busyness Pill Badge */}
        <div
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-extrabold shrink-0 shadow-xs ${busynessConfig.badgeBg}`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${busynessConfig.dotColor} ${
              popularity < 40 ? "animate-pulse" : ""
            }`}
          />
          <span>{busynessConfig.label}</span>
          <span className="text-[11px] opacity-75 font-medium">({popularity}%)</span>
        </div>
      </div>

      {/* Popularity Bar */}
      <div className="my-4">
        <div
          className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${
            isEspresso ? "bg-[#1f1009] border-[#3d2317]" : "bg-[#f5ebd9] border-[#e8d8c8]"
          }`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${busynessConfig.barColor}`}
            style={{ width: `${popularity}%` }}
          />
        </div>
        <div
          className={`flex justify-between items-center text-[11px] mt-1.5 font-bold ${
            isEspresso ? "text-[#a89083]" : "text-[#8c7365]"
          }`}
        >
          <span>Tingkat Keramaian Tempat</span>
          <span>{busyness?.is_live_available ? "Pantauan Langsung" : "Data Historis"}</span>
        </div>
      </div>

      {/* Location & ETA */}
      <div
        className={`flex flex-wrap items-center justify-between text-xs py-3 px-4 rounded-2xl mb-4 border ${
          isEspresso
            ? "bg-[#1f1009]/60 border-[#3d2317] text-[#f5ebd9]"
            : "bg-[#f5ebd9]/50 border-[#e8d0bd] text-[#3b2016]"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <MapPin
            className={`w-4 h-4 shrink-0 ${isEspresso ? "text-[#d99b66]" : "text-[#c26d24]"}`}
          />
          <span className="truncate max-w-[150px] font-bold">{place.area}</span>
        </div>

        {traffic && (
          <div className="flex items-center gap-2 pl-2">
            <div
              className={`flex items-center gap-1 font-extrabold ${
                isEspresso ? "text-[#f8d7c4]" : "text-[#8c4a27]"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{traffic.duration_in_traffic_mins} mnt</span>
            </div>
            <span className={isEspresso ? "text-[#a89083] text-[11px]" : "text-[#8c7365] text-[11px]"}>
              ({traffic.distance_km} km)
            </span>
          </div>
        )}
      </div>

      {/* Facilities & Hours */}
      <div
        className={`flex items-center justify-between text-xs pt-1 ${
          isEspresso ? "text-[#a89083]" : "text-[#8c7365]"
        }`}
      >
        <div className="flex items-center gap-1.5">
          {place.wifi_available && (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                isEspresso
                  ? "bg-[#3d2317] text-[#f5ebd9]"
                  : "bg-[#f5ebd9] text-[#3b2016]"
              }`}
            >
              <Wifi className="w-3.5 h-3.5 text-[#d99b66]" />
              Wi-Fi
            </span>
          )}
          {place.power_outlets && (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                isEspresso
                  ? "bg-[#3d2317] text-[#f5ebd9]"
                  : "bg-[#f5ebd9] text-[#3b2016]"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#d99b66]" />
              Colokan
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
              isEspresso
                ? "bg-[#3d2317] text-[#f5ebd9]"
                : "bg-[#f5ebd9] text-[#3b2016]"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-[#4caf50]" />
            {place.noise_level}
          </span>
        </div>

        <div
          className={`flex items-center gap-1 text-[11px] font-bold ${
            isEspresso ? "text-[#a89083]" : "text-[#8c7365]"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{place.opening_hours}</span>
        </div>
      </div>
    </div>
  );
};
