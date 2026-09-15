import { create } from "zustand";
import { isToday } from "date-fns";

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
  mode: "month",
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

/**
 * 서버(SSR)에서는 스토어가 프로세스 전체에서 공유돼 모듈 로드 시점의 날짜가 남는다.
 * 자정이 지나면 서버는 "어제", 클라이언트는 "오늘"을 그려 하이드레이션이 깨지므로
 * 스케줄 페이지가 서버에서 렌더되기 직전에 오늘로 맞춘다. (클라이언트에선 아무것도 안 함)
 */
export function syncServerStoreToToday() {
  if (typeof window !== "undefined") return;
  const { currentDate } = useScheduleStore.getState();
  if (!isToday(currentDate)) {
    useScheduleStore.setState({ currentDate: new Date() });
  }
}
