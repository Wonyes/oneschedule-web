"use client";

import Schedule from "@/src/components/schedule/Schedule";
import ScheduleHeader from "@/src/components/schedule/ScheduleHeader";
import { useScheduleUrlSync } from "@/src/hooks/useScheduleUrlSync";

export default function SchedulePage() {
  useScheduleUrlSync();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-2 sm:gap-4">
      <ScheduleHeader />

      <div className="neu-flat min-h-0 flex-1 overflow-hidden rounded-3xl">
        <Schedule />
      </div>
    </div>
  );
}
