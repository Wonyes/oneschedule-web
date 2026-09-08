"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");

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

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);

    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.setAttribute("data-theme", next);
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
