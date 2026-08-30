import { ScheduleEvent } from "@/src/types/schedule";
import { getTimes, isSameDate } from "@/src/utils/schedule";
import { EVENT_STYLES } from "@/src/constant/schedule";

type EventCardProps = {
  event: ScheduleEvent;
  variant?: "week" | "month" | "day" | "agenda";
  top?: number;
  width?: number;
  left?: number;
  height?: number;
  date?: Date;
  className?: string;
  onClick?: () => void;
};

export default function ScheduleCard({
  top,
  date,
  left,
  width,
  event,
  height,
  className = "",
  variant = "week",
  onClick,
}: EventCardProps) {
  const style = EVENT_STYLES[event.category];

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const isStart = isSameDate(start, date);
  const isEnd = isSameDate(end, date);

  const horizontalConnection = `
    ${!isStart ? "-ml-[1px] rounded-l-none border-l-0" : "rounded-l-lg"}
    ${!isEnd ? "-mr-[1px] rounded-r-none border-r-0" : "rounded-r-lg"}
  `;

  const connectionClass = variant === "week" && horizontalConnection;

  // 1. Month 뷰 카드 (슬림하고 간결한 인라인 칩 형태)
  if (variant === "month") {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={`
          group px-2 py-1 rounded-md truncate flex items-center gap-1.5
          bg-surface/80  border border-white/5
          hover:border-white/15 hover:bg-surface-hover
          cursor-pointer transition-all duration-150 ${connectionClass} ${className}
        `}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot || "bg-accent"}`}
        />
        <span className="typo-caption-2 truncate font-medium text-slate-200 group-hover:text-white">
          {event.title}
        </span>
      </div>
    );
  }

  // 1.5 Agenda 리스트 카드 (모바일 월간뷰에서 선택한 날짜의 일정 목록)
  if (variant === "agenda") {
    return (
      <div
        onClick={onClick}
        className={`
          flex items-center gap-3 rounded-xl
          bg-surface/90 border border-white/10
          p-3 transition-all duration-150
          cursor-pointer hover:border-accent/40 hover:bg-surface-hover ${className}
        `}
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${style.dot || "bg-accent"}`}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="typo-caption-1 font-semibold text-white truncate">
            {event.title}
          </span>
          <span className="text-[11px] font-medium text-accent/80 tracking-tight">
            {getTimes(event.startDate)} - {getTimes(event.endDate)}
          </span>
        </div>
      </div>
    );
  }

  // 2. Day 뷰 카드 (Linear/Vercel 스타일의 깊이감 있는 플로팅 카드)
  if (variant === "day") {
    return (
      <div
        onClick={onClick}
        className={`
          absolute left-0 right-0 rounded-xl
          bg-surface/90  border border-white/10
          p-2.5 shadow-xl z-10 transition-all duration-200
          cursor-pointer hover:border-accent/40 hover:bg-surface-hover ${className}
        `}
        style={{
          top: `${top}%`,
          height: `${height}%`,
          minHeight: 26,
          width: `${width}%`,
          left: `${left}%`,
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${style.dot || "bg-accent"}`}
          />
          <span className="text-[11px] font-medium text-accent/80 tracking-tight">
            {getTimes(event.startDate)} - {getTimes(event.endDate)}
          </span>
        </div>
        <span className="typo-caption-1 font-semibold text-white block truncate">
          {event.title}
        </span>
      </div>
    );
  }

  // 3. Week 뷰 카드 (정교한 좌측 포인트 라인과 모던한 글래스 서피스)
  return (
    <div
      onClick={onClick}
      className={`
        absolute left-0 right-0 rounded-xl
        bg-surface/90 border border-white/10
        p-2.5 z-10 overflow-hidden
        cursor-pointer hover:z-50 hover:border-accent/50 hover:bg-surface-hover hover:shadow-2xl
        transition-all duration-200
        ${connectionClass} ${className}
      `}
      style={{
        top: `${top}%`,
        height: `${height}%`,
        minHeight: 26,
      }}
    >
      {/* 좌측에 은은한 카테고리 컬러 인디케이터 바 추가 */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${style.dot || "bg-accent"}`}
      />

      {isStart && (
        <div className="flex flex-col gap-1 pl-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-accent/80 tracking-tight">
              {getTimes(event.startDate)} - {getTimes(event.endDate)}
            </span>
          </div>
          <span className="typo-caption-1 font-semibold text-white truncate">
            {event.title}
          </span>
        </div>
      )}

      {isEnd && isStart !== isEnd && (
        <div className="flex flex-col gap-1 pl-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-accent/80 tracking-tight">
              {getTimes(event.startDate)} - {getTimes(event.endDate)}
            </span>
          </div>
          <span className="typo-caption-1 font-semibold text-white truncate">
            {event.title}
          </span>
        </div>
      )}
    </div>
  );
}
