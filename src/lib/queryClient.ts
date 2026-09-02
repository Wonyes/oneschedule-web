import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const QUERY_STALE_TIME = 1000 * 60 * 30;

/**
 * 서버 렌더링 1회당 하나의 QueryClient를 공유한다.
 * staleTime은 클라이언트(providers.tsx)와 맞춰야 하이드레이션 직후 즉시 재요청하지 않는다.
 */
export const getServerQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: QUERY_STALE_TIME,
        },
      },
    }),
);
