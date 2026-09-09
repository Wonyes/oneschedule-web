import { create } from "zustand";

import {
  ACTIVE_GROUP_COOKIE,
  readActiveGroupNo,
  writeActiveGroupNo,
} from "@/src/lib/activeGroup";

interface ActiveGroupStore {
  activeGroupNo: number | null;
  setActiveGroup: (groupNo: number) => void;
  clearActiveGroup: () => void;
}

export const useActiveGroupStore = create<ActiveGroupStore>((set) => ({
  activeGroupNo: readActiveGroupNo(),

  setActiveGroup: (groupNo) => {
    writeActiveGroupNo(groupNo);
    set({ activeGroupNo: groupNo });
  },

  clearActiveGroup: () => {
    document.cookie = `${ACTIVE_GROUP_COOKIE}=; path=/; max-age=0`;
    set({ activeGroupNo: null });
  },
}));
