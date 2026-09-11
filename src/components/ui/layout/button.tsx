import React from "react";
import Link from "next/link";
import { cn } from "@/src/utils/cn";

type ButtonProps = {
  text?: string;
  icon?: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  href?: string;
};

const BaseButton = ({
  text,
  icon,
  className,
  isDisabled,
  onClick,
  type = "button",
  ariaLabel,
  href,
}: ButtonProps) => {
  const sharedClassName = cn(
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
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-accent/60
    focus-visible:ring-offset-2
    focus-visible:ring-offset-[var(--main-bg)]
    `,
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        prefetch
        aria-label={ariaLabel ?? (text ? undefined : "버튼")}
        className={sharedClassName}
      >
        {icon}
        {text}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel ?? (text ? undefined : "버튼")}
      className={sharedClassName}
    >
      {icon}
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
        h-12
        px-5
        rounded-xl

        btn-primary

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
