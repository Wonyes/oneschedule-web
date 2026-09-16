import { formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";

import { MemberPresence } from "@/src/types/group";

export type PresenceMap = Map<number, MemberPresence> | undefined;

/** presence Map에서 한 멤버의 온라인 여부와 표시 라벨("온라인" / "3분 전" / "오프라인") */
export function getPresence(presence: PresenceMap, memberNo: number) {
  const status = presence?.get(memberNo);
  const online = status?.online ?? false;
  const label = online
    ? "온라인"
    : status?.lastSeenAt
      ? formatDistanceToNowStrict(new Date(status.lastSeenAt), {
          addSuffix: true,
          locale: ko,
        })
      : "오프라인";

  return { online, label };
}

export function countOnline(presence: PresenceMap) {
  if (!presence) return 0;
  let n = 0;
  for (const p of presence.values()) if (p.online) n++;
  return n;
}
