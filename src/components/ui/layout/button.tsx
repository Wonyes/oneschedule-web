import React from "react";
import { cn } from "@/src/utils/cn";

type ButtonProps = {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

const BaseButton = ({
  text,
  icon,
  className,
  isDisabled,
  onClick,
  type = "button",
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        `
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-medium
        text-sm
        transition-all
        duration-200
        whitespace-nowrap
        active:scale-[0.98]
        disabled:cursor-not-allowed
        `,
        className,
        isDisabled && "opacity-40 grayscale pointer-events-none",
      )}
    >
      {icon && icon}
      {text}
    </button>
  );
};

const Primary = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        bg-indigo-600
        text-white
        shadow-lg
        shadow-indigo-600/25
        hover:bg-indigo-500
        py-3
        px-4
        `,
        props.className,
      )}
    />
  );
};

const SecondaryBtn = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        bg-white/[0.04]
        text-slate-200
        border
        border-white/10
        hover:bg-white/[0.08]
        hover:text-white
        py-3
        px-4
        `,
        props.className,
      )}
    />
  );
};

const LineBtn = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        bg-transparent
        text-slate-300
        border
        border-white/10
        hover:bg-white/[0.04]
        hover:text-white
        py-3
        px-4
        `,
        props.className,
      )}
    />
  );
};

const RedBtn = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        bg-rose-500/15
        text-rose-400
        border
        border-rose-500/30
        hover:bg-rose-600
        hover:text-white
        hover:border-transparent
        py-3
        px-4
        `,
        props.className,
      )}
    />
  );
};

const WhiteBtn = SecondaryBtn;
const BlueBtn = SecondaryBtn;

export { Primary, SecondaryBtn, LineBtn, RedBtn, WhiteBtn, BlueBtn };
