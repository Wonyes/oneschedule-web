"use client";

import Link from "next/link";
import { motion } from "motion/react";

import {
  AuthAlternatives,
  AuthForm,
  AuthLayoutGrid,
  BrandPlate,
  rise,
} from "../AuthShell";
import SignStepFields from "./SignStepFields";
import { StepActions, StepHeader, StepSlide } from "../StepFlow";
import { emailButtonText } from "../useEmailVerification";
import { SIGN_STEPS, useSignUp } from "./useSignUp";

export default function SignForm() {
  const {
    form,
    errors,
    step,
    direction,
    busy,
    isLast,
    verification,
    nicknameChecked,
    consent,
    handleConsent,
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
      : step === 0
        ? emailButtonText(verification.status)
        : "다음";

  return (
    <AuthLayoutGrid>
      <BrandPlate
        title="시작해 볼까요?"
        subtitle="이메일만 있으면 1분 안에 끝나요."
      />

      <AuthForm onSubmit={goNext}>
        <motion.div variants={rise}>
          <StepHeader
            total={SIGN_STEPS.length}
            current={step}
            label="가입 단계"
            title={current.title}
            hint={current.hint}
          />
        </motion.div>

        <motion.div variants={rise}>
          <StepSlide stepKey={current.key} direction={direction}>
            <SignStepFields
              step={step}
              form={form}
              errors={errors}
              verification={verification}
              nicknameChecked={nicknameChecked}
              consent={consent}
              onConsent={handleConsent}
              onChange={handleChange}
            />
          </StepSlide>
        </motion.div>

        <motion.div variants={rise}>
          <StepActions
            canGoBack={step > 0}
            busy={busy}
            onBack={goBack}
            submitText={buttonText}
          />
        </motion.div>

        <AuthAlternatives
          dividerText="또는 Google로 계속하기"
          googleLabel="Google 계정으로 가입"
          question="이미 계정이 있으신가요?"
          linkHref="/login"
          linkText="로그인"
        />

        <motion.p
          variants={rise}
          className="text-center typo-caption-3 text-place-h"
        >
          Google로 가입하면{" "}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2 hover:text-accent"
          >
            이용약관
          </Link>
          과{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2 hover:text-accent"
          >
            개인정보처리방침
          </Link>
          에 동의한 것으로 봐요.
        </motion.p>
      </AuthForm>
    </AuthLayoutGrid>
  );
}
