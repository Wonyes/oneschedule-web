import { cn } from "@/src/utils/cn";

type BaseCardProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "flat" | "pressed";
  glow?: boolean;
};

export default function BaseCard({
  children,
  className,
  variant = "flat",
  glow = false,
}: BaseCardProps) {
  return (
    <div
      className={cn(
        `
        relative
        overflow-hidden
        rounded-[28px]
        w-full
        `,
        variant === "flat" ? "neu-flat" : "neu-pressed",

        className,
      )}
    >
      {glow && (
        <div
          className="
            absolute
            -top-24
            left-1/2
            -translate-x-1/2
            w-72
            h-72
            rounded-full
            bg-indigo-500/20
            blur-3xl
            pointer-events-none
          "
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
