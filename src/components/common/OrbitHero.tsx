"use client";

import { Bell, CalendarClock, CalendarDays, MapPin, Users } from "lucide-react";

import OrbitRing from "./OrbitRing";

const SATELLITES = [Users, CalendarDays, Bell, MapPin];

export default function OrbitHero() {
  return (
    <OrbitRing
      radius={108}
      center={
        <div className="neu-float flex h-24 w-24 items-center justify-center rounded-[28px]">
          <CalendarClock size={38} strokeWidth={1.5} className="text-accent" />
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
