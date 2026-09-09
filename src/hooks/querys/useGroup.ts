import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Get, Patch, Post } from "./useMutations";
import { groupkeys } from "./key/groupKey";

const SETTING_URL = (groupNo: number) => `/group/${groupNo}/setting`;
import {
  GroupVisibility,
  JoinRequest,
  JoinRequestStatus,
  MemberPresence,
  MyGroupResponse,
  PageResponse,
  PublicGroup,
} from "@/src/types/group";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { memberskeys } from "./key/members";
import { resolveActiveGroup, toMyGroups } from "@/src/lib/activeGroup";
import { useActiveGroupStore } from "../stores/useActiveGroupStore";
import { PAGE_SIZE } from "@/src/lib/paging";
import { usePagedQuery } from "./usePagedQuery";

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

export const useJoinPublicGroup = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (groupNo: number) =>
      Post({
        url: `/group/${groupNo}/join`,
        body: null,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [groupkeys.myGroup] });
      queryClient.invalidateQueries({ queryKey: [groupkeys.publicGroups] });
      queryClient.invalidateQueries({ queryKey: [memberskeys.myInfo] });
    },
  });
};

export const useRequestJoinGroup = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: ({ groupNo, message }: { groupNo: number; message?: string }) =>
      Post({
        url: `/group/${groupNo}/join-request`,
        body: null,
        params: message?.trim() ? { message: message.trim() } : undefined,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [groupkeys.publicGroups] });
    },
  });
};

export const useUpdateGroupSetting = (groupNo: number) => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (params: {
      visibility?: GroupVisibility;
      description?: string;
    }) =>
      Patch({
        url: SETTING_URL(groupNo),
        body: null,
        params,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [groupkeys.myGroup] });
      queryClient.invalidateQueries({ queryKey: [groupkeys.publicGroups] });
    },
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

export const useProcessJoinRequest = (groupNo: number) => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: ({
      requestNo,
      status,
    }: {
      requestNo: number;
      status: JoinRequestStatus;
    }) =>
      Patch({
        url: `/group/${groupNo}/join-request/${requestNo}`,
        body: null,
        params: { status },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [groupkeys.joinRequests] });
      queryClient.invalidateQueries({ queryKey: [groupkeys.myGroup] });
    },
  });
};
