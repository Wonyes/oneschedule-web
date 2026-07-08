import { create } from "zustand";

type ViewMode = "day" | "week" | "month";

interface CalendarStore {
  mode: ViewMode;
  currentDate: Date;

  setMode: (mode: ViewMode) => void;
  next: () => void;
  prev: () => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  mode: "week",
  currentDate: new Date(),

  setMode: (mode) => set({ mode }),

  next: () =>
    set((state) => {
      const date = new Date(state.currentDate);

      if (state.mode === "day") date.setDate(date.getDate() + 1);

      if (state.mode === "week") date.setDate(date.getDate() + 7);

      if (state.mode === "month") date.setMonth(date.getMonth() + 1);

      return { currentDate: date };
    }),

  prev: () =>
    set((state) => {
      const date = new Date(state.currentDate);

      if (state.mode === "day") date.setDate(date.getDate() - 1);

      if (state.mode === "week") date.setDate(date.getDate() - 7);

      if (state.mode === "month") date.setMonth(date.getMonth() - 1);

      return { currentDate: date };
    }),
}));
