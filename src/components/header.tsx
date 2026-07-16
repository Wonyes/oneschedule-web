"use client";

import { useState } from "react";
import { Search, MapPin, MenuIcon, ChevronDown } from "lucide-react";
import { latLngToGrid } from "../utils/weather";
import { useWeatherStore } from "@/src/hooks/stores/WeatherStore";

const LOCATIONS = [
  { name: "서울", nx: 60, ny: 127 },
  { name: "수원", nx: 60, ny: 121 },
  { name: "인천", nx: 55, ny: 124 },
  { name: "대전", nx: 67, ny: 100 },
  { name: "대구", nx: 89, ny: 90 },
  { name: "부산", nx: 98, ny: 76 },
  { name: "광주", nx: 58, ny: 74 },
  { name: "울산", nx: 102, ny: 84 },
  { name: "제주", nx: 52, ny: 38 },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { name, setLocation } = useWeatherStore();

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) return alert("위치 정보를 지원하지 않습니다.");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const { nx, ny } = latLngToGrid(latitude, longitude);

        try {
          const response = await fetch(
            `/api/address?x=${longitude}&y=${latitude}`,
          );

          if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status}`);
          }

          const data = await response.json();
          console.log(data);

          const region =
            data.documents?.[0]?.address?.region_2depth_name ||
            data.documents?.[0]?.address?.region_1depth_name ||
            "알 수 없는 지역";

          setLocation(region, nx, ny);
        } catch (error) {
          console.error("주소 변환 실패:", error);
          setLocation("현재 위치", nx, ny);
        }

        setIsOpen(false);
      },
      () => alert("위치 권한을 허용해주세요."),
    );
  };

  return (
    <header className="flex items-center pb-8 justify-between">
      <div className="flex gap-4 items-center">
        <MenuIcon size={24} />
        <h1 className="text-2xl font-bold">Constructor</h1>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3" />
          <input
            className="pl-10 h-10 rounded-xl bg-gray-100 outline-none px-4"
            placeholder="Search..."
          />
        </div>

        {/* 위치 드롭다운 영역 */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex gap-2 items-center px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MapPin size={16} />
            <span className="font-medium">{name}</span>
            <ChevronDown size={14} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
              <button
                onClick={handleCurrentLocation}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-600 font-medium transition-colors"
              >
                📍 현재 위치
              </button>
              <div className="border-t border-gray-100 my-1" />
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => {
                    setLocation(loc.name, loc.nx, loc.ny);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
