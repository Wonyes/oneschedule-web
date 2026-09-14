"use client";

import { Column, Row } from "@/src/components/ui/layout/flex";
import { Input, PasswordInput } from "@/src/components/ui/layout/input";
import { formatSeconds } from "@/src/hooks/useCountdown";
import { EmailStatus, SignErrors } from "./useSignUp";

type SignStepFieldsProps = {
  step: number;
  form: Record<string, string>;
  errors: SignErrors;
  emailStatus: EmailStatus;
  codeSeconds: number;
  resendSeconds: number;
  onResend: () => void;
  nicknameChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SignStepFields({
  step,
  form,
  errors,
  emailStatus,
  codeSeconds,
  resendSeconds,
  onResend,
  nicknameChecked,
  onChange,
}: SignStepFieldsProps) {
  switch (step) {
    case 0: {
      const expired = emailStatus === "sent" && codeSeconds === 0;

      return (
        <Column className="w-full gap-3">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            label="이메일"
            value={form.email}
            onChange={onChange}
            errorMessage={errors.email}
            successMessage={
              emailStatus === "verified" ? "인증이 완료됐어요." : undefined
            }
          />

          {emailStatus === "sent" && (
            <Input
              name="emailCode"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              label="인증 코드"
              value={form.emailCode}
              onChange={onChange}
              errorMessage={errors.emailCode}
              description={
                expired
                  ? "인증 코드가 만료됐어요. 다시 받아 주세요."
                  : `메일로 보낸 6자리 코드를 입력해 주세요. 남은 시간 ${formatSeconds(codeSeconds)}`
              }
              rightSection={
                <Row className="shrink-0 items-center gap-2">
                  {!expired && (
                    <span className="typo-caption-3 tabular-nums text-accent">
                      {formatSeconds(codeSeconds)}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={resendSeconds > 0}
                    className="neu-btn btn-spring typo-caption-3 rounded-lg px-2.5 py-1.5 text-secondary disabled:opacity-40"
                  >
                    {resendSeconds > 0 ? `${resendSeconds}초 후` : "다시 받기"}
                  </button>
                </Row>
              }
            />
          )}
        </Column>
      );
    }

    case 1: {
      const mismatch =
        !!form.passwordConfirm && form.password !== form.passwordConfirm;
      const matched =
        !!form.passwordConfirm && form.password === form.passwordConfirm;

      return (
        <Column className="w-full gap-3">
          <PasswordInput
            name="password"
            autoComplete="new-password"
            label="비밀번호"
            value={form.password}
            onChange={onChange}
            errorMessage={errors.password}
          />
          <PasswordInput
            name="passwordConfirm"
            autoComplete="new-password"
            label="비밀번호 확인"
            value={form.passwordConfirm}
            onChange={onChange}
            errorMessage={
              errors.passwordConfirm ??
              (mismatch ? "비밀번호가 일치하지 않아요." : undefined)
            }
            successMessage={matched ? "비밀번호가 일치해요." : undefined}
          />
        </Column>
      );
    }

    case 2:
      return (
        <Column className="w-full gap-3">
          <Input
            name="name"
            autoComplete="name"
            label="이름"
            value={form.name}
            onChange={onChange}
            errorMessage={errors.name}
          />
          <Input
            name="nickname"
            label="닉네임"
            value={form.nickname}
            onChange={onChange}
            errorMessage={errors.nickname}
            successMessage={
              nicknameChecked ? "사용 가능한 닉네임이에요." : undefined
            }
          />
        </Column>
      );

    case 3:
      return (
        <Input
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          label="전화번호 (선택)"
          value={form.phone}
          onChange={onChange}
          errorMessage={errors.phone}
        />
      );

    default:
      return null;
  }
}
