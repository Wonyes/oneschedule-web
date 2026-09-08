"use client";

import BrandHero from "@/src/components/common/BrandHero";
import { Primary } from "@/src/components/ui/layout/button";
import { Row, Column } from "@/src/components/ui/layout/flex";
import { Input, PasswordInput } from "@/src/components/ui/layout/input";
import { Post } from "@/src/hooks/querys/useMutations";
import { useForm } from "@/src/hooks/useForm";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleLoginButton from "./GoogleLoginButton";

// 로그인 후 돌아올 주소는 서버가 프로필별 설정(app.front-url)으로 정하므로
// 여기서 넘길 필요가 없다.
const getOauthUrl = (provider: string) =>
  `${process.env.NEXT_PUBLIC_SERVER_IP}/oauth2/authorization/${provider}`;

export default function LoginForm() {
  const router = useRouter();
  // 회원가입 직후 넘어온 경우 다음 단계를 안내한다
  const isWelcome = useSearchParams().get("welcome") === "1";

  const { form, formChange } = useForm({
    email: "",
    password: "",
  });
  const { openAlert } = useOverlay();

  const { mutate: loginForm } = useAppMutation({
    mutationFn: () => {
      return Post({
        url: "/members/login",
        body: { email: form.email, password: form.password },
      });
    },
    onSuccess: () => {
      // 홈에서 서버가 유저 정보를 직접 조회하므로 여기서 미리 받을 필요가 없다.
      // 다만 (main) 레이아웃은 쿠키를 읽는 서버 컴포넌트라, 이전에 방문한 적이
      // 있으면 캐시된 채로 넘어가 헤더가 로그인 상태를 즉시 반영하지 못한다.
      // refresh()로 라우트 캐시를 무효화해 헤더가 바로 갱신되게 한다.
      router.replace("/");
      router.refresh();
    },
    onError: (err) => {
      openAlert({
        title: "로그인에 실패하였습니다.",
        message: getErrorMessage(err),
      });
    },
  });

  const handleLogin = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    loginForm();
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex max-w-[420px] w-full flex-col items-start gap-6"
    >
      <BrandHero />

      <div className="w-full">
        <h1 className="typo-h1 tracking-tight">
          {isWelcome ? "가입 완료 🎉" : "Welcome 👋"}
        </h1>

        <p className="typo-title-3 text-muted mt-2">
          {isWelcome
            ? "로그인하면 그룹 참여와 첫 일정 등록을 안내해드려요."
            : "로그인하고 일정을 관리하세요."}
        </p>
      </div>

      {isWelcome && (
        <Row className="neu-flat w-full items-start gap-2.5 rounded-xl px-4 py-3">
          <CheckCircle2
            size={16}
            strokeWidth={2}
            className="text-success-500 mt-0.5 shrink-0"
          />
          <span className="typo-caption-2 text-secondary">
            계정이 만들어졌어요. 방금 입력한 이메일과 비밀번호로 로그인해
            주세요.
          </span>
        </Row>
      )}

      <Column className="gap-4 w-full">
        <Input
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          className="w-full"
          placeholder="이메일"
          onChange={formChange}
        />
        <PasswordInput
          name="password"
          autoComplete="current-password"
          value={form.password}
          className="w-full"
          placeholder="비밀번호"
          onChange={formChange}
        />
      </Column>

      <Primary type="submit" className="w-full py-4" text="로그인" />

      <Column className="w-full items-center gap-4">
        <Row className="w-full items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="typo-caption-2 text-place-h">또는 간편 로그인</span>
          <span className="h-px flex-1 bg-white/10" />
        </Row>

        <GoogleLoginButton href={getOauthUrl("google")} />
      </Column>

      <Row className="flex justify-center w-full gap-2">
        <p className="typo-sub-t-3 text-place-h">계정이 없나요?</p>

        <Link
          href="/sign"
          prefetch
          className="typo-sub-t-1 text-indigo-600 hover:underline"
        >
          회원가입
        </Link>
      </Row>
    </form>
  );
}
