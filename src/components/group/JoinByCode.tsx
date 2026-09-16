"use client";

import { KeySquare } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Primary } from "@/src/components/ui/layout/button";
import { Column } from "@/src/components/ui/layout/flex";
import { Input } from "@/src/components/ui/layout/input";
import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { memberskeys } from "@/src/hooks/querys/key/members";
import { Post } from "@/src/hooks/querys/useMutations";
import { useForm } from "@/src/hooks/useForm";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import SectionHeading from "../ui/layout/SectionHeading";

export default function JoinByCode({ onJoined }: { onJoined?: () => void }) {
  const queryClient = useQueryClient();
  const { openToast } = useOverlay();

  const { form, formChange, errors, setErrors } = useForm({
    groupCode: "",
  });

  const { mutate: joinGroup, isPending } = useAppMutation({
    mutationFn: () =>
      Post({
        url: "/group/join",
        body: null,
        params: {
          groupCode: form.groupCode.trim(),
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [memberskeys.myInfo] });
      queryClient.invalidateQueries({ queryKey: [groupkeys.myGroup] });

      openToast({ message: "그룹에 가입했습니다." });

      onJoined?.();
    },

    onError: (err) => {
      setErrors({
        groupCode: getErrorMessage(err, "그룹 가입에 실패했습니다."),
      });
    },
  });

  const handleJoin = () => {
    if (!form.groupCode.trim()) {
      return setErrors({ groupCode: "초대코드를 입력해주세요." });
    }

    joinGroup();
  };

  return (
    <BaseCard className="w-full p-4 sm:p-6" glow>
      <SectionHeading
        className="mb-4"
        eyebrow="INVITE"
        title="초대코드로 참여"
        description="비공개 그룹은 초대코드로만 들어갈 수 있어요."
      />

      <Column className="w-full gap-3">
        <Input
          name="groupCode"
          value={form.groupCode}
          onChange={formChange}
          onEnter={handleJoin}
          errorMessage={errors.groupCode}
          type="text"
          placeholder="초대코드를 입력해 주세요."
          className="h-[44px]"
        />

        <Primary
          className="w-full"
          text={isPending ? "가입하는 중…" : "그룹 가입하기"}
          icon={<KeySquare size={14} />}
          isDisabled={isPending}
          onClick={handleJoin}
        />
      </Column>
    </BaseCard>
  );
}
