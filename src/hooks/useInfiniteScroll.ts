"use client";

import { useEffect, useRef } from "react";

/**
 * 목록 끝에 닿으면 onLoadMore를 부른다.
 *
 * 서버 페이징(useInfiniteQuery)과 클라이언트 자르기(useIncrementalList)가
 * 같은 스크롤 감각을 갖도록 관찰자 부분만 떼어냈다. 화면 입장에서 둘의 차이는
 * "다음 게 네트워크에서 오느냐"뿐이라 여기서는 구분하지 않는다.
 */
export function useInfiniteScroll(
  hasMore: boolean,
  onLoadMore: () => void,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 콜백이 매 렌더 새로 만들어져도 관찰자를 다시 만들지 않게 담아둔다.
  // 렌더 중에 ref를 건드리면 안 되므로 effect에서 갈아끼운다.
  const loadMore = useRef(onLoadMore);

  useEffect(() => {
    loadMore.current = onLoadMore;
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) return;

    // 스크롤 컨테이너인지는 CSS로 판단한다.
    //
    // "지금 넘치는가"(scrollHeight > clientHeight)로 보면 안 된다. 첫 묶음이
    // 아직 컨테이너를 못 채운 동안에는 넘치지 않아 뷰포트가 root가 되고,
    // 그러면 sentinel이 곧바로 걸려 의도한 개수보다 더 풀린다.
    const container = rootRef.current;
    const scrollable =
      !!container &&
      ["auto", "scroll"].includes(getComputedStyle(container).overflowY);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore.current();
      },
      // rootMargin을 두면 안 된다. 목록 끝에 "더 있다"는 미리보기 줄이 붙어 있어서,
      // 미리 당겨 읽으면 그 줄 아래의 sentinel이 곧바로 걸려 한 번에 전부 펼쳐진다.
      { root: scrollable ? container : null, rootMargin: "0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore]);

  return { rootRef, sentinelRef };
}
