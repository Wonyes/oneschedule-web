import { cn } from "@/src/utils/cn";
import { Column } from "./layout/flex";

export default function EmptyState({
  title,
  hint,
  icon,
  className,
  action,
}: {
  title: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <Column
      className={cn(
        "items-center justify-center gap-1 py-8 text-center",
        className,
      )}
    >
      {icon && <span className="mb-1 text-place-h">{icon}</span>}
      <span className="typo-caption-2 text-muted">{title}</span>
      {hint && <span className="typo-caption-3 text-place-h">{hint}</span>}
      {action && <div className="mt-2">{action}</div>}
    </Column>
  );
}
