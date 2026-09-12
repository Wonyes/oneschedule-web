"use client";

import { useSyncExternalStore } from "react";

/** SSR에서는 false, 클라이언트에서는 미디어 쿼리 결과를 구독한다. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
