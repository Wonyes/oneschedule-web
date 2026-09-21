"use client";

import { useMemo } from "react";
import { endOfDay, format, isSameMonth, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { useRouter } from "next/navigation";

import { DayGroup } from "@/src/components/schedule/parts/DayTimeline";
import MonthDayCell from "@/src/components/schedule/view/month/MonthDayCell";
import WeekdayRow from "@/src/components/schedule/view/month/WeekdayRow";
import {
  byStart,
  eventsInRange,
  getMonthDates,
  getMonthWeekLanes,
  MonthLaneCell,
} from "@/src/utils/schedule";
import { demoEvents } from "./demoEvents";

/**
 * 비로그인 홈에서 보여주는 실제 월간 뷰. 달력 컴포넌트를 그대로 쓰고 데이터만 가짜.
 * 어디를 눌러도 로그인으로 보낸다. sm 미만은 오늘·내일 목록으로 대신 보여준다.
 */
export default function GuestPreview({ today }: { today: Date }) {
  const router = useRouter();
  const goLogin = () => router.push("/login");

  const events = useMemo(() => demoEvents(today), [today]);
  const monthDates = useMemo(() => getMonthDates(today), [today]);

  const lanesByDate = useMemo(() => {
    const byDate = new Map<number, (MonthLaneCell | null)[]>();
    for (let i = 0; i < monthDates.length; i += 7) {
      const week = monthDates.slice(i, i + 7);
      getMonthWeekLanes(events, week).forEach((lanes, j) =>
        byDate.set(week[j].getTime(), lanes),
      );
    }
    return byDate;
  }, [events, monthDates]);

  return (
    <div className="neu-flat w-full overflow-hidden rounded-[var(--radius-outer)]">
      <div className="flex items-center justify-between px-4 pt-4 sm:px-5">
        <div>
          <span className="eyebrow">PREVIEW</span>
          <p className="typo-sub-t-1 text-foreground">
            {format(today, "yyyy년 M월", { locale: ko })}
          </p>
        </div>
        <span className="rounded-full bg-accent/12 px-2.5 py-1 typo-caption-3 font-semibold text-accent">
          예시 일정
        </span>
      </div>

      {/* 데스크톱·태블릿: 월간 그리드 */}
      <div className="hidden sm:block">
        <WeekdayRow />
        <div className="p-2">
          <div
            className="neu-pressed grid grid-cols-7 gap-1.5 rounded-2xl p-1.5"
            style={{
              gridTemplateRows: `repeat(${monthDates.length / 7}, minmax(96px, auto))`,
            }}
          >
            {monthDates.map((date) => (
              <MonthDayCell
                key={date.toISOString()}
                date={date}
                lanes={lanesByDate.get(date.getTime()) ?? []}
                inCurrentMonth={isSameMonth(date, today)}
                holidays={[]}
                onOpenDay={goLogin}
                onAdd={goLogin}
                onOpenEvent={goLogin}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 폰: 오늘·내일 목록 */}
      <div className="flex flex-col gap-4 px-4 pb-4 pt-3 sm:hidden">
        {[0, 1].map((offset) => {
          const date = new Date(today);
          date.setDate(date.getDate() + offset);
          return (
            <DayGroup
              key={offset}
              date={date}
              events={eventsInRange(
                events,
                startOfDay(date),
                endOfDay(date),
              ).sort(byStart)}
              onEventClick={goLogin}
            />
          );
        })}
      </div>
    </div>
  );
}
