"use client";

import { useState } from "react";
import { MapPin, ChevronDown, Plus } from "lucide-react";
import {
  getAddressFromCoords,
  getBrowserLocation,
  latLngToGrid,
} from "@/src/utils/weather";
import { useWeatherStore } from "@/src/hooks/stores/useWeatherStore";
import { LOCATIONS } from "@/src/constant/weathet";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"my" | "group">("my");
  const { name, setLocation } = useWeatherStore();
  const { openSheet } = useSheetStore();

  const router = useRouter();

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) return alert("위치 정보를 지원하지 않습니다.");
    try {
      const position = await getBrowserLocation();
      const { latitude, longitude } = position.coords;
      const region = await getAddressFromCoords(longitude, latitude);
      const { nx, ny } = latLngToGrid(latitude, longitude);
      setLocation(region, nx, ny);
    } catch (error) {
      console.error("위치/주소 오류:", error);
      alert("위치 정보를 가져올 수 없습니다.");
    } finally {
      setIsOpen(false);
    }
  };

  const user = null;

  return (
    <header className="grid grid-cols-3 items-center  py-4 text-slate-800">
      <div className="flex justify-start">
        <h1 className="tracking-tighter">
          <img
            className="h-14 w-full cursor-pointer"
            src="/assets/schedule_logo.png"
            alt="logo"
            onClick={() => router.push("/")}
          />
        </h1>
      </div>

      <nav className="flex gap-8 justify-center">
        <button
          onClick={() => setActiveTab("my")}
          className={`text-sm font-semibold transition-all ${
            activeTab === "my"
              ? "text-black border-b-2 border-black"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          MY Schedule
        </button>
        <button
          onClick={() => setActiveTab("group")}
          className={`text-sm font-semibold transition-all ${
            activeTab === "group"
              ? "text-black border-b-2 border-black"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          GROUP Schedule
        </button>
      </nav>

      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => openSheet()}
          className="flex gap-2 justify-center items-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-200"
        >
          <Plus size={15} className="text-slate-400" />
          <span className="typo-caption-2 text-slate-700">스케줄 추가</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex gap-2 items-center px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-all"
          >
            <MapPin size={16} className="text-slate-500" />
            <span className="typo-caption-2 text-slate-700">{name}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
              <button
                onClick={handleCurrentLocation}
                className="w-full text-left typo-caption-2 px-4 py-2 hover:bg-blue-50 text-blue-600 font-medium transition-colors"
              >
                📍 현재 위치
              </button>
              <div className="border-t border-slate-100 my-1" />
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => {
                    setLocation(loc.name, loc.nx, loc.ny);
                    setIsOpen(false);
                  }}
                  className="w-full text-left typo-caption-2 px-4 py-2 hover:bg-slate-100 transition-colors text-slate-700"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <>
          {user ? (
            <button className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Avatar>
                <AvatarImage src={user.profileImage} alt={user.nickname} />
                <AvatarFallback>{user.nickname[0]}</AvatarFallback>
              </Avatar>

              <span>{user.nickname}</span>
            </button>
          ) : (
            <button
              className="px-4 py-2 typo-caption-2 tracking-tighter rounded-lg bg-slate-50 border border-slate-200"
              onClick={() => router.push("/login")}
            >
              LOGIN
            </button>
          )}
        </>
      </div>
    </header>
  );
}
