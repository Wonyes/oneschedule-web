"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Column } from "../../ui/layout/flex";
import Dropdown from "../../ui/Dropdown";
import { useForm } from "@/src/hooks/useForm";
import { GroupMember, GroupRole } from "@/src/types/group";
import { Input } from "../../ui/layout/input";


const roleOptions = [
  {
    label: "관리자",
    value: "SUB",
  },
  {
    label: "일반 멤버",
    value: "MEMBER",
  },
];

interface GroupMemberEditValues {
  memberNo: number;
  groupRole: GroupRole;
  position: string;
}

export interface GroupMemberEditRef {
  submit: (onSuccess: (data: GroupMemberEditValues) => void) => void;
}

export const GroupMemberEditContent = forwardRef<
  GroupMemberEditRef,
  {
    member: GroupMember;
  }
>(({ member }, ref) => {
  const { form, setForm, formChange } = useForm({
    groupRole: member.groupRole as GroupRole,
    position: member.position ?? "",
  });

  useImperativeHandle(ref, () => ({
    submit: (onSuccess) => {
      onSuccess({
        memberNo: member.memberNo,
        groupRole: form.groupRole,
        position: form.position,
      });
    },
  }));

  return (
    <Column className="gap-4 w-full">
      <span className="typo-caption-2 text-muted">
        {member.nickname}님의 정보를 변경합니다.
      </span>

      <Column className="gap-2 w-full">
        <span className="typo-caption-1 text-muted">권한</span>

        <Dropdown
          value={form.groupRole}
          options={roleOptions}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              groupRole: value as GroupRole,
            }))
          }
        />
      </Column>

      <Column className="gap-2 w-full">
        <span className="typo-caption-1 text-muted">직책</span>

        <Input
          name="position"
          value={form.position}
          onChange={formChange}
          placeholder="직책을 입력해주세요."
        />
      </Column>
    </Column>
  );
});

GroupMemberEditContent.displayName = "GroupMemberEditContent";
