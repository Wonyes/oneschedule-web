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

  return (
    <div
      className={`fixed left-1/2 top-1/2 z-[10000] flex w-fit max-w-[728px] -translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-blue-600 px-4 py-2 text-center transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="whitespace-nowrap text-white text-sm font-medium">
        {message}
      </span>
    </div>
  );
}
