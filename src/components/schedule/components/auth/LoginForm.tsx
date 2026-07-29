"use client";

import { Primary } from "@/src/components/ui/layout/button";
import { Row, Column } from "@/src/components/ui/layout/flex";
import { Input, PasswordInput } from "@/src/components/ui/layout/input";
import { Post } from "@/src/hooks/querys/useMutations";
import { useForm } from "@/src/hooks/useForm";
import { useOverlay } from "@/src/hooks/useOverlay";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const { form, formChange } = useForm({
    email: "",
    password: "",
  });
  const { openAlert } = useOverlay();

  const { mutate: login } = useAppMutation({
    mutationFn: () => {
      return Post({
        url: "/members/login",
        body: { email: form.email, password: form.password },
      });
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (err) => {
      openAlert({
        title: "로그인에 실패하였습니다.",
        message: err.data.result.errorMessage,
      });
    },
  });

  return (
    <Column className="max-w-[420px] w-full gap-6">
      <div className="w-full">
        <h1 className="typo-h1 font-bold tracking-tight">Welcome 👋</h1>

        <p className="typo-title-3 text-slate-500 mt-2">
          로그인하고 일정을 관리하세요.
        </p>
      </div>

      <Column className="gap-4 w-full">
        <Input
          name="email"
          value={form.email}
          className="w-full"
          placeholder="이메일"
          onChange={formChange}
        />
        <PasswordInput
          name="password"
          value={form.password}
          className="w-full"
          placeholder="비밀번호"
          onChange={formChange}
        />
      </Column>

      <Primary className="w-full py-4" text="로그인" onClick={login} />
      <Row className="flex justify-center gap-2">
        <p className="typo-sub-t-3 text-slate-500">계정이 없나요?</p>

        <span
          onClick={() => router.push("/sign")}
          className="typo-sub-t-1 cursor-pointer"
        >
          회원가입
        </span>
      </Row>
    </Column>
  );
}
