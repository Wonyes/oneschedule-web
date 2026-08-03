"use client";

import { Primary } from "@/src/components/ui/layout/button";
import { Column } from "@/src/components/ui/layout/flex";
import { Input, PasswordInput } from "@/src/components/ui/layout/input";
import { useForm } from "@/src/hooks/useForm";
import Field from "../../layout/Field";
import { Post } from "@/src/hooks/querys/useMutations";
import { useRouter } from "next/navigation";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { useOverlay } from "@/src/hooks/useOverlay";
import { useEmailCheck, useNicknameCheck } from "@/src/hooks/querys/useMembers";
import { useState } from "react";

export default function SignForm() {
  const router = useRouter();
  const { openAlert } = useOverlay();

  const { form, formChange } = useForm({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    name: "",
    phone: "",
  });

  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const { refetch: checkEmail } = useEmailCheck(form.email);
  const { refetch: checkNickname } = useNicknameCheck(form.nickname);

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
    onError: (err) => {
      openAlert({
        title: "회원가입에 실패하였습니다.",
        message: err.data.result.errorMessage,
      });
    },
  });

  const signForm = () => {
    if (!emailChecked) {
      return openAlert({
        title: "이메일 중복확인이 필요합니다.",
        message: "이메일 중복확인을 해주세요.",
      });
    } else if (!nicknameChecked) {
      return openAlert({
        title: "닉네임 중복확인이 필요합니다.",
        message: "닉네임 중복확인을 해주세요.",
      });
    } else if (form.password !== form.passwordConfirm) {
      return openAlert({
        title: "비밀번호가 일치하지 않습니다.",
        message: "비밀번호가 일치하지 않습니다.",
      });
    } else if (form.password.length < 8) {
      return openAlert({
        title: "비밀번호는 8자 이상이어야 합니다.",
        message: "비밀번호는 8자 이상이어야 합니다.",
      });
    } else if (!form.name) {
      return openAlert({
        title: "이름을 입력해주세요.",
        message: "이름을 입력해주세요.",
      });
    } else {
      signUp();
    }
  };

  const duplicationCheck = async (name: "email" | "nickname") => {
    const { data } =
      name === "email" ? await checkEmail() : await checkNickname();

    if (name === "email") {
      setEmailChecked(data);
    } else {
      setNicknameChecked(data);
    }

    if (!data) {
      return openAlert({
        title: "중복 확인 실패",
        message: `이미 사용 중인 ${name === "email" ? "이메일" : "닉네임"}입니다.`,
      });
    }

    openAlert({
      title: "사용 가능합니다.",
      message: `사용 가능한 ${name === "email" ? "이메일" : "닉네임"}입니다.`,
    });
  };

  return (
    <div className="max-w-[420px] w-full mx-auto relative flex flex-col h-full text-slate-100">
      <header className="pt-2 pb-5 px-1 shrink-0">
        <h1 className="text-xl font-bold text-slate-100">회원정보 입력</h1>
        <p className="text-xs text-slate-400 mt-1">
          서비스 이용을 위한 정보를 입력해주세요.
        </p>
      </header>

      <Column className="gap-5 flex-1 overflow-y-auto px-1 pb-28">
        <Field label="이메일">
          <Input
            className="h-[52px]"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={formChange}
            description="로그인 및 계정 복구, 주요 알림 수신에 사용됩니다."
            rightSection={
              <Primary
                text="중복확인"
                className="py-[6px] px-3 rounded-lg text-xs"
                onClick={() => {
                  duplicationCheck("email");
                }}
              />
            }
          />
        </Field>

        <Field label="비밀번호">
          <div className="flex flex-col gap-3 w-full">
            <PasswordInput
              className="h-[52px]"
              name="password"
              value={form.password}
              onChange={formChange}
              placeholder="비밀번호"
            />
            <PasswordInput
              className="h-[52px]"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={formChange}
              placeholder="비밀번호 확인"
              description="영문, 숫자, 특수문자를 조합하여 8자 이상 입력해주세요."
            />
          </div>
        </Field>

        <Field label="이름">
          <Input
            className="h-[52px]"
            name="name"
            value={form.name}
            onChange={formChange}
            placeholder="이름"
            description="본인 명의의 실명을 입력해주세요."
          />
        </Field>

        <Field label="닉네임">
          <Input
            className="h-[52px]"
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={formChange}
            description="서비스 내에서 사용될 고유한 닉네임을 입력해주세요."
            rightSection={
              <Primary
                text="중복확인"
                className="py-[6px] px-3 rounded-lg text-xs"
                onClick={() => {
                  duplicationCheck("nickname");
                }}
              />
            }
          />
        </Field>

        <Field label="전화번호">
          <Input
            className="h-[52px]"
            name="phone"
            value={form.phone}
            onChange={formChange}
            placeholder="전화번호"
            description="'-'를 제외한 숫자만 입력해주세요."
          />
        </Field>
      </Column>

      <div className="absolute bottom-4 left-0 w-full pb-[calc(env(safe-area-inset-bottom)+12px)] px-1 z-[999]">
        <Primary
          text="회원가입"
          onClick={signForm}
          className="w-full py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-600/30"
        />
      </div>
    </div>
  );
}
