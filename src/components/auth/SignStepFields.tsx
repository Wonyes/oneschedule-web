"use client";

import { Column } from "@/src/components/ui/layout/flex";
import { Input } from "@/src/components/ui/layout/input";
import { EmailVerifyFields, NewPasswordFields } from "./AuthFields";
import { SignErrors, useSignUp } from "./useSignUp";

type SignStepFieldsProps = {
  step: number;
  form: Record<string, string>;
  errors: SignErrors;
  verification: ReturnType<typeof useSignUp>["verification"];
  nicknameChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SignStepFields({
  step,
  form,
  errors,
  verification,
  nicknameChecked,
  onChange,
}: SignStepFieldsProps) {
  switch (step) {
    case 0:
      return (
        <EmailVerifyFields
          email={form.email}
          code={form.emailCode}
          status={verification.status}
          codeSeconds={verification.codeSeconds}
          resendSeconds={verification.resendSeconds}
          emailError={errors.email}
          codeError={errors.emailCode}
          onChange={onChange}
          onResend={verification.resend}
        />
      );

    case 1:
      return (
        <NewPasswordFields
          password={form.password}
          passwordConfirm={form.passwordConfirm}
          passwordError={errors.password}
          confirmError={errors.passwordConfirm}
          onChange={onChange}
        />
      );

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
