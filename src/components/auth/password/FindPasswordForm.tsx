"use client";

import { motion } from "motion/react";

import { EmailVerifyFields, NewPasswordFields } from "../AuthFields";
import {
  AuthFooterLink,
  AuthForm,
  AuthLayoutGrid,
  BrandPlate,
  rise,
} from "../AuthShell";
import { StepActions, StepHeader, StepSlide } from "../StepFlow";
import { emailButtonText } from "../useEmailVerification";
import { FIND_STEPS, useFindPassword } from "./useFindPassword";

export default function FindPasswordForm() {
  const {
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
  } = useFindPassword();

  const current = FIND_STEPS[step];
  const buttonText = busy
    ? isLast
      ? "변경 중…"
      : "확인 중…"
    : isLast
      ? "비밀번호 변경"
      : emailButtonText(verification.status);

  return (
    <AuthLayoutGrid>
      <BrandPlate
        title="비밀번호를 잊으셨나요?"
        subtitle="이메일 인증만 하면 새 비밀번호로 바꿀 수 있어요."
      />

      <AuthForm onSubmit={goNext}>
        <motion.div variants={rise}>
          <StepHeader
            total={FIND_STEPS.length}
            current={step}
            label="비밀번호 찾기 단계"
            title={current.title}
            hint={current.hint}
          />
        </motion.div>

        <motion.div variants={rise}>
          <StepSlide stepKey={current.key} direction={direction}>
            {step === 0 ? (
              <EmailVerifyFields
                email={form.email}
                code={form.emailCode}
                status={verification.status}
                codeSeconds={verification.codeSeconds}
                resendSeconds={verification.resendSeconds}
                emailError={errors.email}
                codeError={errors.emailCode}
                onChange={handleChange}
                onResend={verification.resend}
              />
            ) : (
              <NewPasswordFields
                password={form.password}
                passwordConfirm={form.passwordConfirm}
                passwordError={errors.password}
                confirmError={errors.passwordConfirm}
                onChange={handleChange}
              />
            )}
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

        <AuthFooterLink
          question="비밀번호가 기억나셨나요?"
          href="/login"
          text="로그인"
        />
      </AuthForm>
    </AuthLayoutGrid>
  );
}
