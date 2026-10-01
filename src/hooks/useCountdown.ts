"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** 초 단위 카운트다운. start(n)으로 시작하고 0이 되면 멈춘다. */
export function useCountdown() {
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const start = useCallback(
    (from: number) => {
      stop();
      setSeconds(from);
      timer.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            stop();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    },
    [stop],
  );

  useEffect(() => stop, [stop]);

  return { seconds, start, stop };
}

export const formatSeconds = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
