import { create } from "zustand";
import { ScheduleViewType } from "@/src/types/schedule";

interface ScheduleViewState {
  viewType: ScheduleViewType;
  setViewType: (type: ScheduleViewType) => void;
}

export const useScheduleViewStore = create<ScheduleViewState>((set) => ({
  viewType: "PERSONAL",
  setViewType: (type) => set({ viewType: type }),
}));
