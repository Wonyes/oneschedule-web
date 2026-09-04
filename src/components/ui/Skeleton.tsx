import { cn } from "@/src/utils/cn";

/**
 * 로딩 중 자리를 채우는 표면. 실제 카드/텍스트 크기에 맞춰 className으로
 * 크기·모양을 지정해서 쓴다. 애니메이션은 globals.css의 skeleton-shimmer.
 */
export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}
