"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Labels } from "../common/Labels";
import { useCalendarStore } from "@/src/hooks/stores/CalendarStore";

const tabs = [
  { label: "연별", value: "year" },
  { label: "월별", value: "month" },
  { label: "주별", value: "week" },
  { label: "오늘", value: "day" },
] as const;

function formatDate(mode: string, date: Date) {
  if (mode === "year") {
    return date.getFullYear();
  }

  if (mode === "month") {
    return date.toLocaleDateString("ko", {
      month: "long",
      year: "numeric",
    });
  }

  if (mode === "week") {
    const start = new Date(date);
    const end = new Date(date);

    start.setDate(date.getDate() - date.getDay() + 1);
    end.setDate(start.getDate() + 5);

    const month = start.toLocaleDateString("ko", {
      month: "short",
    });

    return `${start.getFullYear()}년 ${month} ${start.getDate()}일 – ${end.getDate()}일`;
  }

  return "Today";
}

export default function CalendarHeader() {
  const { mode, currentDate, setMode, next, prev } = useCalendarStore();

  return (
    <div className="flex items-center justify-center rounded-3xl bg-white px-4 py-10">
      <div className="flex items-center gap-6">
        <button
          onClick={prev}
          className="flex items-center justify-center rounded-full border border-b-color p-2 shadow-soft"
        >
          <ChevronLeft size={18} />
        </button>

        <h2 className="typo-sub-t-2">{formatDate(mode, currentDate)}</h2>

        <button
          onClick={next}
          className="flex items-center justify-center rounded-full border border-b-color p-2 shadow-soft"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex absolute right-2 rounded-2xl bg-back p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setMode(tab.value)}
            className={`
              px-5 py-2 rounded-xl typo-body-2 transition-all
              ${
                mode === tab.value
                  ? "bg-white shadow-drop text-t-title"
                  : "text-place-h"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
