import GoogleMark from "@/src/components/common/GoogleMark";
import { cn } from "@/src/utils/cn";

type GoogleLoginButtonProps = {
  href: string;
  label?: string;
  className?: string;
};

export default function GoogleLoginButton({
  href,
  label = "Google 계정으로 로그인",
  className,
}: GoogleLoginButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        `
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full

        neu-btn
        text-secondary

        btn-spring
        active:scale-[0.98]

        hover:text-foreground

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-accent/60
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--main-bg)]
        `,
        className,
      )}
    >
      <GoogleMark size={20} />
    </a>
  );
}
