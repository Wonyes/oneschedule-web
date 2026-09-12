"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { ScheduleViewType } from "@/src/types/schedule";

const PARAM = "type";

const parse = (raw: string | null): ScheduleViewType =>
  raw?.toLowerCase() === "group" ? "GROUP" : "PERSONAL";

export function useScheduleView() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const viewType = parse(searchParams.get(PARAM));

  const setViewType = useCallback(
    (type: ScheduleViewType) => {
      const next = new URLSearchParams(searchParams.toString());

      if (type === "GROUP") next.set(PARAM, "group");
      else next.delete(PARAM);

      const query = next.toString();
      // 서버 왕복 없이 주소만 바꾼다. Next 라우터가 useSearchParams에 반영해 준다.
      window.history.replaceState(
        null,
        "",
        query ? `${pathname}?${query}` : pathname,
      );
    },
    [searchParams, pathname],
  );

  return { viewType, setViewType };
}
