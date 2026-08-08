"use client";

import React, { useState, useEffect } from "react";
import { MOCK_PLACES, PlaceItem, mockGetTrafficRoute } from "../lib/mockData";
import { PlaceCard } from "./PlaceCard";
import { ChatInterface } from "./ChatInterface";
import { Navbar } from "./Navbar";
import { getCurrentUserLocation, UserCoordinates, DEFAULT_SURABAYA_COORDS } from "../lib/geolocation";
import {
  Sparkles,
  Search,
  MessageSquare,
  Coffee,
  Laptop,
  Moon,
  Zap,
  Activity,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const [theme, setTheme] = useState<"espresso" | "nordic">("espresso");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [userLocation, setUserLocation] = useState<UserCoordinates>(DEFAULT_SURABAYA_COORDS);
  const [locating, setLocating] = useState<boolean>(false);
  const [placesList, setPlacesList] = useState<PlaceItem[]>(MOCK_PLACES);

  useEffect(() => {
    fetchLocation();
    fetchBackendPlaces();
  }, []);

  const fetchBackendPlaces = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/places/search?query=");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setPlacesList(data);
        }
      }
    } catch (e) {
      console.warn("Backend API not reachable, using local dataset fallback:", e);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isChatOpen) {
        handleCloseChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen]);

  const fetchLocation = async () => {
    setLocating(true);
    const coords = await getCurrentUserLocation();
    setUserLocation(coords);
    setLocating(false);
  };

  const handleOpenChatWithPrompt = (prompt?: string) => {
    setSelectedPrompt(prompt || "");
    setIsChatOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsChatVisible(true);
      });
    });
  };

  const handleCloseChat = () => {
    setIsChatVisible(false);
    setTimeout(() => {
      setIsChatOpen(false);
    }, 300);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "espresso" ? "nordic" : "espresso"));
  };

  const isEspresso = theme === "espresso";

  const filteredPlaces = placesList.filter((place) => {
    const matchesCategory =
      activeCategory === "Semua" ||
      (activeCategory === "Kafe" && place.category.toLowerCase() === "kafe") ||
      (activeCategory === "Coworking" && place.category.toLowerCase() === "coworking") ||
      (activeCategory === "Warkop 24h" && place.category.toLowerCase() === "warkop");
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-500 pb-16 relative overflow-hidden ${
        isEspresso
          ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2d180e] via-[#1c0f0a] to-[#120a07] text-[#fdf8f0] selection:bg-[#8c4a27] selection:text-white"
          : "bg-[#faf7f2] text-[#3b2016] selection:bg-[#c26d24] selection:text-white"
      }`}
    >
      {/* Ambient Hot Cocoa Glow Backdrops (Dark Mode Only) */}
      {isEspresso && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#8c4a27]/20 blur-[160px] rounded-full pointer-events-none" />
          <div className="absolute top-80 right-10 w-[400px] h-[400px] bg-[#d99b66]/10 blur-[140px] rounded-full pointer-events-none" />
        </>
      )}

      {/* Separate Reusable Navbar Component */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        userLocation={userLocation}
        locating={locating}
        onRefreshLocation={fetchLocation}
        onOpenChat={handleOpenChatWithPrompt}
      />

      {/* Hero Section (Split Marshmallow Layout) */}
      <section className="pt-8 pb-14 px-4 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Hero Copy & Search */}
          <div className="lg:col-span-7 space-y-6">
            <h1
              className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight ${
                isEspresso ? "text-[#fdf8f0]" : "text-[#3b2016]"
              }`}
            >
              Temukan Sudut Tenang untuk <br className="hidden sm:inline" />
              <span className={isEspresso ? "text-[#f8d7c4]" : "text-[#8c4a27]"}>
                Nugas, Bekerja, & Bersantai
              </span>
            </h1>

            <p
              className={`text-sm sm:text-base leading-relaxed max-w-xl font-medium ${
                isEspresso ? "text-[#a89083]" : "text-[#8c7365]"
              }`}
            >
              Spotsy membantumu mengecek suasana keramaian tempat dan kondisi perjalanan secara langsung, agar kamu selalu mendapatkan meja dan suasana yang nyaman.
            </p>

            {/* Marshmallow Plush Search Box */}
            <div
              className={`p-2 rounded-full border transition-all flex items-center gap-2 marshmallow-squish ${
                isEspresso
                  ? "bg-[#28160d] border-[#3d2317] focus-within:border-[#8c4a27] shadow-xl shadow-[#0c0503]/50"
                  : "bg-[#fffdf9] border-[#e8d8c8] focus-within:border-[#c28455] shadow-xl shadow-[#3b2016]/8"
              }`}
            >
              <div className="flex items-center gap-3 px-4 flex-1">
                <Search
                  className={`w-5 h-5 shrink-0 ${
                    isEspresso ? "text-[#a89083]" : "text-[#8c7365]"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      handleOpenChatWithPrompt(searchQuery);
                    }
                  }}
                  placeholder="Ketik keinginanmu, misal: Kafe sepi dekat Manyar yang ada colokan..."
                  className={`w-full bg-transparent text-sm font-bold outline-none py-2.5 ${
                    isEspresso ? "text-[#fdf8f0] placeholder-[#a89083]" : "text-[#3b2016] placeholder-[#8c7365]"
                  }`}
                />
              </div>
              <button
                onClick={() => handleOpenChatWithPrompt(searchQuery || "Kafe sepi dekat Manyar")}
                className={`px-6 py-3.5 rounded-full text-white font-extrabold text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 shadow-md marshmallow-squish ${
                  isEspresso
                    ? "bg-[#8c4a27] hover:bg-[#9d552f]"
                    : "bg-[#5c3317] hover:bg-[#4a2812]"
                }`}
              >
                <span>Tanyakan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Suggested Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`font-bold text-xs mr-1 ${
                  isEspresso ? "text-[#a89083]" : "text-[#8c7365]"
                }`}
              >
                Pencarian Cepat:
              </span>
              {[
                { label: "Kafe Sepi Manyar", icon: Coffee },
                { label: "Coworking Tenang", icon: Laptop },
                { label: "Warkop 24 Jam", icon: Moon },
                { label: "Banyak Colokan", icon: Zap },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOpenChatWithPrompt(item.label)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full border font-bold transition-all marshmallow-squish ${
                      isEspresso
                        ? "bg-[#28160d] hover:bg-[#3d2317] text-[#f5ebd9] border-[#3d2317] hover:text-[#f8d7c4]"
                        : "bg-[#f5ebd9] hover:bg-[#ede0c9] text-[#3b2016] border-[#e2d0b7] hover:text-[#8c4a27] shadow-xs"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#d99b66]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Monitor Feed */}
          <div className="lg:col-span-5">
            <div
              className={`rounded-[2.5rem] border p-6 space-y-4 shadow-2xl transition-all ${
                isEspresso
                  ? "bg-[#25140b]/80 border-[#3d2317] shadow-[#0c0503]/50 backdrop-blur-md"
                  : "bg-[#fffdf9]/90 border-[#e8d8c8] shadow-xl shadow-[#3b2016]/8 backdrop-blur-md"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-3.5 ${
                  isEspresso ? "border-[#3d2317]" : "border-[#e8d8c8]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#4caf50]" />
                  <span
                    className={`text-xs font-black uppercase tracking-wider ${
                      isEspresso ? "text-[#fdf8f0]" : "text-[#3b2016]"
                    }`}
                  >
                    Suasana Tempat Terkini
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    isEspresso
                      ? "text-[#f8d7c4] bg-[#3d2317] border-[#5c3317]"
                      : "text-[#5c3317] bg-[#f8e5d3] border-[#e8c8b0]"
                  }`}
                >
                  Surabaya Timur
                </span>
              </div>

              {/* Sample Live Feed Cards */}
              <div className="space-y-3.5">
                {placesList.slice(0, 2).map((place, idx) => {
                  const traffic = mockGetTrafficRoute(
                    userLocation.latitude,
                    userLocation.longitude,
                    place.latitude,
                    place.longitude
                  );
                  const popularity = [25, 45][idx];
                  const isQuiet = popularity < 40;

                  return (
                    <div
                      key={place.place_id}
                      className={`p-4 rounded-2xl border transition-all marshmallow-squish ${
                        isEspresso
                          ? "bg-[#1c0f0a]/90 border-[#3d2317] hover:border-[#5c3317]"
                          : "bg-[#f5ebd9]/50 border-[#e8d0bd] hover:border-[#d99b66]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-xs font-extrabold text-[#d99b66]">{place.category}</span>
                          <h4
                            className={`text-xs font-black ${
                              isEspresso ? "text-[#fdf8f0]" : "text-[#3b2016]"
                            }`}
                          >
                            {place.name}
                          </h4>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            isQuiet
                              ? isEspresso
                                ? "bg-[#e8f5e9]/15 text-[#a5d6a7] border-[#81c784]/30"
                                : "bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]"
                              : isEspresso
                              ? "bg-[#fff3e0]/15 text-[#ffcc80] border-[#ffb74d]/30"
                              : "bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]"
                          }`}
                        >
                          {isQuiet ? "Suasana Sepi (25%)" : "Sedang (45%)"}
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-between text-xs pt-2 border-t font-bold ${
                          isEspresso
                            ? "text-[#a89083] border-[#3d2317]"
                            : "text-[#8c7365] border-[#e8d8c8]"
                        }`}
                      >
                        <span>{place.area}</span>
                        <span>{traffic.duration_in_traffic_mins} mnt perjalanan ({traffic.distance_km} km)</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleOpenChatWithPrompt("Tampilkan semua tempat sepi dekat lokasi saya")}
                className={`w-full py-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-xs marshmallow-squish ${
                  isEspresso
                    ? "bg-[#3d2317] hover:bg-[#4a2b1d] text-[#f8d7c4]"
                    : "bg-[#f5ebd9] hover:bg-[#ede0c9] text-[#3b2016] border border-[#e2d0b7]"
                }`}
              >
                <span>Lihat Semua Tempat Bersama AI</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspaces Grid */}
      <section className="py-10 px-4 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2
              className={`text-xl font-black tracking-tight ${
                isEspresso ? "text-[#fdf8f0]" : "text-[#3b2016]"
              }`}
            >
              Pilihan Tempat Nyaman Terdekat
            </h2>
            <p
              className={`text-xs font-bold mt-0.5 ${
                isEspresso ? "text-[#a89083]" : "text-[#8c7365]"
              }`}
            >
              Data keramaian dan jarak tempuh diperbarui secara berkala
            </p>
          </div>

          {/* Category Filter Pills with no-scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: "Semua", label: "Semua Tempat" },
              { id: "Kafe", label: "Kafe" },
              { id: "Coworking", label: "Coworking" },
              { id: "Warkop 24h", label: "Warkop 24 Jam" },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap marshmallow-squish shrink-0 ${
                    isActive
                      ? isEspresso
                        ? "bg-[#8c4a27] text-white border-[#8c4a27] shadow-xs"
                        : "bg-[#5c3317] text-white border-[#5c3317] shadow-xs"
                      : isEspresso
                      ? "bg-[#28160d]/80 text-[#a89083] hover:text-[#fdf8f0] border-[#3d2317]"
                      : "bg-[#f5ebd9] text-[#3b2016] hover:text-[#8c4a27] border-[#e2d0b7] shadow-xs"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Place Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place, idx) => {
            const mockTraffic = mockGetTrafficRoute(
              userLocation.latitude,
              userLocation.longitude,
              place.latitude,
              place.longitude
            );
            const mockBusyness = {
              is_live_available: true,
              current_popularity: [25, 45, 80, 30, 90][idx % 5],
              busyness_status: ["Quiet", "Moderate", "Busy", "Quiet", "Very Busy"][idx % 5],
            };

            return (
              <div key={place.place_id} className="flex flex-col">
                <PlaceCard
                  place={place}
                  busyness={mockBusyness}
                  traffic={mockTraffic}
                  theme={theme}
                />
                <button
                  onClick={() =>
                    handleOpenChatWithPrompt(`Bagaimana suasana dan rute perjalanan menuju ${place.name}?`)
                  }
                  className={`mt-2.5 w-full py-3 rounded-full font-bold text-xs border transition-all flex items-center justify-center gap-1.5 marshmallow-squish ${
                    isEspresso
                      ? "bg-[#28160d] hover:bg-[#3d2317] text-[#f5ebd9] hover:text-[#f8d7c4] border-[#3d2317]"
                      : "bg-[#f5ebd9] hover:bg-[#ede0c9] text-[#3b2016] hover:text-[#8c4a27] border-[#e2d0b7] shadow-xs"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#d99b66]" />
                  <span>Tanya Asisten tentang tempat ini</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => handleOpenChatWithPrompt("")}
          className={`flex items-center gap-2.5 px-5 py-3.5 rounded-full text-white font-extrabold text-xs sm:text-sm shadow-2xl transition-all border marshmallow-squish ${
            isEspresso
              ? "bg-[#8c4a27] hover:bg-[#9d552f] border-[#8c4a27]/40 shadow-[#0c0503]/50"
              : "bg-[#5c3317] hover:bg-[#4a2812] border-[#5c3317]/40 shadow-[#3b2016]/20"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#f8d7c4]" />
          <span>Tanya Asisten Spotsy</span>
        </button>
      </div>

      {/* AI Chat Modal Overlay with Marshmallow Squish Spring Bounce Animations */}
      {isChatOpen && (
        <div
          onClick={handleCloseChat}
          className={`fixed inset-0 z-50 bg-[#140804]/80 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 transition-opacity duration-300 ease-out ${
            isChatVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full h-full sm:h-[90vh] max-w-4xl rounded-none sm:rounded-[2.5rem] overflow-hidden shadow-2xl border flex flex-col transition-all duration-400 transform ${
              isChatVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-10 pointer-events-none"
            } ${
              isEspresso ? "bg-[#1c0f0a] border-[#3d2317]" : "bg-[#fffdf9] border-[#e8d8c8]"
            }`}
            style={{
              transitionTimingFunction: isChatVisible
                ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
                : "ease-in",
            }}
          >
            <ChatInterface
              onClose={handleCloseChat}
              initialPrompt={selectedPrompt}
              theme={theme}
            />
          </div>
        </div>
      )}
    </div>
  );
};
