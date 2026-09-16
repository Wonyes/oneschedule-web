"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import MemberAvatar from "@/src/components/common/MemberAvatar";
import { Column, Row } from "../ui/layout/flex";
import ScrollListArea, { ScrollSentinel } from "../ui/ScrollListArea";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";
import { AnimatePresence, motion } from "motion/react";
import { fadeQuick, springFirm, springSoft } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  useJoinRequests,
  useProcessJoinRequest,
} from "@/src/hooks/querys/useGroup";
import { useOverlay } from "@/src/hooks/useOverlay";
import { CustomError, getErrorMessage } from "@/src/types/ErrorResponse";
import { JoinRequestStatus, MyGroupResponse } from "@/src/types/group";

export default function GroupJoinRequestBody({
  group,
}: {
  group: MyGroupResponse;
}) {
  const { openToast, openAlert, openConfirm } = useOverlay();
  const [openNo, setOpenNo] = useState<number | null>(null);

  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useJoinRequests(group.groupNo);

  const { rootRef, sentinelRef } = useInfiniteScroll(hasNextPage, () => {
    if (!isFetchingNextPage) fetchNextPage();
  });

  const { mutate: process, isPending: processing } = useProcessJoinRequest(
    group.groupNo,
  );

  const requests = data?.pages.flatMap((page) => page.content) ?? [];
  const total = data?.pages[0]?.totalElements ?? 0;

  const handle = (
    requestNo: number,
    status: JoinRequestStatus,
    nickname: string,
  ) => {
    const approve = status === "APPROVED";

    const run = () =>
      process(
        { requestNo, status },
        {
          onSuccess: () =>
            openToast({
              message: approve
                ? `${nickname} 님을 그룹에 추가했습니다.`
                : "가입 신청을 거절했습니다.",
            }),
          onError: (err: CustomError) =>
            openAlert({
              title: "처리에 실패했습니다.",
              message: getErrorMessage(err, "잠시 후 다시 시도해주세요."),
            }),
        },
      );

    if (approve) return run();

    openConfirm({
      title: "가입 신청 거절",
      message: `${nickname} 님의 신청을 거절하시겠습니까?`,
      mainBtn: "거절",
      subBtn: "취소",
      onFunc: run,
    });
  };

  return (
    <>
      {total > 0 && (
        <p className="typo-caption-3 mb-2 shrink-0 text-place-h">
          대기 중인 신청 {total}건
        </p>
      )}

      {isPending ? (
        <p className="typo-caption-2 py-8 text-center text-muted">
          불러오는 중…
        </p>
      ) : requests.length === 0 ? (
        <p className="typo-caption-2 py-8 text-center text-muted">
          대기 중인 가입 신청이 없습니다.
        </p>
      ) : (
        <ScrollListArea
          rootRef={rootRef}
          showFade={hasNextPage}
          className="scroll-hidden flex min-h-0 w-full flex-1 flex-col items-start overflow-y-auto"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {requests.map((request) => {
              const open = openNo === request.requestNo;
              const detailId = `join-request-${request.requestNo}`;

              return (
                <motion.div
                  key={request.requestNo}
                  layout
                  exit={{ opacity: 0, x: 24, transition: fadeQuick }}
                  transition={springSoft}
                  className="w-full border-b border-divider py-2.5 last:border-none"
                >
                  <div className="flex w-full items-center gap-3">
                    <MemberAvatar
                      nickname={request.nickname}
                      src={request.profileImageUrl}
                    />

                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={detailId}
                      onClick={() => setOpenNo(open ? null : request.requestNo)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <Row className="items-baseline gap-1.5">
                          <span className="typo-caption-2 font-semibold text-foreground">
                            {request.nickname}
                          </span>

                          <span className="typo-caption-3 text-place-h">
                            {format(new Date(request.createdAt), "M월 d일", {
                              locale: ko,
                            })}
                          </span>
                        </Row>

                        {!open && (
                          <span className="typo-caption-3 min-w-0 truncate text-muted">
                            {request.message || request.email}
                          </span>
                        )}
                      </div>
                      {request.message && (
                        <motion.span
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={springFirm}
                          className={cn(
                            "shrink-0 text-place-h",
                            open && "text-accent",
                          )}
                        >
                          <ChevronDown size={14} strokeWidth={2} />
                        </motion.span>
                      )}
                    </button>

                    <Row className="shrink-0 gap-1.5">
                      <button
                        type="button"
                        disabled={processing}
                        onClick={() =>
                          handle(
                            request.requestNo,
                            "REJECTED",
                            request.nickname,
                          )
                        }
                        className="
                    neu-btn btn-spring
                    flex h-7 items-center rounded-lg px-2.5
                    typo-caption-3 font-medium text-muted
                    hover:text-error-500
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                      >
                        거절
                      </button>

                      <button
                        type="button"
                        disabled={processing}
                        onClick={() =>
                          handle(
                            request.requestNo,
                            "APPROVED",
                            request.nickname,
                          )
                        }
                        className="
                    btn-spring
                    flex h-7 items-center rounded-lg px-3
                    bg-accent typo-caption-3 font-semibold text-on-primary
                    hover:bg-accent/90
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                      >
                        승인
                      </button>
                    </Row>
                  </div>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="detail"
                        id={detailId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={springFirm}
                        className="overflow-hidden"
                      >
                        <div className="neu-pressed mt-2.5 rounded-xl px-3.5 py-3">
                          <p className="typo-caption-2 whitespace-pre-wrap break-words leading-relaxed text-foreground">
                            {request.message || "남긴 메시지가 없습니다."}
                          </p>
                          <p className="typo-caption-3 mt-2 text-place-h">
                            {request.email}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isFetchingNextPage && (
            <Row className="w-full items-center gap-3 py-2.5">
              <div className="size-9 shrink-0 animate-pulse rounded-full bg-surface-hover" />

              <Column className="flex-1 gap-1.5">
                <div className="h-2.5 w-20 animate-pulse rounded bg-surface-hover" />
                <div className="h-2 w-32 animate-pulse rounded bg-surface-hover" />
              </Column>
            </Row>
          )}

          {hasNextPage && <ScrollSentinel sentinelRef={sentinelRef} />}
        </ScrollListArea>
      )}
    </>
  );
}
