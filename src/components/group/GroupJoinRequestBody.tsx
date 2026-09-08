"use client";

import AvatarImage from "@/src/components/common/AvatarImage";
import IconBox from "../ui/IconBox";
import { Column, Row } from "../ui/layout/flex";
import { Primary } from "../ui/layout/button";
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

  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useJoinRequests(group.groupNo);

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
        <p className="typo-caption-3 mb-2 text-place-h">
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
        <Column className="w-full">
          {requests.map((request) => (
            <Row
              key={request.requestNo}
              className="w-full items-center gap-3 border-b border-divider py-2.5 last:border-none"
            >
              <IconBox
                size="md"
                shape="circle"
                tone="accent"
                className="typo-caption-3 shrink-0 overflow-hidden bg-accent/10 font-bold"
              >
                <AvatarImage
                  src={request.profileImageUrl}
                  nickname={request.nickname}
                />
              </IconBox>

              <div
                className="
                  flex min-w-0 flex-1 flex-col gap-0.5
                  lg:flex-row lg:items-baseline lg:gap-1.5
                "
                title={request.message ?? request.email}
              >
                <Row className="shrink-0 items-baseline gap-1.5">
                  <span className="typo-caption-2 font-semibold text-foreground">
                    {request.nickname}
                  </span>

                  <span className="typo-caption-3 text-place-h">
                    {format(new Date(request.createdAt), "M월 d일", {
                      locale: ko,
                    })}
                  </span>
                </Row>

                <span className="typo-caption-3 line-clamp-4 min-w-0 text-muted lg:line-clamp-none lg:truncate">
                  {request.message || request.email}
                </span>
              </div>

              <Row className="shrink-0 gap-1.5">
                <button
                  type="button"
                  disabled={processing}
                  onClick={() =>
                    handle(request.requestNo, "REJECTED", request.nickname)
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
                    handle(request.requestNo, "APPROVED", request.nickname)
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
            </Row>
          ))}
        </Column>
      )}

      {hasNextPage && (
        <Primary
          className="mt-4 w-full"
          text={isFetchingNextPage ? "불러오는 중…" : "더 보기"}
          isDisabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        />
      )}
    </>
  );
}
