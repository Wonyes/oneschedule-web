"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    // 서버가 쿠키를 읽어 <html>에 data-theme을 이미 렌더링해두므로,
    // 마운트 시 그 값을 읽어 버튼 아이콘만 맞춘다(SSR 시점엔 document가 없다).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);

    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;

    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
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
