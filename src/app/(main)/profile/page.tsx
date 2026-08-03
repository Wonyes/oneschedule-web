"use client";

import { LogOut, Lock } from "lucide-react";
import { useState } from "react";

import {
  useMyInfo,
  useLogout,
  useMyinfoChange,
  useNicknameCheck,
} from "@/src/hooks/querys/useMembers";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { useForm } from "@/src/hooks/useForm";
import { ActionRow, Column } from "@/src/components/ui/layout/flex";
import { InfoRow } from "@/src/components/ui/layout/InfoRow";

export default function ProfilePage() {
  const { data: user, isLoading } = useMyInfo();
  const { mutate: logout } = useLogout();

  const [editingField, setEditingField] = useState<
    "nickname" | "phoneNumber" | null
  >(null);

  const [nicknameChecked, setNicknameChecked] = useState(false);

  const { form, formChange, setForm, errors, setErrors } = useForm({
    nickname: "",
    phoneNumber: "",
  });

  const { refetch: checkNickname } = useNicknameCheck(form.nickname);
  const { mutate: changeInfo } = useMyinfoChange();

  if (isLoading) {
    return (
      <main className="max-w-[420px] mx-auto flex flex-col gap-5">
        <div className="h-[220px] rounded-[32px] neu-flat animate-pulse" />
        <div className="h-[280px] rounded-[32px] neu-flat animate-pulse" />
      </main>
    );
  }

  if (!user) return null;

  const startEdit = (field: "nickname" | "phoneNumber") => {
    setEditingField(field);

    if (field === "nickname") {
      setNicknameChecked(false);
    }

    setForm({
      nickname: user.nickname,
      phoneNumber: user.phoneNumber,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formChange(e);

    if (e.target.name === "nickname") {
      setNicknameChecked(false);
    }
  };

  const checkNicknameDuplicate = async () => {
    const { data } = await checkNickname();

    setNicknameChecked(data);
  };

  const saveEdit = () => {
    if (
      editingField === "nickname" &&
      form.nickname !== user.nickname &&
      !nicknameChecked
    ) {
      return;
    }

    changeInfo(
      {
        nickname: form.nickname,
        phoneNumber: form.phoneNumber,
      },
      {
        onError: (error) => {
          console.log(error);
          if (editingField) {
            setErrors({
              [editingField]: error.message,
            });
          }
        },

        onSuccess: () => {
          setEditingField(null);
        },
      },
    );
  };

  const cancelEdit = () => {
    setEditingField(null);

    setForm({
      nickname: user.nickname,
      phoneNumber: user.phoneNumber,
    });

    setErrors({
      nickname: "",
      phoneNumber: "",
    });
  };

  return (
    <main className="max-w-[420px] mx-auto flex flex-col gap-5">
      <BaseCard className="p-8" glow>
        <Column className="items-center text-center">
          <h1 className="typo-h4 text-slate-100">{user.nickname}</h1>

          <p className="mt-1 typo-sub-t-2 text-slate-400">{user.name}</p>
        </Column>
      </BaseCard>

      <BaseCard className="p-7" glow>
        <h2 className="typo-sub-t-2 text-slate-100 mb-5">계정 정보</h2>

        <Column>
          <InfoRow
            label="닉네임"
            name="nickname"
            value={editingField === "nickname" ? form.nickname : user.nickname}
            editing={editingField === "nickname"}
            showCheck
            onEdit={() => startEdit("nickname")}
            onSave={saveEdit}
            onCancel={cancelEdit}
            onChange={handleChange}
            onCheck={checkNicknameDuplicate}
          />

          <InfoRow
            label="전화번호"
            name="phoneNumber"
            value={
              editingField === "phoneNumber"
                ? form.phoneNumber
                : user.phoneNumber
            }
            error={errors.phoneNumber}
            editing={editingField === "phoneNumber"}
            onEdit={() => startEdit("phoneNumber")}
            onSave={saveEdit}
            onCancel={cancelEdit}
            onChange={handleChange}
          />

          <InfoRow label="이메일" value={user.email} />

          <InfoRow
            label="소속그룹"
            value={user.groupCode ?? "소속된 그룹이 없습니다."}
          />
        </Column>
      </BaseCard>

      <BaseCard className="overflow-hidden" glow>
        <ActionRow icon={<Lock size={18} />} title="비밀번호 변경" />

        <ActionRow
          icon={<LogOut size={18} />}
          title="로그아웃"
          danger
          onClick={() => logout()}
        />
      </BaseCard>
    </main>
  );
}
