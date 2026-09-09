import { MyGroupResponse, PageResponse } from "@/src/types/group";

export const ACTIVE_GROUP_COOKIE = "active-group";

export function toMyGroups(
  page: PageResponse<MyGroupResponse> | null,
): MyGroupResponse[] {
  return (page?.content ?? []).map((group) => ({
    ...group,
    members: group.members ?? [],
  }));
}

/**
 * 활성 그룹은 쿠키에 담는다.
 * 홈처럼 서버가 그룹 정보를 미리 그리는 화면이 있어서, 서버와 클라이언트가
 * 같은 값을 읽어야 하이드레이션 결과가 어긋나지 않는다.
 */
export function parseActiveGroupNo(raw?: string | null): number | null {
  if (!raw) return null;

  const parsed = Number(raw);
  return Number.isInteger(parsed) ? parsed : null;
}

/** 브라우저에서 현재 활성 그룹 번호를 읽는다. */
export function readActiveGroupNo(): number | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ACTIVE_GROUP_COOKIE}=([^;]*)`),
  );

  return parseActiveGroupNo(match?.[1]);
}

export function writeActiveGroupNo(groupNo: number) {
  document.cookie = `${ACTIVE_GROUP_COOKIE}=${groupNo}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * 저장된 번호가 더 이상 가입하지 않은 그룹을 가리킬 수 있으므로(탈퇴·해체),
 * 항상 목록과 대조해서 고른다. 없으면 첫 번째 그룹.
 */
export function resolveActiveGroup(
  groups: MyGroupResponse[],
  activeGroupNo: number | null,
): MyGroupResponse | undefined {
  if (groups.length === 0) return undefined;

  return groups.find((group) => group.groupNo === activeGroupNo) ?? groups[0];
}
