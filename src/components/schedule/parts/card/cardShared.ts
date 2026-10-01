import { EVENT_STYLES } from "@/src/constant/schedule";
import { ScheduleEvent } from "@/src/types/schedule";

/** 시간 격자에서 카드 오른쪽에 남기는 클릭 여백(px) */
const GRID_CLICK_GUTTER = 10;

export type CardPosition = {
  top?: number;
  height?: number;
  left?: number;
  width?: number;
};

/** 시간 격자 위 절대 배치 스타일 (week · day · overflow 공통) */
export const positionStyle = ({ top, height, left, width }: CardPosition) => ({
  top: `${top}%`,
  height: `${height}%`,
  minHeight: 28,
  left: `${left ?? 0}%`,
  width: `calc(${width ?? 100}% - ${GRID_CLICK_GUTTER}px)`,
});

/** 카테고리 점 색. 모르는 카테고리면 accent */
export const dotClass = (event: ScheduleEvent) =>
  EVENT_STYLES[event.category as keyof typeof EVENT_STYLES]?.dot ?? "bg-accent";

export const conflictClass = (event: ScheduleEvent) =>
  event.hasConflict ? "ring-1 ring-error-500/70" : "";

/** 한 시간 미만이면 한 줄로 */
export const isCompact = (event: ScheduleEvent) =>
  new Date(event.endDate).getTime() - new Date(event.startDate).getTime() <
  60 * 60 * 1000;
