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

/**
 * 초기값을 쿠키에서 읽는다. 서버에서는 document가 없어 null이고,
 * 서버 컴포넌트는 같은 쿠키를 직접 읽어 같은 그룹을 렌더링하므로 결과가 어긋나지 않는다.
 */
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
