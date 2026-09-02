"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // 서버가 theme 쿠키를 읽어 <html>에 이미 올바른 data-theme을 렌더링해두므로,
    // 마운트 시 그 값을 그대로 읽어와 버튼 아이콘만 맞춘다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);

    // localStorage가 아니라 쿠키에 저장한다: 서버 컴포넌트(RootLayout)가
    // 요청 시점에 쿠키를 읽어 <html data-theme>을 직접 렌더링해야
    // router.refresh() 등으로 레이아웃이 다시 렌더링돼도 라이트 테마가
    // 유지된다(클라이언트에서만 DOM 속성을 바꾸면 그다음 서버 재렌더링 때 사라짐).
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;

    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
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
