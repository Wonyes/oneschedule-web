"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";

import { Primary } from "@/src/components/ui/layout/button";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { Input, PasswordInput } from "@/src/components/ui/layout/input";
import {
  AuthAlternatives,
  AuthLayoutGrid,
  BrandPlate,
  rise,
  stagger,
} from "./AuthShell";
import { useLogin } from "./useLogin";

export default function LoginForm() {
  const isWelcome = useSearchParams().get("welcome") === "1";
  const { form, error, isPending, handleChange, submit } = useLogin();

  return (
    <AuthLayoutGrid>
      <BrandPlate
        title={isWelcome ? "가입이 완료됐어요." : "팀의 일정을 한눈에."}
        subtitle={
          isWelcome
            ? "로그인하면 바로 시작할 수 있어요."
            : "개인 일정과 그룹 일정을 함께 관리하세요."
        }
      />

      <motion.form
        variants={stagger}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="relative z-10 flex w-full flex-col gap-6 lg:ml-6 lg:w-[400px]"
      >
        {isWelcome && (
          <motion.div variants={rise}>
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
          </motion.div>
        )}

        <motion.div variants={rise} className="hidden lg:block">
          <h2 className="typo-sub-t-1 text-foreground">로그인</h2>
          <p className="typo-caption-2 mt-1 text-muted">
            이메일과 비밀번호를 입력해 주세요.
          </p>
        </motion.div>

        <motion.div variants={rise}>
          <Column className="w-full gap-3">
            <Input
              name="email"
              type="email"
              autoComplete="email"
              label="이메일"
              value={form.email}
              invalid={!!error}
              onChange={handleChange}
            />
            <PasswordInput
              name="password"
              autoComplete="current-password"
              label="비밀번호"
              value={form.password}
              errorMessage={error ?? undefined}
              onChange={handleChange}
            />
          </Column>
        </motion.div>

        <motion.div variants={rise}>
          <Primary
            type="submit"
            className="w-full py-4"
            text={isPending ? "로그인 중…" : "로그인"}
          />
        </motion.div>

        <AuthAlternatives
          dividerText="또는 Google로 계속하기"
          googleLabel="Google 계정으로 로그인"
          question="계정이 없으신가요?"
          linkHref="/sign"
          linkText="회원가입"
        />
      </motion.form>
    </AuthLayoutGrid>
  );
}
