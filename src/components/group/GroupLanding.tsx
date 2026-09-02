"use client";

import { useState } from "react";
import { Primary } from "../ui/layout/button";
import { KeySquare, Users } from "lucide-react";
import CreateGroup from "./CreateGroup";
import BaseCard from "../ui/card/BaseCard";
import { Row } from "../ui/layout/flex";
import { Input } from "../ui/layout/input";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { Post } from "@/src/hooks/querys/useMutations";
import { useQueryClient } from "@tanstack/react-query";
import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { useOverlay } from "@/src/hooks/useOverlay";
import { useForm } from "@/src/hooks/useForm";
import { memberskeys } from "@/src/hooks/querys/key/members";

export default function GroupLanding() {
  const queryClient = useQueryClient();
  const { openToast } = useOverlay();

  const { form, formChange } = useForm({
    groupCode: "",
  });

  const [createGroup, setCreateGroup] = useState(false);

  const { mutate: joinGroup } = useAppMutation({
    mutationFn: () =>
      Post({
        url: "/group/join",
        body: null,
        params: {
          groupCode: form.groupCode,
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [memberskeys.myInfo],
      });

      queryClient.invalidateQueries({
        queryKey: [groupkeys.myGroup],
      });

      openToast({
        message: "그룹에 가입했습니다.",
      });
    },
    onError: (err) => {
      openToast({
        message: getErrorMessage(err),
      });
    },
  });

  return (
    <main className="max-w-[420px] w-full mx-auto">
      {!createGroup ? (
        <BaseCard
          className="
            p-10
            flex
            flex-col
            items-center
            text-center
            relative
            w-full
            overflow-hidden
          "
          glow
        >
          <Row className="w-full justify-center">
            <div
              className="
              w-20
              h-20
              rounded-3xl
              neu-pressed
              flex
              items-center
              justify-center
              text-indigo-400
            "
            >
              <Users size={36} />
            </div>
          </Row>

          <h1 className="mt-7 typo-title-1 text-foreground">
            함께할 그룹을 만들어보세요
          </h1>

          <p className="mt-3 typo-caption-2 leading-relaxed text-muted">
            그룹을 만들고 친구들과
            <br />
            일정을 공유해보세요.
          </p>

          <div className="mt-8 flex flex-col w-full gap-3">
            <Primary
              text={form.groupCode ? "그룹 가입하기" : "그룹 만들기"}
              icon={
                form.groupCode ? <KeySquare size={14} /> : <Users size={14} />
              }
              onClick={() => {
                if (form.groupCode) {
                  joinGroup();
                  return;
                }

                setCreateGroup(true);
              }}
            />

            <Input
              name="groupCode"
              value={form.groupCode}
              onChange={formChange}
              type="text"
              placeholder="초대코드를 입력해 주세요."
              className="h-[44px]"
            />
          </div>
        </BaseCard>
      ) : (
        <CreateGroup onBack={() => setCreateGroup(false)} />
      )}
    </main>
  );
}
