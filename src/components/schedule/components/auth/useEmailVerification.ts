"use client";

import { useState } from "react";

import { Post } from "@/src/hooks/querys/useMutations";
import { useCountdown } from "@/src/hooks/useCountdown";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import {
  VERIFICATION_CODE_TTL,
  VERIFICATION_RESEND_WAIT,
  VerificationPurpose,
} from "@/src/types/verification";

/** idle: 코드 요청 전 → sent: 코드 입력 대기 → verified: 인증 완료 */
export type EmailStatus = "idle" | "sent" | "verified";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Options = {
  purpose: VerificationPurpose;
  email: string;
  code: string;
  /** 백엔드 메시지를 어느 인풋 아래에 붙일지 */
  onError: (field: "email" | "emailCode", message: string) => void;
  onVerified?: () => void;
  /** 발송 성공 토스트 문구 (기본: 인증 코드를 메일로 보냈어요.) */
  sentMessage?: string;
};

/** 회원가입·비밀번호 찾기가 공유하는 이메일 인증 상태머신 */
export function useEmailVerification({
  purpose,
  email,
  code,
  onError,
  onVerified,
  sentMessage = "인증 코드를 메일로 보냈어요.",
}: Options) {
  const { openToast } = useOverlay();
  const [status, setStatus] = useState<EmailStatus>("idle");
  const codeTimer = useCountdown();
  const resendTimer = useCountdown();

  const { mutate: request, isPending: requesting } = useAppMutation({
    mutationFn: () =>
      Post({
        url: "/members/email-verification/request",
        params: { email, purpose },
      }),
    onSuccess: () => {
      setStatus("sent");
      codeTimer.start(VERIFICATION_CODE_TTL);
      resendTimer.start(VERIFICATION_RESEND_WAIT);
      openToast({ message: sentMessage });
    },
    onError: (err) => onError("email", getErrorMessage(err)),
  });

  const { mutate: verify, isPending: verifying } = useAppMutation({
    mutationFn: () =>
      Post({
        url: "/members/email-verification/verify",
        params: { email, purpose, code },
      }),
    onSuccess: () => {
      setStatus("verified");
      codeTimer.stop();
      resendTimer.stop();
      onVerified?.();
    },
    onError: (err) => onError("emailCode", getErrorMessage(err)),
  });

  const busy = requesting || verifying;

  /** 이메일이 바뀌면 이전 인증은 무효 */
  const reset = () => {
    setStatus("idle");
    codeTimer.stop();
    resendTimer.stop();
  };

  const resend = () => {
    if (busy || resendTimer.seconds > 0) return;
    request();
  };

  /**
   * 폼의 "다음" 버튼이 호출. 상태에 따라 코드 요청 / 코드 검증을 하고,
   * 이미 인증됐으면 true를 돌려 다음 단계로 넘어가게 한다.
   */
  const submit = (): boolean => {
    if (status === "verified") return true;
    if (!EMAIL_PATTERN.test(email)) {
      onError("email", "이메일 형식을 확인해 주세요.");
      return false;
    }
    if (status === "idle") {
      request();
      return false;
    }
    if (!code.trim()) {
      onError("emailCode", "인증 코드를 입력해 주세요.");
      return false;
    }
    verify();
    return false;
  };

  return {
    status,
    busy,
    codeSeconds: codeTimer.seconds,
    resendSeconds: resendTimer.seconds,
    submit,
    resend,
    reset,
  };
}

/** 인증 단계의 주 버튼 문구 */
export const emailButtonText = (status: EmailStatus) =>
  status === "idle"
    ? "인증 코드 받기"
    : status === "sent"
      ? "인증하기"
      : "다음";
