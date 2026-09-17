"use client";

import { useEffect, useRef } from "react";

import { WeekLayouts } from "./WeekDayColumn";

const DEFAULT_HOUR = 8;

/**
 * 주가 바뀌면 오전 8시(첫 일정이 더 이르면 그 한 시간 전)가 보이도록 스크롤한다.
 * 데스크톱·모바일 스크롤 영역을 둘 다 등록한다. weekKey는 주가 바뀔 때 달라지는 값(주 첫날 getTime).
 */
export function useScrollToFirstHour(layouts: WeekLayouts, weekKey: number) {
  const roots = useRef<(HTMLDivElement | null)[]>([]);

  const firstHour = layouts.length
    ? Math.min(
        DEFAULT_HOUR,
        ...layouts.map((l) => new Date(l.event.startDate).getHours()),
      )
    : DEFAULT_HOUR;

  useEffect(() => {
    for (const root of roots.current) {
      const row = root?.querySelector<HTMLElement>(
        `[data-hour="${Math.max(firstHour - 1, 0)}"]`,
      );
      if (!root || !row) continue;
      root.scrollTop =
        row.getBoundingClientRect().top -
        root.getBoundingClientRect().top +
        root.scrollTop;
    }
  }, [firstHour, weekKey]);

  const register = (index: number) => (el: HTMLDivElement | null) => {
    roots.current[index] = el;
  };

  return register;
}
