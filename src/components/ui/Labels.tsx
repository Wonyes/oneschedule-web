import { cn } from "@/src/utils/cn";

type LabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function Label({ children, className = "" }: LabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-2.5 py-1 typo-caption-2 neu-flat text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
