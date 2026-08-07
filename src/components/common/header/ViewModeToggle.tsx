"use client";

import { useScheduleStore } from "@/src/hooks/stores/useScheduleStore";
import { useWeatherStore } from "@/src/hooks/stores/useWeatherStore";
import { latLngToGrid } from "@/src/utils/weather";
import { ChevronDown, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Row } from "../../ui/layout/flex";

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

const labels = {
  day: "일",
  week: "주",
  month: "월",
};

export default function ViewModeToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const { mode, setMode } = useScheduleStore();
  const { name, setLocation } = useWeatherStore();

  const pathname = usePathname();

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      return alert("위치 정보를 지원하지 않습니다.");
    }

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

  if (pathname !== "/") {
    return null;
  }

  return (
    <Row className="gap-3">
      {/* 위치 선택 */}

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            px-4
            py-2.5
            text-sm
            text-primary
            transition
            hover:bg-white/5
          "
        >
          <MapPin size={15} className="text-blue" />

          <span>{name}</span>

          <ChevronDown
            size={14}
            className={`
              transition-transform
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </button>

        {isOpen && (
          <div
            className="
              absolute
              right-0
              top-full
              mt-2
              w-44
              rounded-2xl
              neu-flat
              p-2
              z-50
            "
          >
            <button
              onClick={handleCurrentLocation}
              className="
                flex
                w-full
                items-center
                gap-2
                rounded-xl
                px-3
                py-2
                text-sm
                text-blue
                transition
                hover:bg-blue/10
              "
            >
              <MapPin size={14} />
              현재 위치
            </button>

            <div
              className="
                my-2
                border-t
                border-white/10
              "
            />

            {LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                onClick={() => {
                  setLocation(loc.name, loc.nx, loc.ny);

                  setIsOpen(false);
                }}
                className="
                  w-full
                  rounded-xl
                  px-3
                  py-2
                  text-left
                  text-sm
                  text-secondary
                  transition
                  hover:bg-white/5
                "
              >
                {loc.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View Mode */}

      <div
        className="
          relative
          flex
          h-11
          w-[138px]
          rounded-xl
          neu-pressed
          p-1.5
        "
      >
        <div
          className={`
            absolute
            inset-y-1.5
            left-1.5
            w-[calc(33.333%-4px)]
            rounded-lg
            neu-flat
            transition-transform
            duration-300

            ${
              mode === "day"
                ? "translate-x-0"
                : mode === "week"
                  ? "translate-x-full"
                  : "translate-x-[200%]"
            }
          `}
        />

        {(["day", "week", "month"] as const).map((view) => (
          <button
            key={view}
            onClick={() => setMode(view)}
            className={`
              relative
              z-10
              w-1/3
              typo-caption-2

              ${mode === view ? "text-blue" : "text-secondary"}
            `}
          >
            {labels[view]}
          </button>
        ))}
      </div>
    </Row>
  );
}
