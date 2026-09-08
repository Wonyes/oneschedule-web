"use client";

import { useSyncExternalStore } from "react";

/** 구독할 외부 소스가 없다. 값이 바뀔 일이 없으므로 빈 구독을 준다. */
const subscribe = () => () => {};

/**
 * 하이드레이션이 끝났는지 알려준다.
 *
 * react-query는 서버에서 돌지 않아 SSR에서는 항상 로딩 상태다.
 * 클라이언트는 캐시가 있으면 곧바로 본 화면을 그리는데, 그러면 서버가 보낸
 * HTML과 트리가 어긋나 하이드레이션이 깨진다.
 *
 * 서버 스냅샷은 false, 클라이언트 스냅샷은 true를 주면
 * 첫 렌더는 서버와 같은 화면(스켈레톤)이 되고 그 뒤부터 실제 데이터를 반영한다.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
