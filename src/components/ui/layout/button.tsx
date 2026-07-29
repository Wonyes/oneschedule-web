import React from "react";
import { cn } from "@/src/utils/cn";

type ButtonProps = {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  onClick?: () => void;
};

const BaseButton = ({
  text,
  icon,
  className,
  isDisabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        `
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        typo-caption-2
        transition-all
        whitespace-nowrap
        disabled:cursor-not-allowed
        `,
        className,
        isDisabled && "opacity-60 grayscale",
      )}
    >
      {icon && icon}
      {text}
    </button>
  );
};

// 메인 버튼
const Primary = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        bg-black
        text-white
        hover:opacity-90
        `,
        props.className,
      )}
    />
  );
};

// 파란 배경 버튼
const BlueBtn = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        bg-[#EFF4FB]
        text-[#2E81FF]
        hover:bg-[#2E81FF]
        hover:text-white
        `,
        props.className,
      )}
    />
  );
};

// 흰색 버튼
const WhiteBtn = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        bg-white
        text-[#2B3674]
        border
        border-[#E0E5F2]
        hover:bg-[#F4F7FE]
        `,
        props.className,
      )}
    />
  );
};

// 빨간 버튼
const RedBtn = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        bg-[#FFF5F5]
        text-[#E31A1A]
        hover:bg-[#E31A1A]
        hover:text-white
        `,
        props.className,
      )}
    />
  );
};

// 라인 버튼
const LineBtn = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        bg-transparent
        text-[#2E81FF]
        border
        border-[#2E81FF]
        hover:bg-[#2E81FF]
        hover:text-white
        `,
        props.className,
      )}
    />
  );
};

export { Primary, BlueBtn, WhiteBtn, RedBtn, LineBtn };
