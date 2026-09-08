"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 스크롤 끝에 닿으면 step개씩 더 보여준다.
 *
 * 서버 페이징이 아니라 이미 받아온 배열을 나눠 그리는 방식이다.
 * 목록이 길어져 서버 페이징이 필요해지면 useInfiniteQuery로 바꾸고
 * 이 훅은 걷어내면 된다.
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

  const rootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = count < items.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) return;

    // 컨테이너가 자체 스크롤을 가질 때만 root로 쓴다.
    // 모바일처럼 컨테이너가 안 잘리면 sentinel이 항상 안에 있어
    // root로 두면 한 번에 전부 펼쳐진다. 그때는 뷰포트를 기준으로 본다.
    const container = rootRef.current;
    const scrollable =
      !!container && container.scrollHeight > container.clientHeight;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCount((prev) => prev + step);
        }
      },
      { root: scrollable ? container : null, rootMargin: "40px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, step]);

  return {
    visible: items.slice(0, count),
    hasMore,
    rootRef,
    sentinelRef,
  };
}
