"use client";

import { useSyncExternalStore } from "react";

// jsdom(테스트)처럼 matchMedia가 없는 환경에서는 항상 false
const supported = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

/** SSR에서는 false, 클라이언트에서는 미디어 쿼리 결과를 구독한다. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      if (!supported()) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => (supported() ? window.matchMedia(query).matches : false),
    () => false,
  );
}
