"use client";

import { useSyncExternalStore } from "react";

const LEGACY_DISMISS_KEY = "onboarding-dismissed";

const dismissKey = (memberNo?: number) =>
  memberNo ? `onboarding-dismissed:${memberNo}` : LEGACY_DISMISS_KEY;

const readDismissed = (memberNo?: number) => {
  const key = dismissKey(memberNo);

  if (localStorage.getItem(key) === "true") return true;

  if (memberNo && localStorage.getItem(LEGACY_DISMISS_KEY) === "true") {
    localStorage.setItem(key, "true");
    localStorage.removeItem(LEGACY_DISMISS_KEY);
    return true;
  }

  return false;
};

// localStorage 구독. 서버에선 null(미정)로 그려서 깜빡임을 피한다
const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
};

const useDismissed = (memberNo?: number) =>
  useSyncExternalStore(
    subscribe,
    () => {
      try {
        return readDismissed(memberNo);
      } catch {
        return false;
      }
    },
    () => null,
  );

const writeDismissed = (memberNo?: number) => {
  try {
    localStorage.setItem(dismissKey(memberNo), "true");
  } catch {}
  listeners.forEach((notify) => notify());
};

export {
  useDismissed as useOnboardingDismissed,
  writeDismissed as dismissOnboarding,
};
