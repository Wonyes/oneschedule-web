import { forwardRef, useImperativeHandle } from "react";
import { Column } from "@/src/components/ui/layout/flex";
import { PasswordInput } from "@/src/components/ui/layout/input";
import { useForm } from "@/src/hooks/useForm";

interface PasswordChangeValues {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordFormRef {
  submit: (onSuccess: (data: PasswordChangeValues) => void) => void;
  /** 서버가 거절한 이유를 해당 입력칸 밑에 보여준다. */
  setServerError: (field: keyof PasswordChangeValues, message: string) => void;
}

export const PasswordChangeForm = forwardRef<PasswordFormRef>((_, ref) => {
  const { form, formChange, errors, setErrors } = useForm({
    currentPassword: "",
    newPassword: "",
  });

  useImperativeHandle(ref, () => ({
    submit: (onSuccess) => {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

      const nextErrors = {
        currentPassword: !form.currentPassword.trim()
          ? "현재 비밀번호를 입력해주세요."
          : "",
        newPassword: !form.newPassword.trim()
          ? "새 비밀번호를 입력해주세요."
          : form.currentPassword === form.newPassword
            ? "현재 비밀번호와 동일합니다."
            : !passwordRegex.test(form.newPassword)
              ? "비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다."
              : "",
      };

      setErrors(nextErrors);

      if (nextErrors.currentPassword || nextErrors.newPassword) return;

      onSuccess(form);
    },
    setServerError: (field, message) =>
      setErrors({ currentPassword: "", newPassword: "", [field]: message }),
  }));

  return (
    <Column className="gap-4">
      <PasswordInput
        name="currentPassword"
        onChange={formChange}
        errorMessage={errors.currentPassword}
        placeholder="현재 비밀번호를 입력해주세요."
      />
      <PasswordInput
        name="newPassword"
        onChange={formChange}
        errorMessage={errors.newPassword}
        placeholder="변경할 비밀번호를 입력해주세요."
        description="비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다."
      />
    </Column>
  );
});

PasswordChangeForm.displayName = "PasswordChangeForm";
