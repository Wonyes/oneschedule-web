"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { memberskeys } from "@/src/hooks/querys/key/members";
import { Delete } from "@/src/hooks/querys/useMutations";
import { useActiveGroupStore } from "@/src/hooks/stores/useActiveGroupStore";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { MyGroupResponse, roleOf } from "@/src/types/group";

/** 그룹장은 해체, 나머지는 탈퇴. 확인창을 거친다 */
export function useLeaveGroup(group: MyGroupResponse) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearActiveGroup = useActiveGroupStore((s) => s.clearActiveGroup);
  const { openToast, openConfirm } = useOverlay();
  const { owner } = roleOf(group.groupRole);

  const { mutate } = useAppMutation({
    mutationFn: () =>
      owner
        ? Delete({ url: `/group/${group.groupNo}/disband` })
        : Delete({ url: "/group/leave", params: { groupNo: group.groupNo } }),
    onSuccess: async () => {
      clearActiveGroup();
      await queryClient.removeQueries({ queryKey: [groupkeys.myGroup] });
      await queryClient.invalidateQueries({ queryKey: [memberskeys.myInfo] });
      router.refresh();
      openToast({
        message: owner ? "그룹이 해체되었습니다." : "그룹에서 탈퇴했습니다.",
      });
    },
    onError: (err) => openToast({ message: getErrorMessage(err) }),
  });

  const confirmLeave = () =>
    openConfirm({
      title: owner ? "그룹해체" : "그룹탈퇴",
      message: owner
        ? "정말 그룹을 해체하시겠습니까?"
        : "정말 그룹을 탈퇴하시겠습니까?",
      mainBtn: owner ? "해체" : "탈퇴",
      subBtn: "취소",
      onFunc: () => mutate(),
    });

  return { confirmLeave, label: owner ? "그룹 해체" : "그룹 탈퇴" };
}
