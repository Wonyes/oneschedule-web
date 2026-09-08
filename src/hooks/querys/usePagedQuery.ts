"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { Get } from "./useMutations";
import { PageResponse } from "@/src/types/group";

type PagedQueryOptions = {
  queryKey: unknown[];
  url: string;
  /** 한 번에 받을 개수. 화면마다 다르므로 호출부가 정한다. */
  size: number;
  /** page·size 말고 같이 보낼 값들 (검색어 등) */
  params?: Record<string, string | number | boolean>;
  enabled?: boolean;
};

/**
 * PageResponse<T>를 주는 엔드포인트용 무한 스크롤.
 *
 * "다음 페이지가 있는가"를 판단하는 규칙(last / page + 1)을 한곳에 둔다.
 * 서버가 커서 방식으로 바뀌거나 페이지가 1부터 시작하게 되면 여기만 고치면 된다.
 */
export function usePagedQuery<T>({
  queryKey,
  url,
  size,
  params,
  enabled = true,
}: PagedQueryOptions) {
  return useInfiniteQuery({
    queryKey: [...queryKey, size],

    queryFn: ({ pageParam }) =>
      Get<PageResponse<T>>({
        url,
        params: { ...params, page: pageParam, size },
      }),

    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,

    enabled,
    retry: false,
  });
}
