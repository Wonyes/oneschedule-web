"use client";

import { CalendarClock } from "lucide-react";
import IconBox from "../../ui/IconBox";
import Link from "next/link";
import LocationPicker from "./LocationPicker";
import { Row } from "../../ui/layout/flex";

export default function Logo() {
  return (
    <Row className="gap-2">
      <Link
        href="/"
        prefetch
        className="flex items-center gap-2 shrink-0"
        aria-label="홈으로 이동"
      >
        <IconBox size="header">
          <CalendarClock size={15} strokeWidth={1.75} />
        </IconBox>

        <span className="hidden items-baseline gap-1 sm:flex">
          <span className="typo-sub-t-2 font-bold text-foreground tracking-tight">
            ONE
          </span>
          <span className="typo-sub-t-2 font-medium text-muted tracking-tight">
            Scheduler
          </span>
        </span>
      </Link>

      {/* 폰(<640)에선 위치가 로고 옆, 그 위로는 헤더 우측 묶음에 */}
      <div className="sm:hidden">
        <LocationPicker />
      </div>
    </Row>
  );
}
