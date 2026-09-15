"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

import { useForm } from "@/src/hooks/useForm";
import { Post } from "@/src/hooks/querys/useMutations";
import { useNicknameCheck } from "@/src/hooks/querys/useMembers";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { verificationTypes } from "@/src/types/verification";
import { EMAIL_PATTERN, useEmailVerification } from "./useEmailVerification";

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
    title: "전화번호",
    hint: "선택 사항입니다. 숫자만 입력해 주세요.",
  },
] as const;

export type SignField =
  | "email"
  | "emailCode"
  | "password"
  | "passwordConfirm"
  | "name"
  | "nickname"
  | "phone";

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

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<SignErrors>({});
  const [checking, setChecking] = useState(false);

  const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
  const nicknameChecked = !!form.nickname && form.nickname === checkedNickname;

  const { refetch: checkNickname } = useNicknameCheck(form.nickname);

  const fail = (field: SignField, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
    return false;
  };

  const clearError = (field: SignField) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const verification = useEmailVerification({
    purpose: verificationTypes.SIGNUP,
    email: form.email,
    code: form.emailCode,
    onError: fail,
    onVerified: () => {
      setDirection(1);
      setStep(1);
    },
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
    onSuccess: () => router.push("/login?welcome=1"),
    onError: (err) =>
      openAlert({
        title: "회원가입에 실패하였습니다.",
        message: getErrorMessage(err),
      }),
  });

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

  const duplicationCheck = async (field: "nickname") => {
    const label = "닉네임";
    const taken = () => fail(field, `이미 사용 중인 ${label}이에요.`);

    setChecking(true);
    try {
      const result = await checkNickname();

      if (result.error) throw result.error;
      if (!result.data) return taken();
      else setCheckedNickname(form.nickname);

      return true;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) return taken();

      openAlert({ title: "중복 확인 실패", message: getErrorMessage(err) });
      return false;
    } finally {
      setChecking(false);
    }
  };

  const validate = async (index: number) => {
    switch (index) {
      case 0:
        if (!EMAIL_PATTERN.test(form.email)) {
          return fail("email", "이메일 형식을 확인해 주세요.");
        }
        return verification.status === "verified";

      case 1:
        if (form.password.length < 8) {
          return fail("password", "비밀번호는 8자 이상이어야 해요.");
        }
        if (form.password !== form.passwordConfirm) {
          return fail("passwordConfirm", "비밀번호가 일치하지 않아요.");
        }
        return true;

      case 2:
        if (!form.name.trim()) return fail("name", "이름을 입력해 주세요.");
        if (!form.nickname.trim()) {
          return fail("nickname", "닉네임을 입력해 주세요.");
        }
        return nicknameChecked || duplicationCheck("nickname");

      case 3:
        if (form.phone && !PHONE_PATTERN.test(form.phone)) {
          return fail("phone", "'-' 없이 숫자만 입력해 주세요.");
        }
        return true;

      default:
        return true;
    }
  };

  const busy = checking || isPending || verification.busy;
  const isLast = step === SIGN_STEPS.length - 1;

  const goNext = async () => {
    if (busy) return;

    // 0단계: 인증 전이면 버튼이 "코드 받기 → 인증하기" 역할을 한다
    if (step === 0 && !verification.submit()) return;
    if (!(await validate(step))) return;

    if (isLast) {
      signUp();
      return;
    }

    setDirection(1);
    setStep((s) => s + 1);
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
    nicknameChecked,
    handleChange,
    goNext,
    goBack,
  };
}
