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
      className="
        p-5
        rounded-lg
        bg-white
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
        mt-2
        z-[999]
        w-full
        flex
        flex-col
        items-center
        gap-4
      "
    >
      <Column>
        <Between>
          <button
            className={cn(
              `
                w-6
                h-6
                flex
                items-center
                justify-center
                rounded
                hover:bg-input
                cursor-pointer
                rotate-180
                `,
              isCurrentMonth &&
                `
                  cursor-auto
                  opacity-50
                  hover:bg-transparent
                  `,
            )}
            disabled={isCurrentMonth}
            onClick={() => moveMonth("prev")}
          >
            <ChevronRight size={20} />
          </button>

          <span className="month typo-body-2 px-4">
            {`${today.getFullYear()}년 ${currentMonth.name}`}
          </span>

          <button
            className="
                w-6
                h-6
                flex
                items-center
                justify-center
                rounded
                cursor-pointer
                hover:bg-input
              "
            onClick={() => moveMonth("next")}
          >
            <ChevronRight size={20} />
          </button>
        </Between>
      </Column>
      {createCalendar()}

      <BlueBtn text="확인" onClick={() => toggleCalendar()} />
    </div>
  );
}
