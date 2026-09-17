"use client";

import { Check, Hourglass, Loader2, Plus, Search, Users } from "lucide-react";
import GroupAvatar from "@/src/components/common/GroupAvatar";
import { useRef, useState } from "react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import { Input } from "@/src/components/ui/layout/input";
import Skeleton from "@/src/components/ui/Skeleton";
import ScrollListArea, {
  ScrollSentinel,
} from "@/src/components/ui/ScrollListArea";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";
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
} from "@/src/components/group/landing/JoinRequestMessageContent";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { rise, stagger } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";
import SectionHeading from "../../ui/layout/SectionHeading";
import EmptyState from "../../ui/EmptyState";

function GroupRow({ group }: { group: PublicGroup }) {
  const router = useRouter();
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

  const status = group.joined ? "joined" : group.pending ? "pending" : "none";

  return (
    <motion.div
      variants={rise}
      role={group.joined ? "link" : undefined}
      onClick={() => group.joined && router.push(`/group/${group.groupNo}`)}
      className={cn(
        "group relative flex flex-col items-center gap-2.5 rounded-2xl p-3 text-center transition-colors",
        group.joined && "cursor-pointer hover:bg-surface-hover",
      )}
    >
      <div className="relative">
        <div className="neu-pressed absolute -inset-2 rounded-full" />
        <GroupAvatar
          name={group.groupName}
          imageUrl={group.profileImageUrl}
          className="relative h-16 w-16 rounded-full typo-sub-t-1"
        />

        {status === "joined" ? (
          <span
            title="가입됨"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-success-500 text-on-primary ring-2 ring-[var(--surface)]"
          >
            <Check size={12} strokeWidth={3} />
          </span>
        ) : status === "pending" ? (
          <span
            title="가입 대기 중"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-pending-500 text-on-primary ring-2 ring-[var(--surface)]"
          >
            <Hourglass size={11} strokeWidth={2.5} />
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            disabled={isPending}
            aria-label={needsApproval ? "가입 신청" : "가입하기"}
            className="btn-primary btn-spring absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-[var(--surface)] disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 size={12} strokeWidth={3} className="animate-spin" />
            ) : (
              <Plus size={13} strokeWidth={3} />
            )}
          </button>
        )}
      </div>

      <Column className="w-full min-w-0 items-center gap-0.5">
        <Row className="max-w-full items-center gap-1">
          <span className="truncate typo-caption-1 font-semibold text-foreground">
            {group.groupName}
          </span>
          {needsApproval && (
            <span className="shrink-0 rounded-full bg-pending-500/12 px-1.5 text-[9px] font-semibold leading-4 text-pending-500">
              승인
            </span>
          )}
        </Row>
        <Row className="items-center gap-1 text-place-h">
          <Users size={10} strokeWidth={2} />
          <span className="typo-caption-3 tabular-nums">
            {group.memberCount}
          </span>
        </Row>
        {group.description && (
          <span className="line-clamp-2 typo-caption-3 leading-snug text-muted">
            {group.description}
          </span>
        )}
      </Column>
    </motion.div>
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

  const { rootRef, sentinelRef } = useInfiniteScroll(!!hasNextPage, () => {
    if (!isFetchingNextPage) fetchNextPage();
  });

  return (
    <BaseCard className="w-full p-4 sm:p-6" glow>
      <SectionHeading className="mb-3" eyebrow="DISCOVER" title="공개 그룹 둘러보기" />

      <Input
        value={keyword}
        placeholder="그룹 이름으로 검색"
        leftSection={<Search size={14} className="text-place-h shrink-0" />}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <Column className="mt-4 w-full">
        {isPending ? (
          <Column className="gap-3 py-4">
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Column key={i} className="items-center gap-2 p-3">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-2.5 w-10" />
                </Column>
              ))}
            </div>
          </Column>
        ) : isError ? (
          <p className="typo-caption-2 py-8 text-center text-muted">
            목록을 불러오지 못했습니다.
          </p>
        ) : groups.length === 0 ? (
          <EmptyState
            title={
              keyword.trim()
                ? "검색 결과가 없어요."
                : "아직 공개된 그룹이 없어요."
            }
          />
        ) : (
          <ScrollListArea
            rootRef={rootRef}
            showFade={!!hasNextPage}
            className="scroll-hidden max-h-[440px] w-full overflow-y-auto"
          >
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid w-full grid-cols-2 gap-1 sm:grid-cols-3"
            >
              {groups.map((group) => (
                <GroupRow key={group.groupNo} group={group} />
              ))}
            </motion.div>

            {isFetchingNextPage && (
              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Column key={i} className="items-center gap-2 p-3">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </Column>
                ))}
              </div>
            )}

            {hasNextPage && <ScrollSentinel sentinelRef={sentinelRef} />}
          </ScrollListArea>
        )}
      </Column>
    </BaseCard>
  );
}
