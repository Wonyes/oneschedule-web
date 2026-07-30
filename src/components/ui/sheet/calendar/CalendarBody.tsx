import { useCalendarLogic } from "./useCalendarLogic";

import { Column, Between } from "../../layout/flex";
import { useCalendarStore } from "@/src/hooks/stores/useCalendarStore";
import { cn } from "@/src/utils/cn";
import { ChevronRight } from "lucide-react";
import { BlueBtn } from "../../layout/button";

export default function CalendarBody() {
  const { currentMonth, createCalendar } = useCalendarLogic();

  const { today, moveMonth, toggleCalendar } = useCalendarStore();

  const isCurrentMonth =
    today.getMonth() === new Date().getMonth() &&
    today.getFullYear() === new Date().getFullYear();

  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-[#1b2233] border border-white/10",
        "shadow-2xl mt-2 z-[999] w-full flex flex-col items-center gap-4 text-slate-100",
      )}
    >
      <Column className="w-full">
        <Between className="w-full items-center">
          <button
            type="button"
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-lg",
              "text-slate-400 hover:bg-white/10 hover:text-white transition-colors",
              "cursor-pointer rotate-180",
              isCurrentMonth &&
                "cursor-auto opacity-30 hover:bg-transparent hover:text-slate-400",
            )}
            disabled={isCurrentMonth}
            onClick={() => moveMonth("prev")}
          >
            <ChevronRight size={18} />
          </button>

          <span className="typo-body-2 text-white font-semibold px-4">
            {`${today.getFullYear()}년 ${currentMonth.name}`}
          </span>

          <button
            type="button"
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-lg",
              "text-slate-400 hover:bg-white/10 hover:text-white transition-colors",
              "cursor-pointer",
            )}
            onClick={() => moveMonth("next")}
          >
            <ChevronRight size={18} />
          </button>
        </Between>
      </Column>

      <div>{createCalendar()}</div>

      <div className="w-full p-2">
        <BlueBtn
          text="확인"
          className="w-full p-3"
          onClick={() => toggleCalendar()}
        />
      </div>
    </div>
  );
}
