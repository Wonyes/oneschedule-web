"use client";

import { useEffect } from "react";

/**
 * 루트 레이아웃 자체가 실패했을 때의 마지막 방어선.
 * app/error.tsx는 레이아웃 하위만 감싸기 때문에 layout.tsx에서 던진 에러는 여기서만 잡힌다.
 * 이 경우 레이아웃이 렌더링되지 않으므로 html/body를 직접 그려야 하고,
 * globals.css의 토큰도 못 쓰는 상황을 가정해 인라인 스타일로만 작성한다.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("루트 레이아웃 렌더링 실패:", error);
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#191c26",
          color: "#f5f6fb",
          fontFamily: "Pretendard, system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 360, padding: 24, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#98a0b8",
            }}
          >
            ERROR
          </p>

          <h1 style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 600 }}>
            앱을 불러오지 못했어요
          </h1>

          <p
            style={{
              margin: "8px 0 20px",
              fontSize: 13,
              lineHeight: 1.6,
              color: "#98a0b8",
            }}
          >
            잠시 후 다시 시도해 주세요. 문제가 계속되면 새로고침해 주세요.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              height: 44,
              padding: "0 24px",
              border: "none",
              borderRadius: 12,
              background: "#7c6cf6",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
