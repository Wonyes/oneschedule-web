"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

import { Primary } from "@/src/components/ui/layout/button";
import { Row } from "@/src/components/ui/layout/flex";
import { EmailVerifyFields, NewPasswordFields } from "./AuthFields";
import { AuthLayoutGrid, BrandPlate, rise, stagger } from "./AuthShell";
import { StepProgress, StepSlide } from "./StepFlow";
import { emailButtonText } from "./useEmailVerification";
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
            total={FIND_STEPS.length}
            current={step}
            label="비밀번호 찾기 단계"
          />

          <Row className="mt-4 items-baseline justify-between">
            <h2 className="typo-sub-t-1 text-foreground">{current.title}</h2>
            <span className="typo-caption-3 tabular-nums text-place-h">
              {step + 1} / {FIND_STEPS.length}
            </span>
          </Row>
          <p className="typo-caption-2 mt-1 text-muted">{current.hint}</p>
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

            <Primary type="submit" className="w-full py-3 sm:py-4" text={buttonText} />
          </Row>
        </motion.div>

        <motion.div variants={rise}>
          <Row className="w-full justify-center gap-2">
            <p className="typo-sub-t-3 text-place-h">비밀번호가 기억나셨나요?</p>
            <Link
              href="/login"
              prefetch
              className="typo-sub-t-1 -m-2 p-2 text-accent hover:underline"
            >
              로그인
            </Link>
          </Row>
        </motion.div>
      </motion.form>
    </AuthLayoutGrid>
  );
}
