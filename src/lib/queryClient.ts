import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const QUERY_STALE_TIME = 1000 * 60 * 30;

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
