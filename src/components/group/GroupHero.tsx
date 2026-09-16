"use client";

import { Copy, Crown, Pencil, UserPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import BaseCard from "../ui/card/BaseCard";
import VisibilityBadge from "./VisibilityBadge";
import { Row, Column } from "../ui/layout/flex";
import { motion } from "motion/react";
import { rise, stagger } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";
import { GhostBtn } from "../ui/layout/button";
import { GroupEditPanel } from "./GroupHeroEditors";
import { useOverlay } from "@/src/hooks/useOverlay";
import { useRef, useState } from "react";
import { countOnline } from "@/src/utils/presence";
import {
  useGroupProfileImageUpload,
  useJoinRequests,
  useMemberPresence,
  useUpdateGroupSetting,
} from "@/src/hooks/querys/useGroup";
import GroupOrbit from "./GroupOrbit";
import { UPCOMING_RANGE_DAYS, useGroupSchedules } from "./useGroupSchedules";
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
  const pathname = usePathname();
  const clearActiveGroup = useActiveGroupStore((s) => s.clearActiveGroup);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadImage } = useGroupProfileImageUpload();
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

  const groupFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    uploadImage(
      { file, groupNo: group.groupNo },
      {
        onError: (err) => {
          openToast({ message: getErrorMessage(err) });
        },
      },
    );
  };

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
  const canReview = isAdmin && group.visibility === "PUBLIC_APPROVAL";
  const editing = groupNameCorrection || descriptionEditing;

  const { today, upcoming } = useGroupSchedules(group.groupNo);
  const { data: presence } = useMemberPresence(group.groupNo);
  const { data: requestPages } = useJoinRequests(group.groupNo, canReview);
  const pendingCount = requestPages?.pages[0]?.totalElements ?? 0;
  const onlineCount = countOnline(presence);

  const scrollTo = (ids: string[]) => {
    const target = ids
      .map((id) => document.getElementById(id))
      .find((el) => el && el.offsetParent !== null);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToRequests = () => {
    router.replace(`${pathname}?tab=requests`, { scroll: false });
    scrollTo(["group-manage", "group-team"]);
  };

  const startEditing = () => {
    setDescriptionDraft(group.description ?? "");
    setGroupNameCorrection(true);
    setDescriptionEditing(true);
  };

  const cancelEditing = () => {
    setGroupNameCorrection(false);
    setDescriptionEditing(false);
  };

  const saveEditing = () => {
    const nameChanged = form.groupName.trim() !== group.groupName;
    const descChanged = descriptionDraft.trim() !== (group.description ?? "");

    if (nameChanged) changeGroupName();
    else setGroupNameCorrection(false);

    if (descChanged) saveDescription();
    else setDescriptionEditing(false);
  };

  return (
    <BaseCard glow className="relative overflow-hidden p-4 sm:p-5 sm:p-4 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full glow-blob"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-10"
      >
        <motion.div variants={rise}>
          <GroupOrbit
            name={group.groupName}
            imageUrl={group.profileImageUrl}
            members={group.members}
            presence={presence}
            canEditImage={isAdmin}
            onPickImage={() => fileInputRef.current?.click()}
            onMemberClick={() => scrollTo(["group-team"])}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={groupFileChange}
          />
        </motion.div>

        <Column className="w-full min-w-0 flex-1 items-center gap-2 text-center lg:items-start lg:text-left">
          <motion.div variants={rise}>
            <Row className="flex-wrap justify-center gap-1.5 lg:justify-start">
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
          </motion.div>

          {editing ? (
            <motion.div variants={rise} className="w-full">
              <GroupEditPanel
                name={form.groupName}
                onNameChange={formChange}
                description={descriptionDraft}
                onDescriptionChange={setDescriptionDraft}
                onSave={saveEditing}
                onCancel={cancelEditing}
                saving={savingDescription}
              />
            </motion.div>
          ) : (
            <motion.div variants={rise} className="w-full min-w-0">
              <h1 className="typo-h2 truncate text-foreground">
                {group.groupName}
              </h1>
              <p
                className={cn(
                  "mx-auto mt-1.5 max-w-[520px] typo-caption-1 leading-relaxed lg:mx-0",
                  group.description ? "text-secondary" : "text-place-h",
                )}
              >
                {group.description || "아직 그룹 소개가 없어요."}
              </p>
            </motion.div>
          )}

          <motion.div variants={rise}>
            <Row className="mt-1 flex-wrap justify-center gap-x-4 gap-y-1.5 lg:justify-start">
              <Stat label="멤버" value={group.members.length} />
              <Stat label="온라인" value={onlineCount} tone="success" />
              <Stat label="오늘" value={today.length} />
              <Stat
                label={`${UPCOMING_RANGE_DAYS}일 내`}
                value={upcoming.length}
              />
            </Row>
          </motion.div>

          <motion.div variants={rise} className="w-full">
            <Row className="mt-2 w-full flex-wrap justify-center gap-2 lg:justify-start">
              <Row className="neu-pressed h-9 min-w-0 gap-2 rounded-lg pl-3 pr-1.5">
                <span className="typo-caption-3 shrink-0 text-place-h">
                  초대 코드
                </span>
                <span className="min-w-0 truncate typo-caption-2 font-semibold tabular-nums text-foreground">
                  {group.groupCode}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  aria-label="초대 코드 복사"
                  className="neu-btn btn-spring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:text-foreground"
                >
                  <Copy size={12} strokeWidth={1.75} />
                </button>
              </Row>

              {isAdmin && pendingCount > 0 && (
                <button
                  type="button"
                  onClick={goToRequests}
                  className="btn-spring flex h-9 items-center gap-1.5 rounded-lg bg-accent/12 px-3 typo-caption-2 font-semibold text-accent hover:bg-accent/20"
                >
                  <UserPlus size={13} strokeWidth={2} />
                  가입 신청 {pendingCount}건
                </button>
              )}

              {isAdmin && !editing && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="neu-btn btn-spring flex h-9 items-center gap-1.5 rounded-lg px-3 typo-caption-2 font-medium text-secondary hover:text-foreground"
                >
                  <Pencil size={13} strokeWidth={1.75} />
                  그룹 편집
                </button>
              )}

              <GhostBtn
                onClick={withdrawGroups}
                text={isAdmin ? "그룹 해체" : "그룹 탈퇴"}
                className="typo-caption-2 h-9 w-fit px-3 text-place-h hover:text-error-500 lg:ml-auto"
              />
            </Row>
          </motion.div>
        </Column>
      </motion.div>
    </BaseCard>
  );
};

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "success";
}) {
  return (
    <Row className="items-baseline gap-1">
      <span className="typo-caption-3 text-place-h">{label}</span>
      <span
        className={cn(
          "typo-caption-1 font-semibold tabular-nums",
          tone === "success" && value > 0
            ? "text-success-500"
            : "text-foreground",
        )}
      >
        {value}
      </span>
    </Row>
  );
}
