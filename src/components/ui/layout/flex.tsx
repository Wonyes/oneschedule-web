import { cn } from "@/src/utils/cn";
import { ChevronRight } from "lucide-react";

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Row = ({ className, children, ...props }: FlexProps) => {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  );
};

const Column = ({ className, children, ...props }: FlexProps) => {
  return (
    <div className={cn("flex flex-col items-start", className)} {...props}>
      {children}
    </div>
  );
};

const Between = ({ className, children, ...props }: FlexProps) => {
  return (
    <div
      className={cn("flex justify-between w-full items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
};

function ActionRow({
  icon,
  title,
  danger,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        flex
        items-center
        justify-between
        px-7
        py-5
        hover:bg-white/5
        transition
      "
    >
      <div
        className={`
          flex
          items-center
          gap-3
          ${danger ? "text-red-400" : "text-slate-300"}
        `}
      >
        {icon}

        <span className="typo-caption-2">{title}</span>
      </div>

      <ChevronRight size={16} className="text-slate-500" />
    </button>
  );
}

export { Row, Column, Between, ActionRow };
