import { create } from "zustand";

type ViewMode = "day" | "week" | "month";

interface ScheduleStore {
  mode: ViewMode;
  currentDate: Date;

  setMode: (mode: ViewMode) => void;
  setCurrentDate: (date: Date) => void;
  next: () => void;
  prev: () => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  mode: "week",
  currentDate: new Date(),

  setMode: (mode) => set({ mode }),
  setCurrentDate: (date) => set({ currentDate: date }),

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
