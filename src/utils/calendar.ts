import {
  eachDayOfInterval,
  endOfMonth,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "date-fns";

/** 한 달을 일요일 시작 주 단위로. 달 밖의 칸은 null */
export function getMonthGrid(month: Date): (Date | null)[][] {
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });

  const cells: (Date | null)[] = [
    ...Array<null>(days[0].getDay()).fill(null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export type DayState = {
  /** 시작일 또는 종료일 */
  selected: boolean;
  /** 시작일과 종료일 사이 */
  inRange: boolean;
  /** 고를 수 없는 날 (오늘 이전, 단 이미 선택된 날은 유지) */
  disabled: boolean;
};

export function getDayState(
  date: Date,
  start: Date | null,
  end: Date | null,
  today = new Date(),
): DayState {
  const isStart = !!start && isSameDay(date, start);
  const isEnd = !!end && isSameDay(date, end);
  const selected = isStart || isEnd;

  return {
    selected,
    inRange: !!start && !!end && date > start && date < end,
    disabled: !selected && isBefore(date, startOfDay(today)),
  };
}

/**
 * 달력 클릭으로 시작/종료일을 고르는 규칙.
 * - 아무것도 없거나 범위가 완성돼 있으면 → 새 시작일
 * - 시작일만 있고 그보다 앞을 누르면 → 그 날이 시작, 기존 시작이 종료
 * - 시작일만 있고 뒤를 누르면 → 종료일
 * - 시작일과 같은 날을 다시 누르면 → 변화 없음
 */
export function pickRange(
  date: Date,
  start: Date | null,
  end: Date | null,
): { startDate: Date; endDate: Date | null } | null {
  // 시작일과 같은 종료일은 "하루짜리"라 범위 없는 것으로 본다
  const openEnd = end && start && isSameDay(end, start) ? null : end;

  if (start && !openEnd && isSameDay(start, date)) return null;
  if (!start || openEnd) return { startDate: date, endDate: null };
  if (date < start) return { startDate: date, endDate: start };
  return { startDate: start, endDate: date };
}
