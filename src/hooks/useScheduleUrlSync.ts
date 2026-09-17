"use client";

import { useEffect, useState } from "react";
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

/** URL 쿼리를 읽어 스토어와 다르면 맞춘다. 쿼리가 없으면 월뷰·오늘 */
function applyParams(searchParams: URLSearchParams) {
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
}

/**
 * 스케줄 화면의 보기 방식(일/주/월)과 기준 날짜를 URL 쿼리와 맞춘다.
 * `/schedule?view=day&date=2026-09-12` 처럼 새로고침·공유·뒤로가기가 되게 한다.
 * 기본값(월뷰, 오늘)일 때는 쿼리를 비워 주소를 깨끗하게 둔다.
 *
 * 첫 렌더에서는 effect가 아니라 렌더 중에 맞춘다 — 그래야 SSR과 하이드레이션 첫 화면이
 * URL대로 나오고(새로고침 때 월뷰가 잠깐 비치지 않음), 서버 스토어에 남은 어제 날짜도 오늘로 바뀐다.
 */
/**
 * 첫 렌더 중에 URL을 스토어에 반영한다 (useState 초기화 함수는 딱 한 번 돈다).
 * 스케줄 페이지와, 페이지보다 먼저 렌더되는 헤더의 ViewModeToggle이 둘 다 부른다 —
 * 어느 쪽이 먼저 그려지든 같은 상태로 시작해야 하이드레이션이 맞는다.
 */
export function useScheduleUrlInit() {
  const searchParams = useSearchParams();
  useState(() => applyParams(searchParams));
  return searchParams;
}

export function useScheduleUrlSync() {
  const searchParams = useScheduleUrlInit();

  // URL → 스토어: 뒤로가기/앞으로가기
  useEffect(() => {
    applyParams(searchParams);
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
