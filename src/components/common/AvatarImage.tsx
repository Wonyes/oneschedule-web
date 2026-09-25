"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

type AvatarImageProps = {
  src?: string | null;
  nickname: string;
  fallback?: ReactNode;
};

export default function AvatarImage({
  src,
  nickname,
  fallback,
}: AvatarImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <>{fallback ?? nickname[0]}</>;
  }

  return (
    // fill 은 부모가 relative 여야 해서 여기서 감싼다 (호출부는 크기만 정한다)
    <span className="relative block h-full w-full">
      <Image
        src={src}
        alt=""
        fill
        sizes="96px"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="object-cover"
      />
    </span>
  );
}
