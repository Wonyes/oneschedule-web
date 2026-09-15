"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const explicit = document.documentElement.dataset.theme;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(
      explicit === "dark" || explicit === "light"
        ? explicit
        : systemDark
          ? "dark"
          : "light",
    );
  }, []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    const apply = () => {
      setTheme(next);
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
      aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      className="neu-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-secondary"
    >
      {theme === "light" ? (
        <Moon size={15} strokeWidth={1.75} />
      ) : (
        <Sun size={15} strokeWidth={1.75} />
      )}
    </button>
  );
}
