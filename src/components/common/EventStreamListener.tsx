"use client";

import { useMyInfo } from "@/src/hooks/querys/useMembers";
import { useEventStream } from "@/src/hooks/useEventStream";

/**
 * 로그인한 동안만 서버와 연결을 열어둔다.
 * 레이아웃에 한 번만 두는 게 중요하다 — 화면마다 붙이면 탭 하나가 연결을 여러 개 잡는다.
 */
export default function EventStreamListener() {
  const { data: user } = useMyInfo();

  useEventStream(!!user);

  return null;
}
