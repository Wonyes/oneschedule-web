"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

import { Column } from "../../ui/layout/flex";
import { Textarea } from "../../ui/layout/textarea";

const MAX_LENGTH = 200;

export interface JoinRequestMessageRef {
  submit: (onSuccess: (message: string) => void) => void;
}

export const JoinRequestMessageContent = forwardRef<
  JoinRequestMessageRef,
  { groupName: string }
>(({ groupName }, ref) => {
  const [message, setMessage] = useState("");

  useImperativeHandle(ref, () => ({
    submit: (onSuccess) => onSuccess(message),
  }));

  return (
    <Column className="w-full gap-2">
      <p className="typo-caption-2 text-muted">
        <span className="text-foreground">{groupName}</span> 관리자에게 남길
        말을 적어주세요.
      </p>

      <Textarea
        value={message}
        maxLength={MAX_LENGTH}
        placeholder="예) 친구 소개로 왔어요. 주말 모임에 참여하고 싶습니다."
        description="비워두셔도 신청됩니다."
        onChange={(e) => setMessage(e.target.value)}
      />
    </Column>
  );
});

JoinRequestMessageContent.displayName = "JoinRequestMessageContent";
