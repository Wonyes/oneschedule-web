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
        whitespace-nowrap
        transition-all
        duration-200
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-40
        `,
        className,
      )}
    >
      {icon}
      {text}
    </button>
  );
};

/**
 * 가장 중요한 액션
 * 생성 / 저장 / 완료
 */
const Primary = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        h-12
        px-5
        rounded-xl

        bg-indigo-600
        text-white

        shadow-lg
        shadow-indigo-600/20

        hover:bg-indigo-500

        `,
        props.className,
      )}
    />
  );
};

/**
 * 일반 보조 액션
 * 취소 / 초대 / 선택
 */
const SecondaryBtn = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        h-12
        px-5
        rounded-xl

        bg-white/[0.05]
        text-slate-200

        border
        border-white/10

        hover:bg-white/[0.1]
        hover:text-white

        `,
        props.className,
      )}
    />
  );
};

/**
 * 최소 강조 액션
 * 뒤로가기 / 닫기 / 더보기
 */
const GhostBtn = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        h-10
        px-3
        rounded-lg

        bg-transparent
        text-slate-400

        hover:bg-white/[0.05]
        hover:text-white

        `,
        props.className,
      )}
    />
  );
};

/**
 * 위험 액션
 * 삭제 / 탈퇴
 */
const RedBtn = (props: ButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={cn(
        `
        h-12
        px-5
        rounded-xl

        bg-rose-500/15
        text-rose-400

        border
        border-rose-500/20

        hover:bg-rose-500
        hover:text-white
        hover:border-transparent

        `,
        props.className,
      )}
    />
  );
};

export { Primary, SecondaryBtn, GhostBtn, RedBtn };
