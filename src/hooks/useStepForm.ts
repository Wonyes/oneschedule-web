"use client";

import { useState } from "react";

/** 여러 단계로 나뉜 폼의 현재 단계·슬라이드 방향·필드별 에러 */
export function useStepForm<F extends string>(total: number) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<F, string>>>({});

  /** 에러를 기록하고 false를 돌려줘서 `return fail(...)`로 검증을 끝낼 수 있게 */
  const fail = (field: F, message: string): false => {
    setErrors((prev) => ({ ...prev, [field]: message }));
    return false;
  };

  const clearError = (field: F) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, total - 1));
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  return {
    step,
    direction,
    errors,
    isLast: step === total - 1,
    fail,
    clearError,
    next,
    back,
  };
}
