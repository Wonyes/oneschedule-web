"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "@/src/hooks/useForm";
import { useStepForm } from "@/src/hooks/useStepForm";
import { Post } from "@/src/hooks/querys/useMutations";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { verificationTypes } from "@/src/types/verification";
import { EMAIL_PATTERN, useEmailVerification } from "../useEmailVerification";
import { useNicknameAvailability } from "./useNicknameAvailability";
import { Consent } from "./ConsentFields";
import { validatePassword } from "../validators";

export const SIGN_STEPS = [
  {
    key: "email",
    title: "이메일",
    hint: "로그인과 알림에 사용됩니다.",
  },
  {
    key: "password",
    title: "비밀번호",
    hint: "8자 이상 입력해 주세요.",
  },
  {
    key: "profile",
    title: "이름과 닉네임",
    hint: "닉네임은 다른 멤버에게 표시됩니다.",
  },
  {
    key: "phone",
    title: "전화번호와 약관",
    hint: "전화번호는 선택이에요. 약관 동의는 필수예요.",
  },
] as const;

export type SignField =
  | "email"
  | "emailCode"
  | "password"
  | "passwordConfirm"
  | "name"
  | "nickname"
  | "phone"
  | "consent";

export type SignErrors = Partial<Record<SignField, string>>;

const PHONE_PATTERN = /^\d{9,11}$/;

export function useSignUp() {
  const router = useRouter();
  const { openAlert } = useOverlay();

  const { form, formChange } = useForm({
    email: "",
    emailCode: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    name: "",
    phone: "",
  });

  const { step, direction, errors, isLast, fail, clearError, next, back } =
    useStepForm<SignField>(SIGN_STEPS.length);

  const nickname = useNicknameAvailability(form.nickname, () =>
    fail("nickname", "이미 사용 중인 닉네임이에요."),
  );

  const verification = useEmailVerification({
    purpose: verificationTypes.SIGNUP,
    email: form.email,
    code: form.emailCode,
    onError: fail,
    onVerified: next,
  });

  /** 가입 API는 토큰을 주지 않는다. 방금 만든 계정으로 바로 로그인해 다시 입력하지 않게 한다 */
  const { mutate: autoLogin } = useAppMutation({
    mutationFn: () =>
      Post({
        url: "/members/login",
        body: { email: form.email, password: form.password },
      }),
    onSuccess: () => {
      router.replace("/?welcome=1");
      router.refresh();
    },
    // 계정은 이미 만들어졌으므로 로그인만 실패하면 기존 흐름으로 되돌린다
    onError: () => router.push("/login?welcome=1"),
  });

  const { mutate: signUp, isPending } = useAppMutation({
    mutationFn: () =>
      Post({
        url: "/members/signup",
        body: {
          email: form.email,
          password: form.password,
          nickname: form.nickname,
          phoneNumber: form.phone,
          name: form.name,
        },
      }),
    onSuccess: () => autoLogin(),
    onError: (err) =>
      openAlert({
        title: "회원가입에 실패하였습니다.",
        message: getErrorMessage(err),
      }),
  });

  const [consent, setConsent] = useState<Consent>({
    terms: false,
    privacy: false,
  });
  const handleConsent = (next: Consent) => {
    clearError("consent");
    setConsent(next);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as SignField;

    // 이메일을 바꾸면 이전 인증은 무효
    if (name === "email" && e.target.value !== form.email) {
      verification.reset();
      clearError("emailCode");
    }

    clearError(name);
    formChange(e);
  };

  const validate = async (index: number) => {
    switch (index) {
      case 0:
        if (!EMAIL_PATTERN.test(form.email)) {
          return fail("email", "이메일 형식을 확인해 주세요.");
        }
        return verification.status === "verified";

      case 1:
        return validatePassword(form.password, form.passwordConfirm, fail);

      case 2:
        if (!form.name.trim()) return fail("name", "이름을 입력해 주세요.");
        if (!form.nickname.trim()) {
          return fail("nickname", "닉네임을 입력해 주세요.");
        }
        return nickname.available || nickname.check();

      case 3:
        if (form.phone && !PHONE_PATTERN.test(form.phone)) {
          return fail("phone", "'-' 없이 숫자만 입력해 주세요.");
        }
        if (!consent.terms || !consent.privacy) {
          return fail(
            "consent",
            "이용약관과 개인정보처리방침에 동의해 주세요.",
          );
        }
        return true;

      default:
        return true;
    }
  };

  const busy = nickname.checking || isPending || verification.busy;

  const goNext = async () => {
    if (busy) return;

    // 0단계: 인증 전이면 버튼이 "코드 받기 → 인증하기" 역할을 한다
    if (step === 0 && !verification.submit()) return;
    if (!(await validate(step))) return;

    if (isLast) {
      signUp();
      return;
    }

    next();
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
    nicknameChecked: nickname.available,
    consent,
    handleConsent,
    handleChange,
    goNext,
    goBack,
  };
}
