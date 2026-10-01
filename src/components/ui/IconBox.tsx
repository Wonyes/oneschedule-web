import { cn } from "@/src/utils/cn";

type IconBoxSize = "sm" | "header" | "md" | "lg";
type IconBoxTone = "accent" | "muted" | "success" | "warning" | "danger";
type IconBoxShape = "square" | "circle";

const SIZE: Record<IconBoxSize, string> = {
  sm: "h-8 w-8 rounded-lg",
  header: "h-9 w-9 rounded-xl",
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
