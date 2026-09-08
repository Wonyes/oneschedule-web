"use client";

import { Check, Hourglass, Search, Users } from "lucide-react";
import { useRef, useState } from "react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Primary, SecondaryBtn } from "@/src/components/ui/layout/button";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { Input } from "@/src/components/ui/layout/input";
import Skeleton from "@/src/components/ui/Skeleton";
import {
  useJoinPublicGroup,
  usePublicGroups,
  useRequestJoinGroup,
} from "@/src/hooks/querys/useGroup";
import { useOverlay } from "@/src/hooks/useOverlay";
import { CustomError, getErrorMessage } from "@/src/types/ErrorResponse";
import { PublicGroup } from "@/src/types/group";
import {
  JoinRequestMessageContent,
  JoinRequestMessageRef,
} from "@/src/components/ui/overlay/modal/JoinRequestMessageContent";

function GroupRow({ group }: { group: PublicGroup }) {
  const { openToast, openAlert, openModal, closeModal } = useOverlay();

  const messageRef = useRef<JoinRequestMessageRef>(null);

  const { mutate: join, isPending: joining } = useJoinPublicGroup();
  const { mutate: request, isPending: requesting } = useRequestJoinGroup();

  const isPending = joining || requesting;
  const needsApproval = group.visibility === "PUBLIC_APPROVAL";

  const handleError = (err: CustomError) =>
    openAlert({
      title: "가입에 실패했습니다.",
      message: getErrorMessage(err, "잠시 후 다시 시도해주세요."),
    });

  const handleClick = () => {
    if (needsApproval) {
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
        onFunc: () => {
          messageRef.current?.submit((message) =>
            request(
              { groupNo: group.groupNo, message },
              {
                onSuccess: () => {
                  closeModal();
                  openToast({ message: "가입을 신청했습니다." });
                },
                onError: handleError,
              },
            ),
          );
        },
      });
      return;
    }

    join(group.groupNo, {
      onSuccess: () => openToast({ message: "그룹에 가입했습니다." }),
      onError: handleError,
    });
  };

  return (
    <Row className="w-full items-center gap-3 border-b border-divider py-3.5 last:border-none">
      <Column className="min-w-0 flex-1 gap-1">
        <Row className="items-center gap-2">
          <span className="typo-sub-t-2 truncate text-foreground">
            {group.groupName}
          </span>

          {needsApproval && (
            <span className="typo-caption-3 shrink-0 rounded-full bg-pending-500/15 px-2 py-0.5 text-pending-500">
              승인 필요
            </span>
          )}
        </Row>

        {group.description && (
          <span className="typo-caption-2 truncate text-muted">
            {group.description}
          </span>
        )}

        <Row className="items-center gap-1">
          <Users size={11} strokeWidth={1.75} className="text-place-h" />
          <span className="typo-caption-3 text-place-h">
            {group.memberCount}명
          </span>
        </Row>
      </Column>

      {group.joined ? (
        <Row className="shrink-0 items-center gap-1 px-3 text-success-500">
          <Check size={13} strokeWidth={2} />
          <span className="typo-caption-2">가입됨</span>
        </Row>
      ) : group.pending ? (
        /*
          이미 신청해둔 그룹. 버튼을 남겨두면 다시 눌러도
          JOIN_REQUEST_ALREADY_PENDING만 돌아와서 아무 일도 안 일어난 것처럼 보인다.
        */
        <Row className="shrink-0 items-center gap-1 px-3 text-pending-500">
          <Hourglass size={13} strokeWidth={2} />
          <span className="typo-caption-2 whitespace-nowrap">가입 대기 중</span>
        </Row>
      ) : (
        <SecondaryBtn
          className="h-9 shrink-0 px-3.5 typo-caption-2"
          text={
            isPending ? "처리 중…" : needsApproval ? "신청하기" : "가입하기"
          }
          isDisabled={isPending}
          onClick={handleClick}
        />
      )}
    </Row>
  );
}

export default function PublicGroupList() {
  const [keyword, setKeyword] = useState("");

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePublicGroups(keyword);

  const groups = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <BaseCard className="w-full p-6" glow>
      <Column className="mb-3 gap-1">
        <span className="eyebrow">DISCOVER</span>
        <h2 className="typo-sub-t-1 text-foreground">공개 그룹 둘러보기</h2>
      </Column>

      <Input
        value={keyword}
        placeholder="그룹 이름으로 검색"
        leftSection={<Search size={14} className="text-place-h shrink-0" />}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <Column className="mt-2 w-full">
        {isPending ? (
          <Column className="gap-3 py-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </Column>
        ) : isError ? (
          <p className="typo-caption-2 py-8 text-center text-muted">
            목록을 불러오지 못했습니다.
          </p>
        ) : groups.length === 0 ? (
          <p className="typo-caption-2 py-8 text-center text-muted">
            {keyword.trim()
              ? "검색 결과가 없습니다."
              : "아직 공개된 그룹이 없습니다."}
          </p>
        ) : (
          groups.map((group) => <GroupRow key={group.groupNo} group={group} />)
        )}
      </Column>

      {hasNextPage && (
        <Primary
          className="mt-4 w-full"
          text={isFetchingNextPage ? "불러오는 중…" : "더 보기"}
          isDisabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        />
      )}
    </BaseCard>
  );
}
