"use client";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column } from "@/src/components/ui/layout/flex";
import { InfoRow } from "@/src/components/ui/layout/InfoRow";
import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { useProfileEdit } from "@/src/hooks/useProfileEdit";

export default function AccountInfo({ user }: { user: MyInfoResponse }) {
  const {
    form,
    errors,
    success,
    editingField,

    startEdit,
    handleChange,

    checkNicknameDuplicate,

    saveEdit,
    cancelEdit,
  } = useProfileEdit(user);
  const nicknameDes = "한글 2~5자 또는 영문·숫자 4~10자까지 입력 가능합니다.";
  const phoneDes = "'-'를 제외한 숫자만 입력해주세요.";

  return (
    <BaseCard className="p-7" glow>
      <h2 className="typo-sub-t-2 text-slate-100 mb-5">계정 정보</h2>

      <Column>
        <InfoRow
          label="닉네임"
          name="nickname"
          value={editingField === "nickname" ? form.nickname : user.nickname}
          editing={editingField === "nickname"}
          showCheck
          error={errors.nickname}
          deps={nicknameDes}
          success={success.nickname}
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
            editingField === "phoneNumber" ? form.phoneNumber : user.phoneNumber
          }
          error={errors.phoneNumber}
          deps={phoneDes}
          success={success.phoneNumber}
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
  );
}
