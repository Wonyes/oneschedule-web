import { forwardRef, useImperativeHandle } from "react";
import { Column } from "@/src/components/ui/layout/flex";
import { PasswordInput } from "@/src/components/ui/layout/input";
import { useForm } from "@/src/hooks/useForm";

export interface PasswordChangeValues {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordFormRef {
  submit: (onSuccess: (data: PasswordChangeValues) => void) => void;
}

export const PasswordChangeForm = forwardRef<PasswordFormRef>((_, ref) => {
  const { form, formChange, errors, setErrors } = useForm({
    currentPassword: "",
    newPassword: "",
  });

  useImperativeHandle(ref, () => ({
    submit: (onSuccess) => {
      if (!form.currentPassword.trim()) {
        setErrors({ currentPassword: "현재 비밀번호를 입력해주세요." });
        return;
      }
      if (!form.newPassword.trim()) {
        setErrors({ newPassword: "새 비밀번호를 입력해주세요." });
        return;
      }
      if (form.currentPassword === form.newPassword) {
        setErrors({ newPassword: "현재 비밀번호와 동일합니다." });
        return;
      }
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
      if (!passwordRegex.test(form.newPassword)) {
        setErrors({
          newPassword:
            "비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.",
        });
        return;
      }

      onSuccess(form);
    },
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
