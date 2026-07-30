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
      className={`fixed bottom-10 left-1/2 z-[10000] flex w-fit max-w-[728px] -translate-x-1/2 items-center rounded-2xl bg-indigo-600 px-5 py-3 shadow-xl transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <span className="whitespace-nowrap text-white text-xs font-semibold">
        {message}
      </span>
    </div>
  );
}
