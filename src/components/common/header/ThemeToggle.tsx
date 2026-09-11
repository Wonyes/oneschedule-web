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

    const apply = () => {
      setTheme(next);
      document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.setAttribute("data-theme", next);
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

    const transition = document.startViewTransition(() => flushSync(apply));

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 550,
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
