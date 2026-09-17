import { addMonths, startOfMonth } from "date-fns";
import { create } from "zustand";

/** 일정 시트 안 날짜 선택 달력 */
interface CalendarStore {
  /** 보고 있는 달 (그 달의 1일) */
  viewMonth: Date;
  isCalendarOpen: boolean;
  /** 열 때 날짜를 주면 그 달부터 보여준다 */
  toggleCalendar: (date?: Date | null) => void;
  moveMonth: (direction: "next" | "prev") => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  viewMonth: startOfMonth(new Date()),
  isCalendarOpen: false,

  toggleCalendar: (date) =>
    set((state) => ({
      isCalendarOpen: !state.isCalendarOpen,
      viewMonth: date ? startOfMonth(date) : state.viewMonth,
    })),

  moveMonth: (direction) =>
    set((state) => ({
      viewMonth: addMonths(state.viewMonth, direction === "next" ? 1 : -1),
    })),
}));
