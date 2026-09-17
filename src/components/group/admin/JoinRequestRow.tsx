"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import MemberAvatar from "@/src/components/common/MemberAvatar";
import { Row } from "@/src/components/ui/layout/flex";
import { fadeQuick, springFirm, springSoft } from "@/src/lib/motion";
import { JoinRequest, JoinRequestStatus } from "@/src/types/group";
import { cn } from "@/src/utils/cn";

/** 가입 신청 한 줄. 누르면 메시지·이메일이 펼쳐진다 */
export default function JoinRequestRow({
  request,
  open,
  processing,
  onToggle,
  onProcess,
}: {
  request: JoinRequest;
  open: boolean;
  processing: boolean;
  onToggle: () => void;
  onProcess: (status: JoinRequestStatus) => void;
}) {
  const detailId = `join-request-${request.requestNo}`;

  return (
    <motion.div
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
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Row className="items-baseline gap-1.5">
              <span className="typo-caption-2 font-semibold text-foreground">
                {request.nickname}
              </span>
              <span className="typo-caption-3 text-place-h">
                {format(new Date(request.createdAt), "M월 d일", { locale: ko })}
              </span>
            </Row>
            {!open && (
              <span className="min-w-0 truncate typo-caption-3 text-muted">
                {request.message || request.email}
              </span>
            )}
          </div>
          {request.message && (
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={springFirm}
              className={cn("shrink-0 text-place-h", open && "text-accent")}
            >
              <ChevronDown size={14} strokeWidth={2} />
            </motion.span>
          )}
        </button>

        <Row className="shrink-0 gap-1.5">
          <button
            type="button"
            disabled={processing}
            onClick={() => onProcess("REJECTED")}
            className="neu-btn btn-spring flex h-7 items-center rounded-lg px-2.5 typo-caption-3 font-medium text-muted hover:text-error-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            거절
          </button>
          <button
            type="button"
            disabled={processing}
            onClick={() => onProcess("APPROVED")}
            className="btn-spring flex h-7 items-center rounded-lg bg-accent px-3 typo-caption-3 font-semibold text-on-primary hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
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
              <p className="whitespace-pre-wrap break-words typo-caption-2 leading-relaxed text-foreground">
                {request.message || "남긴 메시지가 없습니다."}
              </p>
              <p className="mt-2 typo-caption-3 text-place-h">
                {request.email}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
