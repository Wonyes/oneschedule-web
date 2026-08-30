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

const views = ["day", "week", "month"] as const;

export default function ViewModeToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const { mode, setMode } = useScheduleStore();
  const { name, setLocation } = useWeatherStore();

  const pathname = usePathname();

  const activeIndex = views.indexOf(mode);

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

  if (pathname !== "/schedule") {
    return null;
  }

  return (
    <Row className="gap-1.5 sm:gap-3">
      {/* 위치 선택 */}

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            flex
            items-center
            gap-1.5
            rounded-lg
            px-2
            lg:px-2.5
            py-1.5
            typo-caption-2
            text-secondary
            btn-spring
            hover:bg-white/5
            hover:text-foreground
          "
        >
          <MapPin size={13} strokeWidth={1.75} className="text-accent" />

          <span
            className="hidden lg:inline whitespace-nowrap
          "
          >
            {name}
          </span>

          <ChevronDown
            size={12}
            strokeWidth={1.75}
            className={`
              hidden lg:block
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
              glass
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
                typo-caption-2
                text-accent
                transition
                hover:bg-accent/10
              "
            >
              <MapPin size={14} strokeWidth={1.75} />
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
                  typo-caption-2
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
          h-8
          w-[72px]
          lg:w-[108px]
          rounded-lg
          neu-pressed
          p-1
        "
      >
        <div
          className="
            absolute
            inset-y-1
            left-1
            rounded-md
            neu-flat
            transition-transform
            duration-300
          "
          style={{
            width: `calc(${100 / views.length}% - 2.7px)`,
            transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
          }}
        />

        {views.map((view) => (
          <button
            key={view}
            onClick={() => setMode(view)}
            className={`
              relative
              z-10
              flex-1
              typo-caption-3
              font-semibold

              ${mode === view ? "text-accent" : "text-secondary"}
            `}
          >
            {labels[view]}
          </button>
        ))}
      </div>
    </Row>
  );
}
