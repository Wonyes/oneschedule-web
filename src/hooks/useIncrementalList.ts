"use client";

import { useState } from "react";

import { useInfiniteScroll } from "./useInfiniteScroll";

/**
 * 스크롤 끝에 닿으면 step개씩 더 보여준다.
 *
 * 서버 페이징이 아니라 이미 받아온 배열을 나눠 그리는 방식이다.
 * 목록이 길어져 서버 페이징이 필요해지면 usePagedQuery + useInfiniteScroll로
 * 바꾸고 이 훅은 걷어내면 된다.
 */
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
