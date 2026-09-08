"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

import DropdownMenu from "../../ui/DropdownMenu";
import { useOverlay } from "@/src/hooks/useOverlay";
import { useWeatherStore } from "@/src/hooks/stores/useWeatherStore";
import { latLngToGrid } from "@/src/utils/weather";

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

export default function LocationPicker() {
  const { name, setLocation } = useWeatherStore();
  const { openToast } = useOverlay();
  const pathname = usePathname();

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      return openToast({
        message: "이 브라우저에서는 현재 위치를 쓸 수 없어요.",
      });
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
            throw new Error(`주소 변환 실패 (${response.status})`);
          }

          const data = await response.json();

          const region =
            data.documents?.[0]?.address?.region_2depth_name ||
            data.documents?.[0]?.address?.region_1depth_name;

          if (!region) {
            setLocation("현재 위치", nx, ny);
            openToast({
              message: "지역 이름을 확인하지 못해 '현재 위치'로 표시합니다.",
            });
          } else {
            setLocation(region, nx, ny);
          }
        } catch (error) {
          console.error("주소 변환 실패:", error);

          setLocation("현재 위치", nx, ny);
          openToast({
            message: "지역 이름을 불러오지 못했어요. 날씨는 그대로 표시됩니다.",
          });
        }
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "위치 권한이 꺼져 있어요. 브라우저 설정에서 허용해 주세요."
            : "현재 위치를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.";

        openToast({ message });
      },
      { timeout: 10000 },
    );
  };

  if (pathname !== "/schedule") return null;

  return (
    <DropdownMenu
      label="지역 선택"
      align="left"
      panelClassName="w-40 lg:left-auto lg:right-0"
      triggerClassName="px-2 py-1.5 typo-caption-2 text-secondary hover:text-foreground lg:px-2.5"
      trigger={(isOpen) => (
        <>
          <MapPin size={13} strokeWidth={1.75} className="text-accent" />

          <span className="max-w-[52px] truncate whitespace-nowrap lg:max-w-none">
            {name}
          </span>

          <ChevronDown
            size={12}
            strokeWidth={1.75}
            className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </>
      )}
    >
      {(close) => (
        <>
          <button
            type="button"
            onClick={() => {
              close();
              handleCurrentLocation();
            }}
            className="text-accent hover:bg-accent/10 flex w-full items-center gap-2 rounded-xl px-3 py-2 typo-caption-2 transition"
          >
            <MapPin size={14} strokeWidth={1.75} />
            현재 위치
          </button>

          <div className="border-divider my-2 border-t" />

          <div className="flex max-h-56 flex-col gap-0.5 overflow-y-auto">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => {
                  setLocation(loc.name, loc.nx, loc.ny);
                  close();
                }}
                className="hover:bg-surface-hover text-secondary w-full rounded-xl px-3 py-2 text-left typo-caption-2 transition"
              >
                {loc.name}
              </button>
            ))}
          </div>
        </>
      )}
    </DropdownMenu>
  );
}
