"use client";

import { format, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Primary } from "@/src/components/ui/layout/button";
import { Between } from "@/src/components/ui/layout/flex";
import { useCalendarStore } from "@/src/hooks/stores/useCalendarStore";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { getDayState, getMonthGrid, pickRange } from "@/src/utils/calendar";
import { cn } from "@/src/utils/cn";
import CalendarDay from "./CalendarDay";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const navClass =
  "flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground disabled:cursor-auto disabled:opacity-30 disabled:hover:bg-transparent";

/** 일정 시트 안 날짜 범위 선택 달력. 시작/종료일은 시트 폼에 바로 쓴다 */
export default function CalendarBody() {
  const { viewMonth, moveMonth, toggleCalendar } = useCalendarStore();
  const { form, updateForm } = useSheetStore();

  const today = new Date();
  const weeks = getMonthGrid(viewMonth);

  const select = (date: Date) => {
    const next = pickRange(date, form.startDate, form.endDate);
    if (next) updateForm(next);
  };

  return (
    <div className="neu-flat mt-2 flex w-full flex-col items-center gap-4 rounded-2xl p-5 text-foreground shadow-2xl">
      <Between className="w-full items-center">
        <button
          type="button"
          aria-label="이전 달"
          className={navClass}
          disabled={isSameMonth(viewMonth, today)}
          onClick={() => moveMonth("prev")}
        >
          <ChevronLeft size={18} />
        </button>

        <span className="px-4 typo-body-2 font-semibold">
          {format(viewMonth, "yyyy년 M월")}
        </span>

        <button
          type="button"
          aria-label="다음 달"
          className={navClass}
          onClick={() => moveMonth("next")}
        >
          <ChevronRight size={18} />
        </button>
      </Between>

      <table className="w-full max-w-[360px] table-fixed border-spacing-0">
        <thead>
          <tr>
            {WEEKDAYS.map((label, i) => (
              <th
                key={label}
                className={cn(
                  "h-10 typo-body-2 font-medium text-muted",
                  i === 0 && "font-semibold text-error-500",
                  i === 6 && "font-semibold text-blue",
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, w) => (
            <tr key={w}>
              {week.map((date, i) =>
                date ? (
                  <CalendarDay
                    key={date.getTime()}
                    date={date}
                    state={getDayState(
                      date,
                      form.startDate,
                      form.endDate,
                      today,
                    )}
                    onSelect={select}
                  />
                ) : (
                  <td key={`empty-${w}-${i}`} />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <Primary
        text="확인"
        className="w-full p-3"
        onClick={() => toggleCalendar()}
      />
    </div>
  );
}
