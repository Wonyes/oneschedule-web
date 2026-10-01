"use client";

import { useRef } from "react";

import {
  useJoinPublicGroup,
  useRequestJoinGroup,
} from "@/src/hooks/querys/useGroup";
import { useOverlay } from "@/src/hooks/useOverlay";
import { CustomError, getErrorMessage } from "@/src/types/ErrorResponse";
import { PublicGroup } from "@/src/types/group";
import {
  JoinRequestMessageContent,
  JoinRequestMessageRef,
} from "./JoinRequestMessageContent";

/** 공개 그룹 가입. 승인제면 메시지 모달을 거쳐 신청, 아니면 바로 가입 */
export function useJoinGroup(group: PublicGroup) {
  const { openToast, openAlert, openModal, closeModal } = useOverlay();
  const messageRef = useRef<JoinRequestMessageRef>(null);
  const { mutate: join, isPending: joining } = useJoinPublicGroup();
  const { mutate: request, isPending: requesting } = useRequestJoinGroup();

  const needsApproval = group.visibility === "PUBLIC_APPROVAL";

  const onError = (err: CustomError) =>
    openAlert({
      title: "가입에 실패했습니다.",
      message: getErrorMessage(err, "잠시 후 다시 시도해주세요."),
    });

  const submit = () => {
    if (!needsApproval) {
      join(group.groupNo, {
        onSuccess: () => openToast({ message: "그룹에 가입했습니다." }),
        onError,
      });
      return;
    }

    openModal({
      title: "가입 신청",
      content: () => (
        <JoinRequestMessageContent
          ref={messageRef}
          groupName={group.groupName}
        />
      ),
      mainBtn: "신청하기",
      subBtn: "취소",
      onFunc: () =>
        messageRef.current?.submit((message) =>
          request(
            { groupNo: group.groupNo, message },
            {
              onSuccess: () => {
                closeModal();
                openToast({ message: "가입을 신청했습니다." });
              },
              onError,
            },
          ),
        ),
    });
  };

  return { submit, needsApproval, isPending: joining || requesting };
}
