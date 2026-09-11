"use client";

import { Column } from "@/src/components/ui/layout/flex";
import { Input, PasswordInput } from "@/src/components/ui/layout/input";
import { SignErrors } from "./useSignUp";

type SignStepFieldsProps = {
  step: number;
  form: Record<string, string>;
  errors: SignErrors;
  emailChecked: boolean;
  nicknameChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SignStepFields({
  step,
  form,
  errors,
  emailChecked,
  nicknameChecked,
  onChange,
}: SignStepFieldsProps) {
  switch (step) {
    case 0:
      return (
        <Input
          name="email"
          type="email"
          autoComplete="email"
          label="이메일"
          value={form.email}
          onChange={onChange}
          errorMessage={errors.email}
          successMessage={
            emailChecked ? "사용 가능한 이메일이에요." : undefined
          }
        />
      );

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
