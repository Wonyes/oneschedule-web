import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
  className?: string;
}

export default function NavButton({
  direction,
  onClick,
  label,
  className = "",
}: NavButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-muted/10 active:scale-95 ${className}`}
    >
      <Icon size={18} />
    </button>
  );
}
