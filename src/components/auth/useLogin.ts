"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

import { useForm } from "@/src/hooks/useForm";
import { Post } from "@/src/hooks/querys/useMutations";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";

export function useLogin() {
  const router = useRouter();
  const { openAlert } = useOverlay();
  const [error, setError] = useState<string | null>(null);

  const { form, formChange } = useForm({ email: "", password: "" });

  const { mutate: login, isPending } = useAppMutation({
    mutationFn: () =>
      Post({
        url: "/members/login",
        body: { email: form.email, password: form.password },
      }),
    onSuccess: () => {
      router.replace("/");
      router.refresh();
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response) {
        setError(getErrorMessage(err));
        return;
      }
      openAlert({
        title: "로그인에 실패하였습니다.",
        message: getErrorMessage(err),
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    formChange(e);
  };

  const submit = () => {
    if (isPending) return;

    if (!form.email.trim() || !form.password) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    login();
  };

  return { form, error, isPending, handleChange, submit };
}
