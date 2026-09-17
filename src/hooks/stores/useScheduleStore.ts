import { useSyncExternalStore } from "react";
import { createStore } from "zustand";

type ViewMode = "day" | "week" | "month";

interface ScheduleStore {
  mode: ViewMode;
  currentDate: Date;

  setMode: (mode: ViewMode) => void;
  setCurrentDate: (date: Date) => void;
  next: () => void;
  prev: () => void;
}

const store = createStore<ScheduleStore>((set) => ({
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
 * zustand 기본 훅은 SSR·하이드레이션 때 `getInitialState()`(월뷰·오늘)로 그린다.
 * 우리는 첫 렌더 중에 URL로 상태를 맞추므로(useScheduleUrlSync) 서버 스냅샷도 현재 상태를 읽어야
 * 새로고침 때 월뷰가 잠깐 비치지 않는다.
 */
export function useScheduleStore(): ScheduleStore;
export function useScheduleStore<T>(selector: (state: ScheduleStore) => T): T;
export function useScheduleStore<T>(selector?: (state: ScheduleStore) => T) {
  const read = () => (selector ? selector(store.getState()) : store.getState());
  return useSyncExternalStore(store.subscribe, read, read);
}

useScheduleStore.getState = store.getState;
useScheduleStore.setState = store.setState;
useScheduleStore.subscribe = store.subscribe;

