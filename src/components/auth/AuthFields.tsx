"use client";

import { Column, Row } from "@/src/components/ui/layout/flex";
import { Input, PasswordInput } from "@/src/components/ui/layout/input";
import { formatSeconds } from "@/src/hooks/useCountdown";
import { EmailStatus } from "./useEmailVerification";

type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

/** 이메일 + (발송 후) 인증 코드 입력. 회원가입·비밀번호 찾기 공용 */
export function EmailVerifyFields({
  email,
  code,
  status,
  codeSeconds,
  resendSeconds,
  emailError,
  codeError,
  onChange,
  onResend,
}: {
  email: string;
  code: string;
  status: EmailStatus;
  codeSeconds: number;
  resendSeconds: number;
  emailError?: string;
  codeError?: string;
  onChange: ChangeHandler;
  onResend: () => void;
}) {
  const expired = status === "sent" && codeSeconds === 0;

  return (
    <Column className="w-full gap-3">
      <Input
        name="email"
        type="email"
        autoComplete="email"
        label="이메일"
        value={email}
        onChange={onChange}
        errorMessage={emailError}
        successMessage={
          status === "verified" ? "인증이 완료됐어요." : undefined
        }
      />

      {status === "sent" && (
        <Input
          name="emailCode"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          label="인증 코드"
          value={code}
          onChange={onChange}
          errorMessage={codeError}
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

/** 새 비밀번호 + 확인. 회원가입·비밀번호 찾기 공용 */
export function NewPasswordFields({
  password,
  passwordConfirm,
  passwordError,
  confirmError,
  onChange,
}: {
  password: string;
  passwordConfirm: string;
  passwordError?: string;
  confirmError?: string;
  onChange: ChangeHandler;
}) {
  const mismatch = !!passwordConfirm && password !== passwordConfirm;
  const matched = !!passwordConfirm && password === passwordConfirm;

  return (
    <Column className="w-full gap-3">
      <PasswordInput
        name="password"
        autoComplete="new-password"
        label="비밀번호"
        value={password}
        onChange={onChange}
        errorMessage={passwordError}
      />
      <PasswordInput
        name="passwordConfirm"
        autoComplete="new-password"
        label="비밀번호 확인"
        value={passwordConfirm}
        onChange={onChange}
        errorMessage={
          confirmError ?? (mismatch ? "비밀번호가 일치하지 않아요." : undefined)
        }
        successMessage={matched ? "비밀번호가 일치해요." : undefined}
      />
    </Column>
  );
}
