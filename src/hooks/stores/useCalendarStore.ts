import { create } from "zustand";

interface CalendarState {
  currentDate: Date;
  today: Date;
  isCalendarOpen: boolean;
}

interface CalendarActions {
  resetToggleCalendar: () => void;

  toggleCalendar: (date?: Date | null) => void;

  setToday: (date: Date) => void;

  isSameDate: (date1: Date | null, date2: Date | null) => boolean;

  moveMonth: (direction: "next" | "prev") => void;

  createClickedDate: (dayToRender: number) => Date;
}

export const useCalendarStore = create<CalendarState & CalendarActions>(
  (set, get) => ({
    currentDate: new Date(),
    today: new Date(),
    isCalendarOpen: false,

    setToday: (date) =>
      set({
        today: date,
      }),

    isSameDate: (date1, date2) =>
      date1 instanceof Date &&
      date2 instanceof Date &&
      date1.getTime() === date2.getTime(),

    moveMonth: (direction) => {
      const { today } = get();

      const newDate = new Date(
        today.getFullYear(),
        today.getMonth() + (direction === "next" ? 1 : -1),
        1,
      );

      set({
        today: newDate,
      });
    },

    createClickedDate: (dayToRender) => {
      const { today } = get();

      return new Date(today.getFullYear(), today.getMonth(), dayToRender);
    },

    toggleCalendar: ({ date }: { date?: Date | null } = {}) =>
      set((state) => ({
        isCalendarOpen: !state.isCalendarOpen,

        today: date
          ? new Date(date.getFullYear(), date.getMonth(), 1)
          : state.today,
      })),

    resetToggleCalendar: () =>
      set({
        isCalendarOpen: false,
      }),
  }),
);
