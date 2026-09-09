"use client";

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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}
