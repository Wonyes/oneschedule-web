"use client";

import { useState, type ReactNode } from "react";

type AvatarImageProps = {
  src?: string | null;
  nickname: string;
  fallback?: ReactNode;
};

/**
 * 아바타는 호스트를 미리 알 수 없다 — 업로드 저장소(네이버)와 구글 OAuth 사진이 섞인다.
 * next/image는 등록 안 된 호스트면 렌더 중에 throw해서 에러 바운더리로 가버리므로,
 * 여기서는 일반 img를 쓰고 깨진 주소는 onError로 이니셜 폴백 처리한다.
 */
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
