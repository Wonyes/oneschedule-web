"use client";

import { Copy, Crown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import BaseCard from "../ui/card/BaseCard";
import VisibilityBadge from "./VisibilityBadge";
import { Row, Column } from "../ui/layout/flex";
import AvatarImage from "@/src/components/common/AvatarImage";
import { motion } from "motion/react";
import { rise, stagger } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";
import { GhostBtn, Primary } from "../ui/layout/button";
import { useOverlay } from "@/src/hooks/useOverlay";
import { useState } from "react";
import { Input } from "../ui/layout/input";
import { Textarea } from "../ui/layout/textarea";
import { useUpdateGroupSetting } from "@/src/hooks/querys/useGroup";
import { useForm } from "@/src/hooks/useForm";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { Delete, Put } from "@/src/hooks/querys/useMutations";
import { useQueryClient } from "@tanstack/react-query";
import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { memberskeys } from "@/src/hooks/querys/key/members";
import { MyGroupResponse } from "@/src/types/group";
import { useActiveGroupStore } from "@/src/hooks/stores/useActiveGroupStore";

export const GroupHero = ({ group }: { group: MyGroupResponse }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearActiveGroup = useActiveGroupStore((s) => s.clearActiveGroup);

  const { openToast, openConfirm } = useOverlay();
  const { form, formChange } = useForm({
    groupName: group.groupName,
  });
  const [groupNameCorrection, setGroupNameCorrection] = useState(false);

  const [descriptionEditing, setDescriptionEditing] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(
    group.description ?? "",
  );

  const { mutate: updateSetting, isPending: savingDescription } =
    useUpdateGroupSetting(group.groupNo);

  const saveDescription = () => {
    updateSetting(
      { description: descriptionDraft.trim() },
      {
        onSuccess: () => {
          setDescriptionEditing(false);
          openToast({ message: "그룹 소개를 저장했습니다." });
        },
        onError: (err) => openToast({ message: getErrorMessage(err) }),
      },
    );
  };

  const copyCode = () => {
    navigator.clipboard.writeText(group.groupCode);
    openToast({
      message: "초대 코드가 복사되었습니다.",
    });
  };

  const { mutate: changeGroupName } = useAppMutation({
    mutationFn: () =>
      Put({
        url: `/group/group-name/${group.groupNo}`,
        body: null,
        params: {
          groupName: form.groupName,
        },
      }),

    onSuccess: () => {
      setGroupNameCorrection(false);
      queryClient.invalidateQueries({
        queryKey: [groupkeys.myGroup],
      });

      openToast({
        message: "그룹 이름이 변경되었습니다.",
      });
    },
    onError: (err) => {
      openToast({
        message: getErrorMessage(err),
      });
    },
    retry: false,
  });

  const { mutate: deleteGroup } = useAppMutation({
    mutationFn: () =>
      group.groupRole === "SUPER"
        ? Delete({ url: `/group/${group.groupNo}/disband` })
        : Delete({
            url: "/group/leave",
            params: { groupNo: group.groupNo },
          }),
    onSuccess: async () => {
      clearActiveGroup();

      await queryClient.removeQueries({
        queryKey: [groupkeys.myGroup],
      });

      await queryClient.invalidateQueries({
        queryKey: [memberskeys.myInfo],
      });

      router.refresh();

      openToast({
        message:
          group.groupRole === "SUPER"
            ? "그룹이 해체되었습니다."
            : "그룹에서 탈퇴했습니다.",
      });
    },
    onError: (err) => {
      openToast({
        message: getErrorMessage(err),
      });
    },
  });

  const withdrawGroups = () => {
    openConfirm({
      title: group.groupRole === "SUPER" ? "그룹해체" : "그룹탈퇴",
      message:
        group.groupRole === "SUPER"
          ? "정말 그룹을 해체하시겠습니까?"
          : "정말 그룹을 탈퇴하시겠습니까?",
      mainBtn: group.groupRole === "SUPER" ? "해체" : "탈퇴",
      subBtn: "취소",
      onFunc: () => {
        deleteGroup();
      },
    });
  };

  const isAdmin = group.groupRole === "SUPER";
  const visibleMembers = group.members.slice(0, 4);
  const hiddenCount = group.members.length - visibleMembers.length;

  return (
    <BaseCard glow className="relative overflow-hidden p-5 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative flex flex-col gap-5"
      >
        <motion.div variants={rise} className="flex items-start gap-4">
          <div className="neu-float flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] typo-title-1 font-bold text-accent sm:h-[72px] sm:w-[72px]">
            {group.groupName.trim().charAt(0).toUpperCase()}
          </div>

          <Column className="min-w-0 flex-1 gap-1.5">
            <Row className="flex-wrap gap-1.5">
              <span className="eyebrow">GROUP</span>
              <VisibilityBadge visibility={group.visibility} />
              {isAdmin && (
                <Row className="neu-flat h-6 gap-1 rounded-full px-2.5">
                  <Crown
                    size={12}
                    strokeWidth={2}
                    className="text-pending-500"
                  />
                  <span className="typo-caption-3 font-semibold text-pending-500">
                    관리자
                  </span>
                </Row>
              )}
            </Row>

            {groupNameCorrection ? (
              <Row className="w-full gap-2">
                <Input
                  name="groupName"
                  value={form.groupName}
                  onChange={formChange}
                  onEnter={changeGroupName}
                />
                <Primary
                  text="변경"
                  className="h-11 w-fit shrink-0 px-4"
                  onClick={changeGroupName}
                />
                <GhostBtn
                  text="취소"
                  className="h-11 w-fit shrink-0 px-3"
                  onClick={() => setGroupNameCorrection(false)}
                />
              </Row>
            ) : (
              <Row className="min-w-0 gap-1.5">
                <h1 className="typo-title-1 truncate text-foreground">
                  {group.groupName}
                </h1>
                {isAdmin && (
                  <GhostBtn
                    onClick={() => setGroupNameCorrection(true)}
                    ariaLabel="그룹 이름 수정"
                    className="h-8 w-8 shrink-0 px-0"
                    icon={
                      <Pencil
                        size={14}
                        strokeWidth={1.75}
                        className="text-muted"
                      />
                    }
                  />
                )}
              </Row>
            )}

            {descriptionEditing ? (
              <Column className="mt-1 w-full gap-2">
                <Textarea
                  value={descriptionDraft}
                  maxLength={200}
                  placeholder="어떤 그룹인지 한두 줄로 소개해 주세요."
                  description="공개 그룹 목록에서 이 문구가 함께 보입니다."
                  onChange={(e) => setDescriptionDraft(e.target.value)}
                />
                <Row className="justify-end gap-2">
                  <GhostBtn
                    text="취소"
                    className="typo-caption-2 h-8 px-3"
                    onClick={() => setDescriptionEditing(false)}
                  />
                  <Primary
                    text={savingDescription ? "저장 중…" : "저장"}
                    className="typo-caption-2 h-8 px-4"
                    isDisabled={savingDescription}
                    onClick={saveDescription}
                  />
                </Row>
              </Column>
            ) : (
              <Row className="min-w-0 items-start gap-1">
                <p
                  className={cn(
                    "typo-caption-1 min-w-0 leading-relaxed",
                    group.description ? "text-secondary" : "text-place-h",
                  )}
                >
                  {group.description || "아직 그룹 소개가 없어요."}
                </p>
                {isAdmin && (
                  <GhostBtn
                    ariaLabel="그룹 소개 수정"
                    className="h-6 w-6 shrink-0 px-0"
                    onClick={() => {
                      setDescriptionDraft(group.description ?? "");
                      setDescriptionEditing(true);
                    }}
                    icon={
                      <Pencil
                        size={12}
                        strokeWidth={1.75}
                        className="text-muted"
                      />
                    }
                  />
                )}
              </Row>
            )}
          </Column>
        </motion.div>

        <motion.div
          variants={rise}
          className="flex flex-col gap-3 border-t border-divider pt-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <Row className="flex-wrap gap-2.5">
            <Row className="neu-pressed h-9 gap-2 rounded-lg pl-3 pr-1.5">
              <span className="typo-caption-3 text-place-h">초대 코드</span>
              <span className="typo-caption-2 font-semibold tabular-nums text-foreground">
                {group.groupCode}
              </span>
              <button
                type="button"
                onClick={copyCode}
                aria-label="초대 코드 복사"
                className="neu-btn btn-spring flex h-6 w-6 items-center justify-center rounded-md text-muted hover:text-foreground"
              >
                <Copy size={12} strokeWidth={1.75} />
              </button>
            </Row>

            <Row className="gap-2">
              <Row className="-space-x-2">
                {visibleMembers.map((member) => (
                  <span
                    key={member.memberNo}
                    title={member.nickname}
                    className="neu-flat flex h-7 w-7 items-center justify-center overflow-hidden rounded-full typo-caption-3 font-bold text-accent ring-2 ring-[var(--surface)]"
                  >
                    <AvatarImage
                      src={member.profileImageUrl}
                      nickname={member.nickname}
                    />
                  </span>
                ))}
                {hiddenCount > 0 && (
                  <span className="neu-flat flex h-7 w-7 items-center justify-center rounded-full typo-caption-3 font-semibold text-muted ring-2 ring-[var(--surface)]">
                    +{hiddenCount}
                  </span>
                )}
              </Row>
              <span className="typo-caption-2 text-muted">
                멤버 {group.members.length}명
              </span>
            </Row>
          </Row>

          <GhostBtn
            onClick={withdrawGroups}
            text={isAdmin ? "그룹 해체" : "그룹 탈퇴"}
            className="typo-caption-2 h-8 w-fit self-end px-3 text-place-h hover:text-error-500 sm:self-auto"
          />
        </motion.div>
      </motion.div>
    </BaseCard>
  );
};
