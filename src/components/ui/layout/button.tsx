import React from "react";
import { cn } from "@/src/utils/cn";

type ButtonProps = {
  text?: string;
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
        btn-spring
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

        bg-accent
        text-on-primary

        shadow-lg
        shadow-accent/25

        hover:bg-accent/90

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

        neu-btn
        text-secondary

        hover:text-foreground

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
        text-muted

        hover:bg-white/[0.05]
        hover:text-foreground
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

        bg-error-500/15
        text-error-500

        border
        border-error-500/25

        hover:bg-error-500
        hover:text-white
        hover:border-transparent

        `,
        props.className,
      )}
    />
  );
};

export { Primary, SecondaryBtn, GhostBtn, RedBtn };
