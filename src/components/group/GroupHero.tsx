"use client";

import { Copy, Crown, Pencil } from "lucide-react";
import BaseCard from "../ui/card/BaseCard";
import { Row, Column, Between } from "../ui/layout/flex";
import { GhostBtn, Primary } from "../ui/layout/button";
import { useOverlay } from "@/src/hooks/useOverlay";
import { useState } from "react";
import { Input } from "../ui/layout/input";
import { useForm } from "@/src/hooks/useForm";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { Delete, Put } from "@/src/hooks/querys/useMutations";
import { useQueryClient } from "@tanstack/react-query";
import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { memberskeys } from "@/src/hooks/querys/key/members";

export const GroupHero = ({ group }) => {
  const queryClient = useQueryClient();

  const { openToast, openConfirm } = useOverlay();
  const { form, formChange } = useForm({
    groupName: group.groupName,
  });
  const [groupNameCorrection, setGroupNameCorrection] = useState(false);
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
        body: {
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
        message: err.response.data.message,
      });
    },
    retry: false,
  });

  const { mutate: deleteGroup } = useAppMutation({
    mutationFn: () =>
      Delete({
        url:
          group.groupRole === "SUPER"
            ? `/group/${group.groupNo}/disband`
            : "/group/leave",
      }),
    onSuccess: async () => {
      await queryClient.removeQueries({
        queryKey: [groupkeys.myGroup],
      });

      await queryClient.invalidateQueries({
        queryKey: [memberskeys.myInfo],
      });

      openToast({
        message:
          group.groupRole === "SUPER"
            ? "그룹이 해체되었습니다."
            : "그룹에서 탈퇴했습니다.",
      });
    },
    onError: (err) => {
      console.log(err);
      openToast({
        message: err.response.data.message,
      });
    },
  });

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

  return (
    <BaseCard glow className="p-6">
      <Between>
        <Column className="w-full">
          <Between className="w-full">
            <Row className="gap-2 justify-center">
              {groupNameCorrection ? (
                <>
                  <Input
                    name="groupName"
                    value={form.groupName}
                    onChange={formChange}
                  />
                  <Row>
                    <Primary
                      text="변경"
                      className="py-2 px-4 h-fit w-fit"
                      onClick={changeGroupName}
                    />
                    <GhostBtn
                      text="취소"
                      className="py-2 px-4 h-fit w-fit"
                      onClick={() => setGroupNameCorrection(false)}
                    />
                  </Row>
                </>
              ) : (
                <>
                  <h1 className="typo-title-1 text-white">{group.groupName}</h1>
                  {group.groupRole === "SUPER" && (
                    <GhostBtn
                      onClick={() => setGroupNameCorrection(true)}
                      icon={<Pencil size={18} className="text-indigo-400" />}
                    />
                  )}
                </>
              )}
            </Row>
            {group.groupRole === "SUPER" && (
              <Row className="gap-1 rounded-full bg-yellow-400/10 px-3 py-1">
                <Crown size={18} className="text-yellow-400" />
                <span className="typo-sub-t-3 text-yellow-400">관리자</span>
              </Row>
            )}
          </Between>

          <p className="mt-3 typo-sub-t-3 text-slate-400">
            함께 일정을 관리하는 그룹입니다.
          </p>
          <Between className="mt-6">
            <Row className="gap-3">
              <span className="typo-caption-2 text-slate-500">초대 코드</span>

              <Row className="gap-2 rounded-xl bg-slate-800 px-4 py-2">
                <span className="typo-sub-t-3 text-slate-200">
                  {group.groupCode}
                </span>

                <button
                  onClick={copyCode}
                  className="text-slate-400 transition hover:text-white"
                >
                  <Copy size={14} />
                </button>
              </Row>
            </Row>
            <GhostBtn
              onClick={() => withdrawGroups()}
              text={group.groupRole === "SUPER" ? "해체하기" : "탈퇴하기"}
              className="py-1 px-4 h-fit w-fit typo-caption-2"
            />
          </Between>
        </Column>
      </Between>
    </BaseCard>
  );
};
