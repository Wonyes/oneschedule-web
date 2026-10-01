import { useQuery } from "@tanstack/react-query";

import { PAGE_SIZE } from "@/src/lib/paging";
import { resolveActiveGroup, toMyGroups } from "@/src/lib/activeGroup";
import {
  JoinRequest,
  MemberPresence,
  MyGroupResponse,
  PageResponse,
  PublicGroup,
} from "@/src/types/group";
import { useActiveGroupStore } from "../stores/useActiveGroupStore";
import { groupkeys } from "./key/groupKey";
import { Get } from "./useMutations";
import { usePagedQuery } from "./usePagedQuery";

/** 그룹 조회 훅. 변경은 useGroupMutations */

export const useMyGroups = (
  enabled = true,
  initialData?: MyGroupResponse[],
) => {
  return useQuery({
    queryKey: [groupkeys.myGroup],

    queryFn: async () =>
      toMyGroups(
        await Get<PageResponse<MyGroupResponse>>({
          url: "/group/my/groups",
          params: { size: PAGE_SIZE.myGroups },
        }),
      ),

    enabled,
    retry: false,
    staleTime: Infinity,
    initialData,
  });
};

export const useActiveGroup = (
  enabled = true,
  initialGroups?: MyGroupResponse[],
) => {
  const { data: groups, ...rest } = useMyGroups(enabled, initialGroups);
  const activeGroupNo = useActiveGroupStore((s) => s.activeGroupNo);

  const list = groups ?? [];
  const saved = list.find((g) => g.groupNo === activeGroupNo);

  const needsSelection = !saved && list.length > 1;

  return {
    ...rest,
    groups: list,
    needsSelection,
    group: needsSelection ? undefined : resolveActiveGroup(list, activeGroupNo),
  };
};

export const usePublicGroups = (
  keyword?: string,
  size = PAGE_SIZE.publicGroups,
) => {
  const trimmed = keyword?.trim() ?? "";

  return usePagedQuery<PublicGroup>({
    queryKey: [groupkeys.publicGroups, trimmed],
    url: "/group/public",
    size,
    params: trimmed ? { keyword: trimmed } : undefined,
  });
};

export const useMemberPresence = (groupNo?: number) => {
  return useQuery({
    queryKey: [groupkeys.presence, groupNo],

    queryFn: () => Get<MemberPresence[]>({ url: `/group/${groupNo}/online` }),

    enabled: !!groupNo,
    refetchInterval: 30_000,
    retry: false,

    select: (list) => new Map(list.map((it) => [it.memberNo, it])),
  });
};

export const useJoinRequests = (
  groupNo: number,
  enabled = true,
  size = PAGE_SIZE.joinRequests,
) => {
  return usePagedQuery<JoinRequest>({
    queryKey: [groupkeys.joinRequests, groupNo],
    url: `/group/${groupNo}/join-requests`,
    size,
    enabled,
  });
};
