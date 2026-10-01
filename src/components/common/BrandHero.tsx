import { CalendarDays, Users } from "lucide-react";

import BrandMark from "./BrandMark";

export default function BrandHero() {
  return (
    <div className="relative flex h-36 w-full items-center justify-center">
      <div className="absolute h-40 w-40 rounded-full glow-blob" />

      <div
        className="neu-float relative z-10 flex h-24 w-24 items-center justify-center rounded-[28px]"
        style={{ "--float-rotate": "-6deg" } as React.CSSProperties}
      >
        <BrandMark size={56} />
      </div>

      <div
        className="neu-btn animate-float-a absolute left-1/2 top-1 z-20 flex h-11 w-11 -translate-x-24 items-center justify-center rounded-2xl"
        style={{ "--float-rotate": "10deg" } as React.CSSProperties}
      >
        <Users size={17} strokeWidth={1.75} className="text-secondary" />
      </div>

      <div
        className="neu-btn animate-float-b absolute left-1/2 bottom-1 z-20 flex h-10 w-10 translate-x-14 items-center justify-center rounded-2xl"
        style={{ "--float-rotate": "-9deg" } as React.CSSProperties}
      >
        <CalendarDays size={16} strokeWidth={1.75} className="text-secondary" />
      </div>
    </div>
  );
}
