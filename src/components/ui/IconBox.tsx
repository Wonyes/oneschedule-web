import { cn } from "@/src/utils/cn";

type IconBoxSize = "sm" | "md" | "lg";
type IconBoxTone = "accent" | "muted" | "success" | "warning" | "danger";
type IconBoxShape = "square" | "circle";

const SIZE: Record<IconBoxSize, string> = {
  sm: "h-7 w-7 rounded-lg",
  md: "h-9 w-9 rounded-lg",
  lg: "h-10 w-10 rounded-xl",
};

const TONE: Record<IconBoxTone, string> = {
  accent: "text-accent",
  muted: "text-muted",
  success: "text-success-500",
  warning: "text-pending-500",
  danger: "text-error-500",
};

/**
 * 아이콘을 감싸는 표면. 앱 전체에서 같은 크기·모양·톤을 쓰기 위한 것으로,
 * 각 화면에서 neu-flat과 크기 클래스를 매번 적어 붙이지 않게 한다.
 */
export default function IconBox({
  children,
  size = "md",
  tone = "accent",
  shape = "square",
  pressed = false,
  className,
}: {
  children: React.ReactNode;
  size?: IconBoxSize;
  tone?: IconBoxTone;
  shape?: IconBoxShape;
  /** 눌린 표면이 필요한 경우(선택된 상태 등) */
  pressed?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        SIZE[size],
        shape === "circle" && "rounded-full",
        pressed ? "neu-pressed" : "neu-flat",
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
