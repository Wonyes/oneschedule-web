import { cn } from "@/src/utils/cn";

/** 아바타 우하단 접속 표시. 부모에 `relative`가 필요하다. */
export default function PresenceDot({
  online,
  title,
}: {
  online: boolean;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-[var(--surface)]",
        online ? "bg-success-500" : "bg-place-h",
      )}
    />
  );
}
