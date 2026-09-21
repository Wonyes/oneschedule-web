import Image from "next/image";

import { cn } from "@/src/utils/cn";

/** 서비스 마크 (public/assets/mark.png). 헤더 로고·브랜드 히어로에서 같은 그림을 쓴다 */
export default function BrandMark({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/assets/mark.png"
      alt=""
      width={size}
      height={size}
      priority
      className={cn("shrink-0 select-none", className)}
      style={{ borderRadius: size * 0.22 }}
    />
  );
}
