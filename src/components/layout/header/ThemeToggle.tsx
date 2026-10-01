"use client";

import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/** 진실은 <html data-theme>. 없으면 OS 설정을 따른다 (globals.css의 팔레트 규칙과 동일) */
const readTheme = (): Theme => {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark" || explicit === "light") return explicit;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
};

/**
 * 어떤 아이콘을 보일지는 CSS가 정한다(.theme-icon-light / .theme-icon-dark).
 * JS가 테마를 판단해 아이콘을 고르면, 쿠키가 없는 방문자에게서
 * 서버(light 가정)와 클라이언트(OS 설정)가 어긋나 하이드레이션이 깨진다.
 */
export default function ThemeToggle() {
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = readTheme() === "light" ? "dark" : "light";
    const root = document.documentElement;

    const apply = () => {
      document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
      root.setAttribute("data-theme", next);
    };

    if (!document.startViewTransition) {
      apply();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // 전환 중엔 페이지를 "정지 화면"으로 만든다: 돌아가는 애니메이션은 멈추고,
    // 테마 변경으로 시작되는 색·그림자 CSS 트랜지션은 전부 끈다(globals.css의 data-theme-switching).
    // 그래야 새 화면이 매 프레임 다시 그려지지 않고 원형 클립만 GPU에서 움직인다.
    const paused = document
      .getAnimations()
      .filter((a) => a.playState === "running");
    paused.forEach((a) => a.pause());
    root.setAttribute("data-theme-switching", "");

    const transition = document.startViewTransition(() => flushSync(apply));

    transition.finished.finally(() => {
      root.removeAttribute("data-theme-switching");
      paused.forEach((a) => a.play());
    });

    transition.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="테마 전환"
      className="neu-flat btn-spring flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-accent"
    >
      <Moon size={15} strokeWidth={1.75} className="theme-icon-light" />
      <Sun size={15} strokeWidth={1.75} className="theme-icon-dark" />
    </button>
  );
}
