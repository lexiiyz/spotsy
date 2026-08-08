"use client";

import React, { useState, useEffect, useRef } from "react";
import { getCurrentUserLocation, UserCoordinates, DEFAULT_SURABAYA_COORDS } from "../lib/geolocation";
import { PlaceCard } from "./PlaceCard";
import { PlaceRecommendationResult } from "../app/api/chat/route";
import { Send, MapPin, Sparkles, Loader2, RefreshCw, X, ArrowLeft, HeartHandshake } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  recommendations?: PlaceRecommendationResult[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Kafe sepi dekat Manyar yang ada colokan listrik",
  "Coworking space tenang dengan Wi-Fi kencang",
  "Warkop atau tempat santai 24 jam dekat ITS Sukolilo",
  "Kafe nyaman yang tidak terlalu bising untuk rapat online",
];

export interface ChatInterfaceProps {
  onClose?: () => void;
  initialPrompt?: string;
  theme?: "espresso" | "nordic";
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onClose,
  initialPrompt,
  theme = "espresso",
}) => {
  const isEspresso = theme === "espresso";
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "assistant",
      content:
        "Halo! Saya Spotsy, teman perjalananmu untuk menemukan tempat nugas, bekerja, atau sekadar bersantai. Saya bisa mengecek tingkat keramaian tempat dan estimasi perjalanan agar aktivitasmu lebih nyaman.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserCoordinates>(DEFAULT_SURABAYA_COORDS);
  const [locating, setLocating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handledPromptRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && handledPromptRef.current !== initialPrompt) {
      handledPromptRef.current = initialPrompt;
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const fetchLocation = async () => {
    setLocating(true);
    const coords = await getCurrentUserLocation();
    setUserLocation(coords);
    setLocating(false);
  };

  const handleSend = async (promptToSend?: string) => {
    const query = promptToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setInputPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengambil data rekomendasi tempat");

      const data = await res.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        content: data.text,
        recommendations: data.recommendations,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          content: "Maaf, terjadi kendala saat mencari rekomendasi tempat. Silakan coba beberapa saat lagi.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-full max-w-4xl mx-auto font-sans shadow-2xl ${
        isEspresso
          ? "bg-[#1c0f0a] text-[#fdf8f0] border-[#3d2317]"
          : "bg-[#fffdf9] text-[#3b2016] border-[#e8d8c8]"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-20 backdrop-blur-xl px-6 py-4 flex items-center justify-between border-b ${
          isEspresso
            ? "bg-[#25140b]/90 border-[#3d2317]"
            : "bg-[#fdf8f0]/90 border-[#e8d8c8] shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-all hover:scale-105 ${
                isEspresso
                  ? "hover:bg-[#3d2317] text-[#a89083] hover:text-[#fdf8f0]"
                  : "hover:bg-[#f5ebd9] text-[#8c7365] hover:text-[#3b2016]"
              }`}
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-xs ${
              isEspresso
                ? "bg-[#3d2317] border-[#5c3317] text-[#f8d7c4]"
                : "bg-[#f8e5d3] border-[#e8c8b0] text-[#5c3317]"
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`font-black text-base tracking-tight ${
                  isEspresso ? "text-[#fdf8f0]" : "text-[#3b2016]"
                }`}
              >
                Asisten Spotsy
              </h1>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  isEspresso
                    ? "bg-[#e8f5e9]/15 text-[#a5d6a7] border-[#81c784]/30"
                    : "bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]"
                }`}
              >
                Aktif
              </span>
            </div>
            <p
              className={`text-xs font-semibold ${
                isEspresso ? "text-[#a89083]" : "text-[#8c7365]"
              }`}
            >
              Panduan Tempat & Suasana Keramaian
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLocation}
            title="Perbarui lokasi saat ini"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all hover:scale-105 ${
              isEspresso
                ? "bg-[#3d2317] hover:bg-[#4a2b1d] text-[#f5ebd9] border-[#5c3317]"
                : "bg-[#f5ebd9] hover:bg-[#ede0c9] text-[#3b2016] border-[#e2d0b7]"
            }`}
          >
            {locating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d99b66]" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-[#d99b66]" />
            )}
            <span className="hidden sm:inline">
              Surabaya ({userLocation.latitude.toFixed(2)}, {userLocation.longitude.toFixed(2)})
            </span>
            <RefreshCw className="w-3 h-3 opacity-60" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-all hover:scale-105 ${
                isEspresso
                  ? "hover:bg-[#3d2317] text-[#a89083] hover:text-[#fdf8f0]"
                  : "hover:bg-[#f5ebd9] text-[#8c7365] hover:text-[#3b2016]"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[78%] rounded-[2rem] p-5 text-sm leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? isEspresso
                    ? "bg-[#8c4a27] text-white rounded-br-xs font-semibold"
                    : "bg-[#5c3317] text-white rounded-br-xs font-semibold"
                  : isEspresso
                  ? "bg-[#28160d] border border-[#3d2317] text-[#fdf8f0] rounded-bl-xs font-medium"
                  : "bg-white border border-[#e8d8c8] text-[#3b2016] shadow-md shadow-[#3b2016]/5 rounded-bl-xs font-medium"
              }`}
            >
              <div className="whitespace-pre-line">{renderFormattedText(msg.content)}</div>
              <div
                className={`text-[10px] mt-2 text-right font-bold opacity-60 ${
                  msg.sender === "user"
                    ? "text-[#f8d7c4]"
                    : isEspresso
                    ? "text-[#a89083]"
                    : "text-[#8c7365]"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.recommendations && msg.recommendations.length > 0 && (
              <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {msg.recommendations.map((rec) => (
                  <PlaceCard
                    key={rec.place.place_id}
                    place={rec.place}
                    busyness={rec.busyness}
                    traffic={rec.traffic}
                    theme={theme}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div
            className={`flex items-center gap-3 text-xs font-bold p-4 rounded-full border max-w-[320px] shadow-sm ${
              isEspresso
                ? "bg-[#28160d]/80 text-[#f5ebd9] border-[#3d2317]"
                : "bg-white text-[#3b2016] border-[#e8d8c8] shadow-md shadow-[#3b2016]/5"
            }`}
          >
            <Loader2 className="w-4 h-4 animate-spin text-[#d99b66]" />
            <span>Mengecek keramaian tempat dan rute perjalanan...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Quick Prompts */}
      {messages.length < 3 && (
        <div
          className={`px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar border-t ${
            isEspresso
              ? "border-[#3d2317] bg-[#25140b]/60"
              : "border-[#e8d8c8] bg-[#fdf8f0]/60"
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-[#d99b66] shrink-0" />
          {QUICK_PROMPTS.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(promptText)}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 border transition-all hover:scale-105 active:scale-95 ${
                isEspresso
                  ? "bg-[#3d2317] hover:bg-[#4a2b1d] text-[#f5ebd9] border-[#5c3317] hover:text-[#f8d7c4]"
                  : "bg-[#f5ebd9] hover:bg-[#ede0c9] text-[#3b2016] border-[#e2d0b7] hover:text-[#8c4a27]"
              }`}
            >
              {promptText}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <footer
        className={`p-4 sm:p-5 border-t ${
          isEspresso
            ? "bg-[#25140b] border-[#3d2317]"
            : "bg-[#fdf8f0] border-[#e8d8c8]"
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ketik keinginanmu, misal: Kafe tenang dekat Manyar..."
            disabled={loading}
            className={`flex-1 text-sm rounded-full px-6 py-3.5 outline-none transition-all border font-bold ${
              isEspresso
                ? "bg-[#1f1009] text-[#fdf8f0] placeholder-[#a89083] border-[#3d2317] focus:border-[#8c4a27]"
                : "bg-white text-[#3b2016] placeholder-[#8c7365] border-[#e8d8c8] focus:border-[#c28455]"
            }`}
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || loading}
            className={`p-4 rounded-full text-white transition-all shrink-0 disabled:opacity-40 shadow-md hover:scale-105 active:scale-95 ${
              isEspresso
                ? "bg-[#8c4a27] hover:bg-[#9d552f]"
                : "bg-[#5c3317] hover:bg-[#4a2812]"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
};
