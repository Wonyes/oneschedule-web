"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

import { Primary } from "@/src/components/ui/layout/button";
import { Row } from "@/src/components/ui/layout/flex";
import {
  AuthAlternatives,
  AuthLayoutGrid,
  BrandPlate,
  rise,
  stagger,
} from "./AuthShell";
import SignStepFields from "./SignStepFields";
import { StepProgress, StepSlide } from "./StepFlow";
import { SIGN_STEPS, useSignUp } from "./useSignUp";

export default function SignForm() {
  const {
    form,
    errors,
    step,
    direction,
    busy,
    isLast,
    emailStatus,
    codeSeconds,
    resendSeconds,
    resend,
    nicknameChecked,
    handleChange,
    goNext,
    goBack,
  } = useSignUp();

  const current = SIGN_STEPS[step];
  const buttonText = busy
    ? isLast
      ? "가입 중…"
      : "확인 중…"
    : isLast
      ? "회원가입"
      : step === 0 && emailStatus === "idle"
        ? "인증 코드 받기"
        : step === 0 && emailStatus === "sent"
          ? "인증하기"
          : "다음";

  return (
    <AuthLayoutGrid>
      <BrandPlate
        title="시작해 볼까요?"
        subtitle="이메일만 있으면 1분 안에 끝나요."
      />

      <motion.form
        variants={stagger}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          goNext();
        }}
        className="relative z-10 flex w-full flex-col gap-6 lg:ml-6 lg:w-[400px]"
      >
        <motion.div variants={rise}>
          <StepProgress
            total={SIGN_STEPS.length}
            current={step}
            label="가입 단계"
          />

          <Row className="mt-4 items-baseline justify-between">
            <h2 className="typo-sub-t-1 text-foreground">{current.title}</h2>
            <span className="typo-caption-3 tabular-nums text-place-h">
              {step + 1} / {SIGN_STEPS.length}
            </span>
          </Row>
          <p className="typo-caption-2 mt-1 text-muted">{current.hint}</p>
        </motion.div>

        <motion.div variants={rise}>
          <StepSlide stepKey={current.key} direction={direction}>
            <SignStepFields
              step={step}
              form={form}
              errors={errors}
              emailStatus={emailStatus}
              codeSeconds={codeSeconds}
              resendSeconds={resendSeconds}
              onResend={resend}
              nicknameChecked={nicknameChecked}
              onChange={handleChange}
            />
          </StepSlide>
        </motion.div>

        <motion.div variants={rise}>
          <Row className="gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                disabled={busy}
                aria-label="이전 단계"
                className="neu-btn btn-spring flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-secondary disabled:opacity-40"
              >
                <ArrowLeft size={16} strokeWidth={2} />
              </button>
            )}

            <Primary type="submit" className="w-full py-4" text={buttonText} />
          </Row>
        </motion.div>

        <AuthAlternatives
          dividerText="또는 Google로 계속하기"
          googleLabel="Google 계정으로 가입"
          question="이미 계정이 있으신가요?"
          linkHref="/login"
          linkText="로그인"
        />
      </motion.form>
    </AuthLayoutGrid>
  );
}
