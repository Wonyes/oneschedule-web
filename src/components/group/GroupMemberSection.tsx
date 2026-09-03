"use client";

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

type GroupRole = "SUPER" | "SUB" | "MEMBER";

interface Member {
  email: string;
  memberNo: number;
  nickname: string;
  position: string;
  groupRole: GroupRole;
}

export default function GroupMemberSection({
  members,
  isAdmin,
  groupNo,
}: {
  members: Member[];
  isAdmin: boolean;
  groupNo: number;
}) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);

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

  const memberChanges = (member: Member) => {
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
          console.log(data, "#@#@");
        });
      },
    });
  };

  const memberDelete = (member: Member) => {
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
    <BaseCard glow className="flex-1 p-5 h-[420px] lg:h-[520px]">
      <div className="mb-4 flex flex-col gap-1.5">
        <span className="eyebrow">TEAM</span>
        <h2 className="typo-sub-t-1 text-foreground">그룹 멤버</h2>
      </div>

      <Column className="h-[340px] lg:h-[440px] gap-2.5 overflow-y-auto pr-2">
        {members.map((member: Member) => (
          <Between
            key={member.memberNo}
            className="w-full rounded-xl px-4 py-3 neu-flat"
          >
            <Row className="gap-3">
              <IconBox
                size="md"
                shape="square"
                tone="accent"
                className="typo-caption-3 font-bold bg-accent/10"
              >
                {member.nickname[0]}
              </IconBox>

              <Column>
                <Row className="gap-1.5">
                  <span className="typo-caption-2 font-semibold text-foreground">
                    {member.nickname}
                  </span>

                  {member.groupRole === "SUPER" && (
                    <Crown
                      size={12}
                      strokeWidth={1.75}
                      className="text-pending-500"
                    />
                  )}
                </Row>

                <span className="mt-0.5 typo-caption-3 text-place-h">
                  {member.position}
                </span>
              </Column>
            </Row>

            <Row className="relative gap-2">
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

              {isAdmin && member.groupRole !== "SUPER" && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === member.memberNo ? null : member.memberNo,
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
        ))}
      </Column>
    </BaseCard>
  );
}
