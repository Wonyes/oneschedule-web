"use client";

import Schedule from "../../components/schedule/Schedule";
import ScheduleHeader from "../../components/schedule/ScheduleHeader";

export default function DashboardPage() {
  return (
    <div className="relative rounded-3xl h-full flex gap-6 w-full">
      <div className="flex-1 flex flex-col gap-4">
        <ScheduleHeader />

        <div className="flex-1 min-h-0 neu-flat rounded-3xl p-4">
          <Schedule />
        </div>
      </div>
    </div>
  );
}
