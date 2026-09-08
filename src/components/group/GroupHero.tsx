"use client";

import { Copy, Crown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import BaseCard from "../ui/card/BaseCard";
import VisibilityBadge from "./VisibilityBadge";
import { Row, Column, Between } from "../ui/layout/flex";
import { GhostBtn, Primary } from "../ui/layout/button";
import { useOverlay } from "@/src/hooks/useOverlay";
import { useState } from "react";
import { Input } from "../ui/layout/input";
import { Textarea } from "../ui/layout/textarea";
import { useUpdateGroupSetting } from "@/src/hooks/querys/useGroup";
import { useForm } from "@/src/hooks/useForm";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { Delete, Put } from "@/src/hooks/querys/useMutations";
import { useQueryClient } from "@tanstack/react-query";
import { groupkeys } from "@/src/hooks/querys/key/groupKey";
import { memberskeys } from "@/src/hooks/querys/key/members";
import { MyGroupResponse } from "@/src/types/group";
import { useActiveGroupStore } from "@/src/hooks/stores/useActiveGroupStore";

export const GroupHero = ({ group }: { group: MyGroupResponse }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearActiveGroup = useActiveGroupStore((s) => s.clearActiveGroup);

  const { openToast, openConfirm } = useOverlay();
  const { form, formChange } = useForm({
    groupName: group.groupName,
  });
  const [groupNameCorrection, setGroupNameCorrection] = useState(false);

  const [descriptionEditing, setDescriptionEditing] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(
    group.description ?? "",
  );

  const { mutate: updateSetting, isPending: savingDescription } =
    useUpdateGroupSetting(group.groupNo);

  const saveDescription = () => {
    updateSetting(
      { description: descriptionDraft.trim() },
      {
        onSuccess: () => {
          setDescriptionEditing(false);
          openToast({ message: "그룹 소개를 저장했습니다." });
        },
        onError: (err) => openToast({ message: getErrorMessage(err) }),
      },
    );
  };

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
        body: null,
        params: {
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
        message: getErrorMessage(err),
      });
    },
    retry: false,
  });

  const { mutate: deleteGroup } = useAppMutation({
    mutationFn: () =>
      group.groupRole === "SUPER"
        ? Delete({ url: `/group/${group.groupNo}/disband` })
        : Delete({
            url: "/group/leave",
            params: { groupNo: group.groupNo },
          }),
    onSuccess: async () => {
      clearActiveGroup();

      await queryClient.removeQueries({
        queryKey: [groupkeys.myGroup],
      });

      await queryClient.invalidateQueries({
        queryKey: [memberskeys.myInfo],
      });

      router.refresh();

      openToast({
        message:
          group.groupRole === "SUPER"
            ? "그룹이 해체되었습니다."
            : "그룹에서 탈퇴했습니다.",
      });
    },
    onError: (err) => {
      openToast({
        message: getErrorMessage(err),
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
    <BaseCard glow className="p-5">
      <Between className="items-start">
        <Column className="w-full">
          <Between className="mb-1.5">
            <span className="eyebrow">GROUP</span>
            <VisibilityBadge visibility={group.visibility} />
          </Between>

          <Between className="w-full">
            <Row className="min-w-0 gap-2 justify-center">
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
                  <h1 className="typo-title-1 text-foreground truncate">
                    {group.groupName}
                  </h1>
                  {group.groupRole === "SUPER" && (
                    <GhostBtn
                      onClick={() => setGroupNameCorrection(true)}
                      ariaLabel="그룹 이름 수정"
                      icon={
                        <Pencil
                          size={16}
                          strokeWidth={1.5}
                          className="text-accent"
                        />
                      }
                    />
                  )}
                </>
              )}
            </Row>
            {group.groupRole === "SUPER" && (
              <Row className="neu-flat gap-1 rounded-full px-3 py-1 shrink-0">
                <Crown
                  size={16}
                  strokeWidth={1.75}
                  className="text-pending-500"
                />
                <span className="typo-sub-t-3 text-pending-500">관리자</span>
              </Row>
            )}
          </Between>

          {descriptionEditing ? (
            <Column className="mt-2 w-full gap-2">
              <Textarea
                value={descriptionDraft}
                maxLength={200}
                placeholder="어떤 그룹인지 한두 줄로 소개해주세요."
                description="공개 그룹 목록에서 이 문구가 함께 보입니다."
                onChange={(e) => setDescriptionDraft(e.target.value)}
              />

              <Row className="justify-end gap-2">
                <GhostBtn
                  text="취소"
                  className="typo-caption-2 h-8 px-3"
                  onClick={() => setDescriptionEditing(false)}
                />
                <Primary
                  text={savingDescription ? "저장 중…" : "저장"}
                  className="typo-caption-2 h-8 px-4"
                  isDisabled={savingDescription}
                  onClick={saveDescription}
                />
              </Row>
            </Column>
          ) : (
            <Row className="mt-2 min-w-0 items-center gap-1.5">
              <p className="typo-caption-2 min-w-0 text-muted">
                {group.description || "아직 그룹 소개가 없어요."}
              </p>

              {group.groupRole === "SUPER" && (
                <GhostBtn
                  ariaLabel="그룹 소개 수정"
                  className="h-6 shrink-0 px-1"
                  onClick={() => {
                    setDescriptionDraft(group.description ?? "");
                    setDescriptionEditing(true);
                  }}
                  icon={
                    <Pencil
                      size={12}
                      strokeWidth={1.5}
                      className="text-accent"
                    />
                  }
                />
              )}
            </Row>
          )}
          <Between className="mt-5">
            <Row className="gap-3">
              <span className="typo-caption-2 shrink-0 whitespace-nowrap text-place-h">
                초대 코드
              </span>

              <Row className="neu-pressed gap-2 rounded-lg px-3 py-1.5">
                <span className="typo-caption-2 font-semibold text-secondary">
                  {group.groupCode}
                </span>

                <button
                  type="button"
                  onClick={copyCode}
                  aria-label="초대 코드 복사"
                  className="text-muted transition hover:text-foreground"
                >
                  <Copy size={14} strokeWidth={1.75} />
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
