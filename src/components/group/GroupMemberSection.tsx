"use client";

import AvatarImage from "@/src/components/common/AvatarImage";
import { Crown, MoreVertical } from "lucide-react";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import BaseCard from "../ui/card/BaseCard";
import { Row, Column, Between } from "../ui/layout/flex";
import { useOverlay } from "@/src/hooks/useOverlay";
import {
  GroupMemberEditContent,
  GroupMemberEditRef,
} from "../ui/overlay/modal/GroupMemberEditContent";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { Patch, Delete } from "@/src/hooks/querys/useMutations";
import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import IconBox from "../ui/IconBox";
import { GroupMember } from "@/src/types/group";
import { useMyInfo } from "@/src/hooks/querys/useMembers";
import { useIncrementalList } from "@/src/hooks/useIncrementalList";
import { useMemberPresence } from "@/src/hooks/querys/useGroup";
import { cn } from "@/src/utils/cn";
import { PAGE_SIZE } from "@/src/lib/paging";
import ScrollListArea, { ScrollSentinel } from "../ui/ScrollListArea";
import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";

type GroupRole = "SUPER" | "SUB" | "MEMBER";

export default function GroupMemberSection({
  members,
  isAdmin,
  groupNo,
}: {
  members: GroupMember[];
  isAdmin: boolean;
  groupNo: number;
}) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const { data: myInfo } = useMyInfo();
  const { data: presence } = useMemberPresence(groupNo);
  const { openModal, openToast, openConfirm, closeModal } = useOverlay();

  const queryClient = useQueryClient();
  const { mutate: updateMember } = useAppMutation({
    mutationFn: ({
      memberNo,
      groupRole,
      position,
    }: {
      memberNo: number;
      groupRole: GroupRole;
      position: string;
    }) =>
      Patch({
        url: `/group/${groupNo}/member/${memberNo}`,
        body: null,
        params: {
          groupRole,
          position,
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [groupkeys.myGroup],
      });

      openToast({
        message: "멤버 정보를 수정했습니다.",
      });

      closeModal();
    },

    onError: (err) => {
      openToast({
        message: getErrorMessage(err),
      });
    },
  });

  const { mutate: deleteMember } = useAppMutation({
    mutationFn: (memberNo: number) =>
      Delete({
        url: `/group/${groupNo}/member/${memberNo}`,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [groupkeys.myGroup],
      });

      openToast({
        message: "멤버를 삭제했습니다.",
      });
    },
    onError: (err) => {
      openToast({
        message: getErrorMessage(err),
      });
    },
  });

  const memberEditRef = useRef<GroupMemberEditRef>(null);

  const {
    visible: visibleMembers,
    hasMore,
    rootRef,
    sentinelRef,
  } = useIncrementalList(members, PAGE_SIZE.groupMembers);

  const memberChanges = (member: GroupMember) => {
    setOpenMenu(null);

    openModal({
      title: "멤버 관리",

      content: () => (
        <GroupMemberEditContent ref={memberEditRef} member={member} />
      ),

      mainBtn: "저장",
      subBtn: "취소",

      onFunc: () => {
        memberEditRef.current?.submit((data) => {
          updateMember(data);
        });
      },
    });
  };

  const memberDelete = (member: GroupMember) => {
    setOpenMenu(null);

    openConfirm({
      title: `${member.nickname} 멤버 삭제`,
      message: `정말 ${member.nickname}를 추방하시겠습니까?`,
      mainBtn: "삭제",
      subBtn: "취소",
      onFunc: () => {
        deleteMember(member.memberNo);
      },
    });
  };

  return (
    <BaseCard glow className="flex flex-1 flex-col p-5">
      <div className="mb-4 flex shrink-0 flex-col gap-1.5">
        <span className="eyebrow">TEAM</span>
        <h2 className="typo-sub-t-1 text-foreground">그룹 멤버</h2>
      </div>

      <ScrollListArea
        rootRef={rootRef}
        showFade={hasMore}
        className="scroll-hidden flex flex-col gap-2.5 px-1 py-1 lg:max-h-[304px] lg:overflow-y-auto lg:pt-3 lg:pb-4"
      >
        {visibleMembers.map((member: GroupMember) => {
          const status = presence?.get(member.memberNo);
          const isOnline = status?.online ?? false;

          const statusLabel = isOnline
            ? "온라인"
            : status?.lastSeenAt
              ? formatDistanceToNowStrict(new Date(status.lastSeenAt), {
                  addSuffix: true,
                  locale: ko,
                })
              : "오프라인";

          return (
            <Between
              key={member.memberNo}
              className="w-full rounded-xl px-4 py-3 neu-flat"
            >
              <Row className="min-w-0 flex-1 gap-3">
                <IconBox
                  size="md"
                  shape="circle"
                  tone="accent"
                  className="overflow-hidden typo-caption-3 font-bold bg-accent/10 shrink-0"
                >
                  <AvatarImage
                    src={member.profileImageUrl}
                    nickname={member.nickname}
                  />
                </IconBox>

                <Column className="min-w-0">
                  <Row className="min-w-0 gap-1.5">
                    <span className="typo-caption-2 font-semibold text-foreground truncate">
                      {member.nickname}
                    </span>

                    {member.groupRole === "SUPER" && (
                      <Crown
                        size={12}
                        strokeWidth={1.75}
                        className="shrink-0 text-pending-500"
                      />
                    )}
                  </Row>

                  <span className="mt-0.5 typo-caption-3 text-place-h truncate">
                    {member.position}
                  </span>
                </Column>
              </Row>

              <Row className="relative shrink-0 items-center gap-2">
                <Column className="items-end gap-1">
                  <span
                    className="
                    rounded-full
                    bg-surface-hover
                    px-2.5 py-1
                    typo-caption-3
                    font-medium
                    text-secondary
                  "
                  >
                    {member.groupRole}
                  </span>

                  {/*
                  오프라인도 같은 자리에 그린다. 온라인일 때만 보이면 줄마다
                  높이가 달라져 목록이 들쭉날쭉해지고, 점이 없는 게 "오프라인"인지
                  "아직 안 불러온 것"인지 구분이 안 된다.
                */}
                  <Row
                    className={cn(
                      "items-center gap-1.5 rounded-full px-2 py-0.5",
                      isOnline ? "bg-success-500/12" : "bg-surface-hover",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 shrink-0 rounded-full",
                        isOnline
                          ? "bg-success-500 ring-2 ring-success-500/30"
                          : "bg-place-h",
                      )}
                    />
                    <span
                      className={cn(
                        "typo-caption-3 font-medium whitespace-nowrap",
                        isOnline ? "text-success-500" : "text-muted",
                      )}
                    >
                      {statusLabel}
                    </span>
                  </Row>
                </Column>

                {isAdmin &&
                  member.groupRole !== "SUPER" &&
                  member.memberNo !== myInfo?.memberNo && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenu(
                            openMenu === member.memberNo
                              ? null
                              : member.memberNo,
                          )
                        }
                        className="
                      flex h-7 w-7
                      items-center justify-center
                      rounded-lg
                      text-muted
                      btn-spring
                      hover:bg-surface-hover
                      hover:text-foreground
                    "
                      >
                        <MoreVertical size={15} strokeWidth={1.75} />
                      </button>

                      {openMenu === member.memberNo && (
                        <div
                          className="
                      absolute right-0 top-10 z-30
                      w-40 rounded-xl
                      glass
                      p-2
                    "
                        >
                          <button
                            onClick={() => memberChanges(member)}
                            className="
                          w-full rounded-lg
                          px-3 py-2
                          text-left
                          typo-caption-2
                          text-secondary
                          hover:bg-white/5
                        "
                          >
                            멤버 수정
                          </button>

                          <button
                            onClick={() => memberDelete(member)}
                            className="
                          mt-1 w-full rounded-lg
                          px-3 py-2
                          text-left
                          typo-caption-2
                          text-error-500
                          hover:bg-white/5
                        "
                          >
                            그룹 내보내기
                          </button>
                        </div>
                      )}
                    </div>
                  )}
              </Row>
            </Between>
          );
        })}

        {hasMore && <ScrollSentinel sentinelRef={sentinelRef} />}
      </ScrollListArea>
    </BaseCard>
  );
}
