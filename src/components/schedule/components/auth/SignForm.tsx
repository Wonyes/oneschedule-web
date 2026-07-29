"use client";

import { LineBtn, Primary } from "@/src/components/ui/layout/button";
import { Column } from "@/src/components/ui/layout/flex";
import { Input, PasswordInput } from "@/src/components/ui/layout/input";
import { useForm } from "@/src/hooks/useForm";
import Field from "../../layout/Field";
import { Post } from "@/src/hooks/querys/useMutations";
import { useRouter } from "next/navigation";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { useOverlay } from "@/src/hooks/useOverlay";

export default function SignForm() {
  const router = useRouter();
  const { form, formChange } = useForm({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    name: "",
    phone: "",
  });
  const { openAlert } = useOverlay();
  const { mutate: signUp } = useAppMutation({
    mutationFn: () => {
      return Post({
        url: "/members/signup",
        body: {
          email: form.email,
          password: form.password,
          nickname: form.nickname,
          phoneNumber: form.phone,
          name: form.name,
        },
      });
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      openAlert({
        title: "회원가입에 실패하였습니다.",
        message: "가입정보를 다시 확인해 주세요.",
      });
    },
  });

  return (
    <div className="max-w-[420px] relative w-full flex flex-col h-full">
      <header className="pb-[20px] shrink-0">
        <h1 className="typo-title-2">회원정보 입력</h1>
      </header>

      <Column className="gap-[28px] flex-1 overflow-y-auto pb-[80px]">
        <Field label="이메일">
          <Input
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={formChange}
            rightSection={
              <Primary
                text="중복확인"
                className="py-[4px] px-[8px] rounded-[4px]"
              />
            }
          />
        </Field>

        <Field label="비밀번호">
          <PasswordInput
            name="password"
            value={form.password}
            onChange={formChange}
            placeholder="비밀번호"
          />
          <PasswordInput
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={formChange}
            placeholder="비밀번호 확인"
          />
        </Field>

        <Field label="닉네임">
          <Input
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={formChange}
            rightSection={
              <Primary
                text="중복확인"
                className="py-[4px] px-[8px] rounded-[4px]"
              />
            }
          />
        </Field>

        <Field label="이름">
          <Input
            name="name"
            value={form.name}
            onChange={formChange}
            placeholder="이름"
          />
        </Field>

        <Field label="전화번호">
          <Input
            name="phone"
            value={form.phone}
            onChange={formChange}
            placeholder="전화번호"
          />
        </Field>
      </Column>

      <LineBtn
        text="회원가입"
        onClick={signUp}
        className="absolute bottom-0 left-0 w-full px-4 pb-[env(safe-area-inset-bottom)] h-[48px] z-[999]"
      />
    </div>
  );
}
