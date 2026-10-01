"use client";

import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { Delete, Patch } from "@/src/hooks/querys/useMutations";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { GroupMember, GroupRole } from "@/src/types/group";
import {
  GroupMemberEditContent,
  GroupMemberEditRef,
} from "./GroupMemberEditContent";

/** 관리자의 멤버 수정(모달) · 내보내기(확인창) */
export function useManageMember(groupNo: number, owner = false) {
  const queryClient = useQueryClient();
  const { openModal, openToast, openConfirm, closeModal } = useOverlay();
  const editRef = useRef<GroupMemberEditRef>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: [groupkeys.myGroup] });
  const onError = (err: Parameters<typeof getErrorMessage>[0]) =>
    openToast({ message: getErrorMessage(err) });

  const { mutate: update } = useAppMutation({
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
        params: { groupRole, position },
      }),
    onSuccess: () => {
      refresh();
      openToast({ message: "멤버 정보를 수정했습니다." });
      closeModal();
    },
    onError,
  });

  const { mutate: remove } = useAppMutation({
    mutationFn: (memberNo: number) =>
      Delete({ url: `/group/${groupNo}/member/${memberNo}` }),
    onSuccess: () => {
      refresh();
      openToast({ message: "멤버를 삭제했습니다." });
    },
    onError,
  });

  const edit = (member: GroupMember) =>
    openModal({
      title: "멤버 관리",
      content: () => (
        <GroupMemberEditContent ref={editRef} member={member} owner={owner} />
      ),
      mainBtn: "저장",
      subBtn: "취소",
      onFunc: () =>
        editRef.current?.submit((data) => {
          // 그룹장 넘기기는 되돌릴 수 없어 한 번 더 묻는다
          if (data.groupRole === "SUPER") {
            closeModal();
            openConfirm({
              title: "그룹장 넘기기",
              message: `${member.nickname}님에게 그룹장을 넘길까요? 나는 일반 멤버가 되고 되돌릴 수 없어요.`,
              mainBtn: "넘기기",
              subBtn: "취소",
              onFunc: () => update(data),
            });
            return;
          }
          update(data);
        }),
    });

  const kick = (member: GroupMember) =>
    openConfirm({
      title: `${member.nickname} 멤버 삭제`,
      message: `정말 ${member.nickname}를 추방하시겠습니까?`,
      mainBtn: "삭제",
      subBtn: "취소",
      onFunc: () => remove(member.memberNo),
    });

  return { edit, kick };
}
