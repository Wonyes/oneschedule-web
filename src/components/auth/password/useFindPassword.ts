"use client";

import { useRouter } from "next/navigation";

import { useForm } from "@/src/hooks/useForm";
import { useStepForm } from "@/src/hooks/useStepForm";
import { Post } from "@/src/hooks/querys/useMutations";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { verificationTypes } from "@/src/types/verification";
import { useEmailVerification } from "../useEmailVerification";
import { validatePassword } from "../validators";

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

  const { step, direction, errors, isLast, fail, clearError, next, back } =
    useStepForm<FindField>(FIND_STEPS.length);

  const verification = useEmailVerification({
    purpose: verificationTypes.PASSWORD_RESET,
    email: form.email,
    code: form.emailCode,
    onError: fail,
    // 가입 여부는 알려주지 않으므로(백엔드가 없는 이메일도 200) 문구도 조건부로
    sentMessage: "가입된 이메일이면 인증 코드가 도착해요.",
    onVerified: next,
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

  const goNext = () => {
    if (busy) return;

    if (step === 0) {
      // 인증 전이면 코드 요청/검증 (넘어가는 건 onVerified), 이미 인증됐으면 바로 다음
      if (verification.submit()) next();
      return;
    }

    if (!validatePassword(form.password, form.passwordConfirm, fail)) return;
    resetPassword();
  };

  const goBack = () => {
    if (busy) return;
    back();
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
