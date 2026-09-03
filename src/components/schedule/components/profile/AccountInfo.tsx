"use client";

import { AtSign, Crown, Mail, Phone, Users } from "lucide-react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
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

  const { groups } = useActiveGroup();

  const nicknameDes = "한글 2~5자 또는 영문·숫자 4~10자까지 입력 가능합니다.";
  const phoneDes = "'-'를 제외한 숫자만 입력해주세요.";

  return (
    <BaseCard className="p-6" glow>
      <Column className="mb-3 gap-1">
        <span className="eyebrow">ACCOUNT</span>
        <h2 className="typo-sub-t-1 text-foreground">계정 정보</h2>
      </Column>

      <Column className="w-full">
        <InfoRow
          label="닉네임"
          icon={<AtSign size={13} strokeWidth={1.75} />}
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
          icon={<Phone size={13} strokeWidth={1.75} />}
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

        <InfoRow
          label="이메일"
          icon={<Mail size={13} strokeWidth={1.75} />}
          value={user.email}
        />

        <InfoRow
          label="소속 그룹"
          icon={<Users size={13} strokeWidth={1.75} />}
          valueSlot={
            groups.length === 0 ? (
              <span className="typo-caption-2 text-muted">
                소속된 그룹이 없습니다.
              </span>
            ) : (
              <Row className="flex-wrap gap-1.5">
                {groups.map((group) => (
                  <Row
                    key={group.groupNo}
                    className="neu-flat gap-1 rounded-full px-2.5 py-1"
                  >
                    <span className="typo-caption-3 text-secondary">
                      {group.groupName}
                    </span>
                    {group.groupRole === "SUPER" && (
                      <Crown
                        size={11}
                        strokeWidth={2}
                        className="text-pending-500"
                        aria-label="관리자"
                      />
                    )}
                  </Row>
                ))}
              </Row>
            )
          }
        />
      </Column>
    </BaseCard>
  );
}
