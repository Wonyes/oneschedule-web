"use client";

import { useThemeStore } from "@//hooks/stores/Theme";
import { useEffect } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="flex justify-center items-center p-2 rounded-full bg-main-bg text-t-title border border-divider"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
