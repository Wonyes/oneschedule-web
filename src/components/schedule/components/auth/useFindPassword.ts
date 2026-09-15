"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "@/src/hooks/useForm";
import { Post } from "@/src/hooks/querys/useMutations";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { verificationTypes } from "@/src/types/verification";
import { useEmailVerification } from "./useEmailVerification";

export const FIND_STEPS = [
  {
    key: "email",
    title: "가입한 이메일",
    hint: "가입된 이메일이면 인증 코드를 보내 드려요.",
  },
  {
    key: "password",
    title: "새 비밀번호",
    hint: "8자 이상 입력해 주세요.",
  },
] as const;

export type FindField = "email" | "emailCode" | "password" | "passwordConfirm";
export type FindErrors = Partial<Record<FindField, string>>;

export function useFindPassword() {
  const router = useRouter();
  const { openAlert } = useOverlay();

  const { form, formChange } = useForm({
    email: "",
    emailCode: "",
    password: "",
    passwordConfirm: "",
  });

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<FindErrors>({});

  const fail = (field: FindField, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
    return false;
  };

  const clearError = (field: FindField) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const verification = useEmailVerification({
    purpose: verificationTypes.PASSWORD_RESET,
    email: form.email,
    code: form.emailCode,
    onError: fail,
    // 가입 여부는 알려주지 않으므로(백엔드가 없는 이메일도 200) 문구도 조건부로
    sentMessage: "가입된 이메일이면 인증 코드가 도착해요.",
    onVerified: () => {
      setDirection(1);
      setStep(1);
    },
  });

  const { mutate: resetPassword, isPending } = useAppMutation({
    mutationFn: () =>
      Post({
        url: "/members/password-reset",
        body: { email: form.email, newPassword: form.password },
      }),
    onSuccess: () => router.push("/login?reset=1"),
    onError: (err) =>
      openAlert({
        title: "비밀번호를 바꾸지 못했어요.",
        message: getErrorMessage(err),
      }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FindField;

    if (name === "email" && e.target.value !== form.email) {
      verification.reset();
      clearError("emailCode");
    }

    clearError(name);
    formChange(e);
  };

  const busy = isPending || verification.busy;
  const isLast = step === FIND_STEPS.length - 1;

  const goNext = () => {
    if (busy) return;

    if (step === 0) {
      // 인증 전이면 코드 요청/검증 (넘어가는 건 onVerified), 이미 인증됐으면 바로 다음
      if (verification.submit()) {
        setDirection(1);
        setStep(1);
      }
      return;
    }

    if (form.password.length < 8) {
      return fail("password", "비밀번호는 8자 이상이어야 해요.");
    }
    if (form.password !== form.passwordConfirm) {
      return fail("passwordConfirm", "비밀번호가 일치하지 않아요.");
    }
    resetPassword();
  };

  const goBack = () => {
    if (step === 0 || busy) return;
    setDirection(-1);
    setStep((s) => s - 1);
  };

  return {
    form,
    errors,
    step,
    direction,
    busy,
    isLast,
    verification,
    handleChange,
    goNext,
    goBack,
  };
}
