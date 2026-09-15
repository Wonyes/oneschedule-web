"use client";

import { AtSign, Crown, Mail, Phone, User, Users } from "lucide-react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { InfoRow } from "@/src/components/ui/layout/InfoRow";
import { MyInfoResponse } from "@/src/hooks/querys/useMembers";
import { useProfileEdit } from "@/src/hooks/useProfileEdit";
import { motion } from "motion/react";
import { rise, stagger } from "@/src/lib/motion";
import Link from "next/link";
import GroupAvatar from "@/src/components/group/GroupAvatar";
import { groupPath } from "@/src/lib/activeGroup";

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
  const dim = (field: string) =>
    editingField !== null && editingField !== field;

  const nameDes = "2~20자까지 입력 가능합니다.";
  const nicknameDes = "한글 2~5자 또는 영문·숫자 4~10자까지 입력 가능합니다.";
  const phoneDes = "'-'를 제외한 숫자만 입력해주세요.";

  const formatPhone = (phoneNumber: string) =>
    phoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");

  return (
    <BaseCard className="p-4 sm:p-5" glow>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex w-full flex-col gap-2"
      >
        <motion.div variants={rise} className="flex flex-col gap-1">
          <span className="eyebrow">ACCOUNT</span>
          <h2 className="typo-sub-t-1 text-foreground">계정 정보</h2>
        </motion.div>

        <Column className="w-full">
          <motion.div variants={rise} className="w-full">
            <InfoRow
              label="이름"
              icon={<User size={13} strokeWidth={1.75} />}
              name="name"
              value={editingField === "name" ? form.name : user.name}
              editing={editingField === "name"}
              dimmed={dim("name")}
              error={errors.name}
              deps={nameDes}
              success={success.name}
              onEdit={() => startEdit("name")}
              onSave={saveEdit}
              onCancel={cancelEdit}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div variants={rise} className="w-full">
            <InfoRow
              label="닉네임"
              icon={<AtSign size={13} strokeWidth={1.75} />}
              name="nickname"
              value={
                editingField === "nickname" ? form.nickname : user.nickname
              }
              editing={editingField === "nickname"}
              dimmed={dim("nickname")}
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
          </motion.div>

          <motion.div variants={rise} className="w-full">
            <InfoRow
              label="전화번호"
              icon={<Phone size={13} strokeWidth={1.75} />}
              name="phoneNumber"
              value={
                editingField === "phoneNumber"
                  ? form.phoneNumber
                  : formatPhone(user.phoneNumber ?? "")
              }
              valueSlot={
                user.phoneNumber ? undefined : (
                  <span className="typo-caption-2 text-muted">
                    등록된 번호가 없습니다.
                  </span>
                )
              }
              error={errors.phoneNumber}
              deps={phoneDes}
              success={success.phoneNumber}
              editing={editingField === "phoneNumber"}
              dimmed={dim("phoneNumber")}
              onEdit={() => startEdit("phoneNumber")}
              onSave={saveEdit}
              onCancel={cancelEdit}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div variants={rise} className="w-full">
            <InfoRow
              label="이메일"
              dimmed={dim("email")}
              icon={<Mail size={13} strokeWidth={1.75} />}
              value={user.email}
            />
          </motion.div>

          <motion.div variants={rise} className="w-full">
            <InfoRow
              label="소속 그룹"
              dimmed={dim("groups")}
              icon={<Users size={13} strokeWidth={1.75} />}
              valueSlot={
                groups.length === 0 ? (
                  <span className="typo-caption-2 text-muted">
                    소속된 그룹이 없습니다.
                  </span>
                ) : (
                  <Row className="flex-wrap gap-2">
                    {groups.map((group) => (
                      <Link
                        key={group.groupNo}
                        href={groupPath(group)}
                        prefetch
                        className="neu-flat btn-spring flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-3 hover:shadow-[var(--elevation-2)]"
                      >
                        <GroupAvatar
                          name={group.groupName}
                          imageUrl={group.profileImageUrl}
                          size="xs"
                        />
                        <span className="typo-caption-2 font-medium text-foreground">
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
                      </Link>
                    ))}
                  </Row>
                )
              }
            />
          </motion.div>
        </Column>
      </motion.div>
    </BaseCard>
  );
}
