"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";

import EmptyState from "@/src/components/ui/EmptyState";
import { MemberRowSkeleton } from "@/src/components/ui/SkeletonParts";
import ScrollListArea, {
  ScrollSentinel,
} from "@/src/components/ui/ScrollListArea";
import {
  useJoinRequests,
  useProcessJoinRequest,
} from "@/src/hooks/querys/useGroup";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage } from "@/src/types/ErrorResponse";
import {
  JoinRequest,
  JoinRequestStatus,
  MyGroupResponse,
} from "@/src/types/group";
import JoinRequestRow from "./JoinRequestRow";

export default function GroupJoinRequestBody({
  group,
}: {
  group: MyGroupResponse;
}) {
  const { openToast, openAlert, openConfirm } = useOverlay();
  const [openNo, setOpenNo] = useState<number | null>(null);

  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useJoinRequests(group.groupNo);
  const { mutate: process, isPending: processing } = useProcessJoinRequest(
    group.groupNo,
  );

  const { rootRef, sentinelRef } = useInfiniteScroll(hasNextPage, () => {
    if (!isFetchingNextPage) fetchNextPage();
  });

  const requests = data?.pages.flatMap((page) => page.content) ?? [];
  const total = data?.pages[0]?.totalElements ?? 0;

  /** 승인은 바로, 거절은 확인창을 거쳐서 */
  const handle = (request: JoinRequest, status: JoinRequestStatus) => {
    const approve = status === "APPROVED";

    const run = () =>
      process(
        { requestNo: request.requestNo, status },
        {
          onSuccess: () =>
            openToast({
              message: approve
                ? `${request.nickname} 님을 그룹에 추가했습니다.`
                : "가입 신청을 거절했습니다.",
            }),
          onError: (err) =>
            openAlert({
              title: "처리에 실패했습니다.",
              message: getErrorMessage(err, "잠시 후 다시 시도해주세요."),
            }),
        },
      );

    if (approve) return run();

    openConfirm({
      title: "가입 신청 거절",
      message: `${request.nickname} 님의 신청을 거절하시겠습니까?`,
      mainBtn: "거절",
      subBtn: "취소",
      onFunc: run,
    });
  };

  if (isPending) return <EmptyState title="불러오는 중…" />;
  if (requests.length === 0)
    return <EmptyState title="대기 중인 가입 신청이 없어요." />;

  return (
    <>
      <p className="mb-2 shrink-0 typo-caption-3 text-place-h">
        대기 중인 신청 {total}건
      </p>

      <ScrollListArea
        rootRef={rootRef}
        showFade={hasNextPage}
        className="scroll-hidden flex min-h-0 w-full flex-1 flex-col items-start overflow-y-auto"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {requests.map((request) => (
            <JoinRequestRow
              key={request.requestNo}
              request={request}
              open={openNo === request.requestNo}
              processing={processing}
              onToggle={() =>
                setOpenNo(
                  openNo === request.requestNo ? null : request.requestNo,
                )
              }
              onProcess={(status) => handle(request, status)}
            />
          ))}
        </AnimatePresence>

        {isFetchingNextPage && <MemberRowSkeleton />}

        {hasNextPage && <ScrollSentinel sentinelRef={sentinelRef} />}
      </ScrollListArea>
    </>
  );
}
