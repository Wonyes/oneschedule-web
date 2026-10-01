"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { Get } from "./useMutations";
import { PageResponse } from "@/src/types/group";

type PagedQueryOptions = {
  queryKey: unknown[];
  url: string;
  size: number;
  params?: Record<string, string | number | boolean>;
  enabled?: boolean;
};

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
