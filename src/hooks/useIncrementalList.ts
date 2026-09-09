"use client";

import { useState } from "react";

import { useInfiniteScroll } from "./useInfiniteScroll";

export function useIncrementalList<T>(items: T[], step = 5) {
  const [count, setCount] = useState(step);
  const [seenLength, setSeenLength] = useState(items.length);

  // 목록 자체가 바뀌면 처음부터 다시 보여준다.
  // effect가 아니라 렌더 중에 맞춰서 한 번 더 그리는 낭비를 막는다.
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
