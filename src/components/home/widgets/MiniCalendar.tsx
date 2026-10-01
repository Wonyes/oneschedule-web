"use client";

import { format, isSameDay, isSameMonth, isToday, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { useMemo } from "react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Between, Column } from "@/src/components/ui/layout/flex";
import { EVENT_STYLES } from "@/src/constant/schedule";
import { useHolidays } from "@/src/hooks/querys/useCommonApi";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { useSchedules } from "@/src/hooks/querys/useSchedule";
import { cn } from "@/src/utils/cn";
import {
  findHoliday,
  getDayColor,
  getMonthDates,
  toScheduleEvent,
} from "@/src/utils/schedule";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MAX_DOTS = 3;

/** 오른쪽 열: 이번 달 한눈에. 날짜를 누르면 그 날 일 뷰로 */
export default function MiniCalendar({ today }: { today: Date }) {
  const { group } = useActiveGroup();
  const { data: holidays } = useHolidays(today);
  const { data: personal } = useSchedules("PERSONAL", true);
  const { data: groupSchedules } = useSchedules("GROUP", true, group?.groupNo);

  const dates = useMemo(() => getMonthDates(today), [today]);

  const eventsByDay = useMemo(() => {
    const events = [...(personal ?? []), ...(groupSchedules ?? [])].map(
      toScheduleEvent,
    );
    const map = new Map<number, typeof events>();
    events.forEach((e) => {
      const key = startOfDay(new Date(e.startDate)).getTime();
      map.set(key, [...(map.get(key) ?? []), e]);
    });
    return map;
  }, [personal, groupSchedules]);

  return (
    <BaseCard className="p-3 sm:p-4">
      <Between className="mb-3 items-center">
        <span className="typo-caption-1 font-semibold text-foreground">
          {format(today, "M월", { locale: ko })}
        </span>
        <Link
          href="/schedule?view=month"
          prefetch
          className="typo-caption-3 -m-2 p-2 text-accent hover:underline"
        >
          월 보기
        </Link>
      </Between>

      <div className="grid grid-cols-7 gap-y-1">
        {WEEKDAYS.map((d, i) => (
          <span
            key={d}
            className={cn(
              "text-center typo-caption-3",
              i === 0
                ? "text-error-500"
                : i === 6
                  ? "text-blue"
                  : "text-place-h",
            )}
          >
            {d}
          </span>
        ))}

        {dates.map((date) => {
          const inMonth = isSameMonth(date, today);
          const current = isToday(date);
          const holiday = findHoliday(date, holidays ?? []);
          const events = eventsByDay.get(date.getTime()) ?? [];

          return (
            <Link
              key={date.getTime()}
              href={`/schedule?view=day&date=${format(date, "yyyy-MM-dd")}`}
              prefetch
              aria-label={`${format(date, "M월 d일", { locale: ko })}${holiday ? ` ${holiday.dateName}` : ""}, 일정 ${events.length}개`}
              title={holiday?.dateName}
              className={cn(
                "btn-spring mx-auto flex h-8 w-8 flex-col items-center justify-center gap-0.5 rounded-lg",
                current ? "btn-primary" : "hover:bg-surface-hover",
                !inMonth && "opacity-35",
              )}
            >
              <span
                className={cn(
                  "typo-caption-3 leading-none tabular-nums",
                  current
                    ? "font-semibold text-on-primary"
                    : cn(
                        getDayColor(date, holiday),
                        isSameDay(date, today) && "font-semibold",
                      ),
                )}
              >
                {format(date, "d")}
              </span>
              <span className="flex h-1 items-center gap-px">
                {events.slice(0, MAX_DOTS).map((e) => (
                  <span
                    key={e.id}
                    className={cn(
                      "h-1 w-1 rounded-full",
                      current
                        ? "bg-on-primary/80"
                        : (EVENT_STYLES[e.category as keyof typeof EVENT_STYLES]
                            ?.dot ?? "bg-accent"),
                    )}
                  />
                ))}
              </span>
            </Link>
          );
        })}
      </div>

      <Column className="mt-3 gap-1 border-t border-divider pt-3">
        {(holidays ?? [])
          .filter((h) => {
            const s = h.locdate.toString();
            const d = new Date(
              Number(s.slice(0, 4)),
              Number(s.slice(4, 6)) - 1,
              Number(s.slice(6, 8)),
            );
            return d >= startOfDay(today);
          })
          .slice(0, 2)
          .map((h) => {
            const s = h.locdate.toString();
            return (
              <span
                key={h.locdate}
                className="flex items-baseline gap-1.5 typo-caption-3"
              >
                <span className="text-error-500 tabular-nums">
                  {Number(s.slice(4, 6))}.{Number(s.slice(6, 8))}
                </span>
                <span className="text-secondary">{h.dateName}</span>
              </span>
            );
          })}
      </Column>
    </BaseCard>
  );
}
