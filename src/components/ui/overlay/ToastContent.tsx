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
    // 검증 실패 메시지는 사유가 여러 줄로 올 수 있어 nowrap을 뺐다.
    // 모바일은 좌우 여백만 주고 가운데 정렬한다. left만 지정하면 fit-content가
    // "left부터 오른쪽 끝까지"로 계산돼 320px에서 폭이 절반으로 깎인다.
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
