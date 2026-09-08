import GoogleMark from "@/src/components/common/GoogleMark";
import { cn } from "@/src/utils/cn";

type GoogleLoginButtonProps = {
  /**
   * 백엔드의 OAuth 시작 주소.
   * 응답이 구글로 향하는 302라 next/link나 fetch가 아니라
   * 브라우저 전체 이동이어야 한다.
   */
  href: string;
  /** 아이콘만 있는 버튼이라 스크린리더용 이름이 필요하다 */
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
