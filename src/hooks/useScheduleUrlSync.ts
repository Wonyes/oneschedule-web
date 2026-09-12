"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { format, isToday, isValid, parse } from "date-fns";

import { useScheduleStore } from "./stores/useScheduleStore";

const VIEW_PARAM = "view";
const DATE_PARAM = "date";
const DATE_FORMAT = "yyyy-MM-dd";
const MODES = ["day", "week", "month"] as const;

type Mode = (typeof MODES)[number];

const isMode = (value: string | null): value is Mode =>
  MODES.includes(value as Mode);

/**
 * 스케줄 화면의 보기 방식(일/주/월)과 기준 날짜를 URL 쿼리와 맞춘다.
 * `/schedule?view=day&date=2026-09-12` 처럼 새로고침·공유·뒤로가기가 되게 한다.
 * 기본값(월뷰, 오늘)일 때는 쿼리를 비워 주소를 깨끗하게 둔다.
 */
export function useScheduleUrlSync() {
  const searchParams = useSearchParams();

  // URL → 스토어: 첫 진입, 뒤로가기/앞으로가기
  useEffect(() => {
    const { mode, currentDate, setMode, setCurrentDate } =
      useScheduleStore.getState();

    const view = searchParams.get(VIEW_PARAM);
    const nextMode = isMode(view) ? view : "month";
    if (nextMode !== mode) setMode(nextMode);

    const raw = searchParams.get(DATE_PARAM);
    const parsed = raw ? parse(raw, DATE_FORMAT, new Date()) : new Date();
    const nextDate = isValid(parsed) ? parsed : new Date();
    if (format(nextDate, DATE_FORMAT) !== format(currentDate, DATE_FORMAT)) {
      setCurrentDate(nextDate);
    }
  }, [searchParams]);

  // 스토어 → URL: 토글/이동 때마다 주소를 갱신한다.
  useEffect(() => {
    return useScheduleStore.subscribe((state, prev) => {
      if (state.mode === prev.mode && state.currentDate === prev.currentDate) {
        return;
      }

      const params = new URLSearchParams(window.location.search);

      if (state.mode === "month") params.delete(VIEW_PARAM);
      else params.set(VIEW_PARAM, state.mode);

      if (isToday(state.currentDate)) params.delete(DATE_PARAM);
      else params.set(DATE_PARAM, format(state.currentDate, DATE_FORMAT));

      const query = params.toString();
      const url = query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname;

      if (url === window.location.pathname + window.location.search) return;

      // 보기 방식이 바뀌면 뒤로가기로 돌아올 수 있게 히스토리를 쌓고,
      // 같은 보기 안에서 날짜만 옮기면 현재 항목을 덮어쓴다.
      if (state.mode !== prev.mode) window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    });
  }, []);
}
