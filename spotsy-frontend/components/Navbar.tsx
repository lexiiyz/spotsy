"use client";

import React from "react";
import { UserCoordinates } from "../lib/geolocation";
import { Sparkles, MapPin, Coffee, Sun, RefreshCw, Loader2, HeartHandshake } from "lucide-react";

export interface NavbarProps {
  theme: "espresso" | "nordic";
  onToggleTheme: () => void;
  userLocation: UserCoordinates;
  locating: boolean;
  onRefreshLocation: () => void;
  onOpenChat: (prompt?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  userLocation,
  locating,
  onRefreshLocation,
  onOpenChat,
}) => {
  const isEspresso = theme === "espresso";

  return (
    <header className="sticky top-4 z-30 px-4 lg:px-8 max-w-7xl mx-auto pointer-events-none">
      <nav
        className={`pointer-events-auto backdrop-blur-2xl px-6 py-3.5 rounded-full border transition-all duration-300 flex items-center justify-between shadow-2xl ${
          isEspresso
            ? "bg-[#25140b]/90 border-[#3d2317] shadow-[#0f0704]/60"
            : "bg-[#fdf8f0]/90 border-[#e8d8c8] shadow-[#3b2016]/10"
        }`}
      >
        {/* Brand Logo & Pill Tag */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-xs marshmallow-squish ${
              isEspresso
                ? "bg-[#3d2317] border-[#5c3317] text-[#f8d7c4]"
                : "bg-[#f8e5d3] border-[#e8c8b0] text-[#5c3317]"
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-black text-xl tracking-tight ${
                  isEspresso ? "text-[#fdf8f0]" : "text-[#3b2016]"
                }`}
              >
                Spotsy
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Controls: Sliding Switch Theme Toggle, Location & AI CTA */}
        <div className="flex items-center gap-3">
          {/* Sliding Toggle Switch Button for Dark / Light */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span
              className={`hidden sm:inline font-bold ${
                isEspresso ? "text-[#a89083]" : "text-[#8c7365]"
              }`}
            >
              {isEspresso ? "Hot Cocoa" : "Vanilla Cream"}
            </span>
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
              className={`relative w-15 h-8 rounded-full p-1 border transition-colors duration-300 flex items-center cursor-pointer marshmallow-squish ${
                isEspresso
                  ? "bg-[#3d2317] border-[#5c3317]"
                  : "bg-[#f5ebd9] border-[#e2d0b7]"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md transition-transform duration-300 transform ${
                  isEspresso
                    ? "translate-x-7 bg-[#8c4a27] text-[#fdf8f0]"
                    : "translate-x-0 bg-white text-[#c26d24]"
                }`}
              >
                {isEspresso ? (
                  <Coffee className="w-3.5 h-3.5 text-[#f8d7c4]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-[#c26d24]" />
                )}
              </div>
            </button>
          </div>

          {/* Location Detector */}
          <button
            onClick={onRefreshLocation}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all marshmallow-squish ${
              isEspresso
                ? "bg-[#3d2317]/80 hover:bg-[#3d2317] text-[#f5ebd9] border-[#5c3317]"
                : "bg-[#f5ebd9]/80 hover:bg-[#f5ebd9] text-[#3b2016] border-[#e2d0b7]"
            }`}
          >
            {locating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d99b66]" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-[#d99b66]" />
            )}
            <span>
              Surabaya ({userLocation.latitude.toFixed(2)}, {userLocation.longitude.toFixed(2)})
            </span>
            <RefreshCw className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          {/* Primary AI Assistant CTA */}
          <button
            onClick={() => onOpenChat("")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-extrabold text-xs sm:text-sm transition-all shadow-md marshmallow-squish ${
              isEspresso
                ? "bg-[#8c4a27] hover:bg-[#9d552f] text-[#fffdfa] shadow-[#150a06]/40"
                : "bg-[#5c3317] hover:bg-[#4a2812] text-[#fffdfa] shadow-[#3b2016]/20"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Tanya Spotsy</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
