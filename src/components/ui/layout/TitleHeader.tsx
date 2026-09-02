import { cn } from "@/src/utils/cn";

interface TitleHeaderProps {
  pad?: string;
  title: string;
  subTitle?: string;
  className?: string;
  onClick?: () => void;
}

export default function TitleHeader({
  pad,
  title,
  onClick,
  subTitle,
  className,
}: TitleHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between w-full",
        pad ? pad : "pt-0 pb-[12px] px-[16px]",
        className,
      )}
    >
      <span className="typo-title-2">{title}</span>
      {subTitle && (
        <button
          type="button"
          onClick={onClick}
          className="typo-caption-2 text-muted transition-colors hover:text-foreground"
        >
          {subTitle}
        </button>
      )}
    </div>
  );
}
