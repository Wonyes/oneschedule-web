"use client";

import { Bell, CalendarClock, CalendarDays, MapPin, Users } from "lucide-react";
import { motion } from "motion/react";

const SATELLITES = [
  { icon: Users, angle: -90 },
  { icon: CalendarDays, angle: 0 },
  { icon: Bell, angle: 90 },
  { icon: MapPin, angle: 180 },
];

const ORBIT = { duration: 48, ease: "linear", repeat: Infinity } as const;

export default function OrbitHero() {
  return (
    <div className="relative mx-auto flex h-60 w-60 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-accent/15 blur-3xl" />

      <div className="neu-pressed absolute inset-3 rounded-full" />
      <div className="absolute inset-[22%] rounded-full border border-divider" />

      <div className="neu-float relative z-10 flex h-24 w-24 items-center justify-center rounded-[28px]">
        <CalendarClock size={38} strokeWidth={1.5} className="text-accent" />
      </div>

      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={ORBIT}
      >
        {SATELLITES.map(({ icon: Icon, angle }) => (
          <div
            key={angle}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `rotate(${angle}deg) translateX(108px) rotate(${-angle}deg)`,
            }}
          >
            <motion.div
              className="neu-btn flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl"
              animate={{ rotate: -360 }}
              transition={ORBIT}
            >
              <Icon size={17} strokeWidth={1.75} className="text-secondary" />
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
