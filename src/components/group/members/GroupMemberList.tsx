"use client";

import MemberAvatar from "@/src/components/common/MemberAvatar";
import PresenceDot from "@/src/components/common/PresenceDot";
import { getPresence } from "@/src/utils/presence";
import { MoreVertical } from "lucide-react";
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Row, Column } from "../../ui/layout/flex";
import { useOverlay } from "@/src/hooks/useOverlay";
import {
  GroupMemberEditContent,
  GroupMemberEditRef,
} from "./GroupMemberEditContent";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { Patch, Delete } from "@/src/hooks/querys/useMutations";
import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import DropdownMenu from "../../ui/DropdownMenu";
import { GroupMember, GroupRole, roleOf } from "@/src/types/group";
import { useMyInfo } from "@/src/hooks/querys/useMembers";
import { useIncrementalList } from "@/src/hooks/useIncrementalList";
import { useMemberPresence } from "@/src/hooks/querys/useGroup";
import { cn } from "@/src/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import { fadeQuick, springSoft } from "@/src/lib/motion";
import { PAGE_SIZE } from "@/src/lib/paging";
import ScrollListArea, { ScrollSentinel } from "../../ui/ScrollListArea";
import RoleBadge from "../RoleBadge";

export default function GroupMemberList({
  members,
  manager,
  groupNo,
}: {
  members: GroupMember[];
  /** 보는 사람이 관리자면 멤버 관리 메뉴가 보인다 */
  manager: boolean;
  groupNo: number;
}) {
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
    <ScrollListArea
      rootRef={rootRef}
      showFade={hasMore}
      className="scroll-hidden flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pb-3"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {visibleMembers.map((member: GroupMember) => {
          const { online: isOnline, label: statusLabel } = getPresence(
            presence,
            member.memberNo,
          );
          const canManage =
            manager &&
            !roleOf(member.groupRole).owner &&
            member.memberNo !== myInfo?.memberNo;

          return (
            <motion.div
              key={member.memberNo}
              layout
              exit={{ opacity: 0, x: 24, transition: fadeQuick }}
              transition={springSoft}
              className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-hover"
            >
              <span className="relative shrink-0">
                <MemberAvatar
                  nickname={member.nickname}
                  src={member.profileImageUrl}
                />
                <PresenceDot online={isOnline} title={statusLabel} />
              </span>

              <Column className="min-w-0 flex-1 gap-0">
                <Row className="min-w-0 gap-1.5">
                  <span className="truncate typo-caption-2 font-semibold text-foreground">
                    {member.nickname}
                  </span>
                  <RoleBadge role={member.groupRole} />
                </Row>
                <span
                  className={cn(
                    "truncate typo-caption-3",
                    isOnline ? "text-success-500" : "text-place-h",
                  )}
                >
                  {member.position ? `${member.position} · ` : ""}
                  {statusLabel}
                </span>
              </Column>

              {canManage && (
                <DropdownMenu
                  label="멤버 관리 메뉴"
                  align="right"
                  panelClassName="w-40 glass"
                  className="lg:opacity-0 lg:transition-opacity lg:focus-within:opacity-100 lg:group-hover:opacity-100"
                  triggerClassName="h-7 w-7 justify-center rounded-lg text-muted hover:bg-surface-hover hover:text-foreground"
                  trigger={() => <MoreVertical size={15} strokeWidth={1.75} />}
                >
                  {(close) => (
                    <>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          close();
                          memberChanges(member);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left typo-caption-2 text-secondary hover:bg-surface-hover"
                      >
                        멤버 수정
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          close();
                          memberDelete(member);
                        }}
                        className="mt-1 w-full rounded-lg px-3 py-2 text-left typo-caption-2 text-error-500 hover:bg-surface-hover"
                      >
                        그룹 내보내기
                      </button>
                    </>
                  )}
                </DropdownMenu>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {hasMore && <ScrollSentinel sentinelRef={sentinelRef} />}
    </ScrollListArea>
  );
}
