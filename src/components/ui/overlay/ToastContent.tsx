"use client";

import { useEffect, useState } from "react";

interface ToastContentProps {
  message?: string;
}

export default function ToastContent({ message }: ToastContentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setVisible(true);
    });

    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  if (!message) return null;

  return (
    <div
      className={`fixed top-[40%] z-[10000] inset-x-4 mx-auto w-fit max-w-full sm:inset-x-auto sm:left-[55%] sm:mx-0 sm:-translate-x-1/2 sm:max-w-[728px] flex items-center rounded-2xl bg-indigo-600 px-5 py-3 shadow-xl transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <span className="whitespace-pre-line break-words text-white text-xs font-semibold">
        {message}
      </span>
    </div>
  );
}
