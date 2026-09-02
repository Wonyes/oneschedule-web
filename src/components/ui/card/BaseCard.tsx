import { cn } from "@/src/utils/cn";

type BaseCardProps = {
  children: React.ReactNode;
  className?: string;
  childClass?: string;
  variant?: "flat" | "pressed";
  glow?: boolean;
};

export default function BaseCard({
  children,
  className,
  childClass,
  variant = "flat",
  glow = false,
}: BaseCardProps) {
  return (
    <div
      className={cn(
        `
        relative
        rounded-[var(--radius-outer)]
        w-full
        `,
        variant === "flat" ? "neu-flat" : "neu-pressed",

        className,
      )}
    >
      {glow && (
        <div className="absolute inset-0 overflow-hidden rounded-[var(--radius-outer)] pointer-events-none">
          <div
            className="
              absolute
              -top-20
              left-1/2
              -translate-x-1/2
              w-(--card-glow-size)
              h-(--card-glow-size)
              rounded-full
              bg-[image:var(--card-glow)]
              blur-2xl
            "
          />
        </div>
      )}

      <div className={cn("relative z-10", childClass)}>{children}</div>
    </div>
  );
}
