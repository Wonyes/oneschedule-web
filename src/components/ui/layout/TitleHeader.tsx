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
      <span className="text-[20px] font-bold text-[#2b3674]">{title}</span>
      {subTitle && (
        <button
          type="button"
          onClick={onClick}
          className="text-[12px] text-[var(--c-gray888)] transition-colors hover:text-gray-600"
        >
          {subTitle}
        </button>
      )}
    </div>
  );
}
