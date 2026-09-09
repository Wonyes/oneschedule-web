"use client";

import { useState } from "react";

import { useInfiniteScroll } from "./useInfiniteScroll";

export function useIncrementalList<T>(items: T[], step = 5) {
  const [count, setCount] = useState(step);
  const [seenLength, setSeenLength] = useState(items.length);

  if (seenLength !== items.length) {
    setSeenLength(items.length);
    setCount(step);
  }

  const hasMore = count < items.length;

  const { rootRef, sentinelRef } = useInfiniteScroll(hasMore, () =>
    setCount((prev) => prev + step),
  );

  return {
    visible: items.slice(0, count),
    hasMore,
    rootRef,
    sentinelRef,
  };
}
