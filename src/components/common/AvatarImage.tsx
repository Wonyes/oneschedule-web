"use client";

import { useState, type ReactNode } from "react";

type AvatarImageProps = {
  src?: string | null;
  nickname: string;
  /** 이미지가 없거나 실패했을 때 보여줄 내용. 기본은 닉네임 첫 글자 */
  fallback?: ReactNode;
};

/**
 * 소셜 로그인 회원은 프로필 이미지가 외부 URL(lh3.googleusercontent.com)이라
 * 차단이나 429로 실패할 수 있다. 그때 alt 텍스트가 새어나오지 않도록
 * 조용히 첫 글자 폴백으로 돌아간다.
 *
 * 크기와 모양은 감싸는 쪽에서 정한다.
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
