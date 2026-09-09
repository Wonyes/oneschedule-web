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

export function parseActiveGroupNo(raw?: string | null): number | null {
  if (!raw) return null;

  const parsed = Number(raw);
  return Number.isInteger(parsed) ? parsed : null;
}

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

export function resolveActiveGroup(
  groups: MyGroupResponse[],
  activeGroupNo: number | null,
): MyGroupResponse | undefined {
  if (groups.length === 0) return undefined;

  return groups.find((group) => group.groupNo === activeGroupNo) ?? groups[0];
}
