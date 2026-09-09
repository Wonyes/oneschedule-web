"use client";

import { useEffect, useRef } from "react";

export function useInfiniteScroll(hasMore: boolean, onLoadMore: () => void) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useRef(onLoadMore);

  useEffect(() => {
    loadMore.current = onLoadMore;
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) return;

    const container = rootRef.current;
    const scrollable =
      !!container &&
      ["auto", "scroll"].includes(getComputedStyle(container).overflowY);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore.current();
      },
      { root: scrollable ? container : null, rootMargin: "0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore]);

  return { rootRef, sentinelRef };
}
