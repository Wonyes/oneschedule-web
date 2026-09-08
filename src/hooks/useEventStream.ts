"use client";

import { useEffect } from "react";

/**
 * 서버와의 상시 연결.
 *
 * 지금은 "이 사람 접속 중"을 서버에 알리는 용도뿐이다. 서버는 열려 있는 연결을
 * 메모리에 들고 있다가 그룹의 온라인 목록을 만들 때 쓴다. 알림을 붙이면
 * 같은 연결로 이벤트가 내려온다.
 *
 * 쿠키 인증이라 네이티브 EventSource로 충분하다. 폴리필은 Authorization 헤더를
 * 붙여야 할 때만 필요하다.
 */
export function useEventStream(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const source = new EventSource(
      `${process.env.NEXT_PUBLIC_SERVER_IP}/v1/api/sse/subscribe`,
      { withCredentials: true },
    );

    source.onerror = () => {
      // EventSource는 끊기면 스스로 다시 붙는다. 여기서 무조건 close하면
      // 네트워크가 한 번 끊길 때마다 연결이 영영 죽는다.
      // 브라우저가 재연결을 포기한 경우(CLOSED)만 정리한다 — 보통 인증 실패다.
      if (source.readyState === EventSource.CLOSED) source.close();
    };

    // 언마운트·HMR 때 반드시 닫는다. 안 닫으면 개발 중에 연결이 계속 쌓인다.
    return () => source.close();
  }, [enabled]);
}
