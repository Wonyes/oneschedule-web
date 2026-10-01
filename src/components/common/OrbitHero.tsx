"use client";

import { Bell, CalendarDays, MapPin, Users } from "lucide-react";

import BrandMark from "./BrandMark";

import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import OrbitRing from "./orbit/OrbitRing";

const SATELLITES = [Users, CalendarDays, Bell, MapPin];

export default function OrbitHero() {
  // 작은 폰(iPhone SE 등)에선 원판을 줄여 위성이 화면 위로 튀어나가지 않게
  const wide = useMediaQuery("(min-width: 640px)");

  return (
    <OrbitRing
      radius={wide ? 108 : 74}
      className={wide ? "h-60 w-60" : "h-[168px] w-[168px]"}
      center={
        <div className="neu-float flex h-24 w-24 items-center justify-center rounded-[28px]">
          <BrandMark size={56} />
        </div>
      }
      items={SATELLITES.map((Icon, i) => ({
        key: i,
        node: (
          <div className="neu-btn flex h-11 w-11 items-center justify-center rounded-2xl">
            <Icon size={17} strokeWidth={1.75} className="text-secondary" />
          </div>
        ),
      }))}
    />
  );
}
