"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";

import BaseCard from "@/src/components/ui/card/BaseCard";
import EmptyState from "@/src/components/ui/EmptyState";
import { Column } from "@/src/components/ui/layout/flex";
import { Input } from "@/src/components/ui/layout/input";
import SectionHeading from "@/src/components/ui/layout/SectionHeading";
import ScrollListArea, {
  ScrollSentinel,
} from "@/src/components/ui/ScrollListArea";
import Skeleton from "@/src/components/ui/Skeleton";
import { usePublicGroups } from "@/src/hooks/querys/useGroup";
import { useInfiniteScroll } from "@/src/hooks/useInfiniteScroll";
import { stagger } from "@/src/lib/motion";
import PublicGroupCard from "./PublicGroupCard";

function TileSkeletons({ count }: { count: number }) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Column key={i} className="items-center gap-2 p-3">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-2.5 w-10" />
        </Column>
      ))}
    </div>
  );
}

export default function PublicGroupList() {
  const [keyword, setKeyword] = useState("");
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePublicGroups(keyword);

  const groups = data?.pages.flatMap((page) => page.content) ?? [];

  const { rootRef, sentinelRef } = useInfiniteScroll(!!hasNextPage, () => {
    if (!isFetchingNextPage) fetchNextPage();
  });

  return (
    <BaseCard className="w-full p-4 sm:p-6" glow>
      <SectionHeading
        className="mb-3"
        eyebrow="DISCOVER"
        title="공개 그룹 둘러보기"
      />

      <Input
        value={keyword}
        placeholder="그룹 이름으로 검색"
        leftSection={<Search size={14} className="shrink-0 text-place-h" />}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <Column className="mt-4 w-full">
        {isPending ? (
          <div className="py-4">
            <TileSkeletons count={6} />
          </div>
        ) : isError ? (
          <EmptyState title="목록을 불러오지 못했어요." />
        ) : groups.length === 0 ? (
          <EmptyState
            title={
              keyword.trim()
                ? "검색 결과가 없어요."
                : "아직 공개된 그룹이 없어요."
            }
          />
        ) : (
          <ScrollListArea
            rootRef={rootRef}
            showFade={!!hasNextPage}
            className="scroll-hidden max-h-[440px] w-full overflow-y-auto"
          >
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid w-full grid-cols-2 gap-1 sm:grid-cols-3"
            >
              {groups.map((group) => (
                <PublicGroupCard key={group.groupNo} group={group} />
              ))}
            </motion.div>

            {isFetchingNextPage && <TileSkeletons count={3} />}
            {hasNextPage && <ScrollSentinel sentinelRef={sentinelRef} />}
          </ScrollListArea>
        )}
      </Column>
    </BaseCard>
  );
}
