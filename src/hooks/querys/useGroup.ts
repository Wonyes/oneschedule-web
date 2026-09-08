import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Get, Patch, Post } from "./useMutations";
import { groupkeys } from "./key/groupKey";

const SETTING_URL = (groupNo: number) => `/group/${groupNo}/setting`;
import {
  GroupVisibility,
  JoinRequest,
  JoinRequestStatus,
  MyGroupResponse,
  PageResponse,
  PublicGroup,
} from "@/src/types/group";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { memberskeys } from "./key/members";
import { resolveActiveGroup } from "@/src/lib/activeGroup";
import { useActiveGroupStore } from "../stores/useActiveGroupStore";

export const useMyGroups = (
  enabled = true,
  initialData?: MyGroupResponse[],
) => {
  return useQuery({
    queryKey: [groupkeys.myGroup],

    queryFn: async () => {
      const data = await Get<MyGroupResponse | MyGroupResponse[] | null>({
        url: "/group/my/groups",
      });

      if (!data) return [];

      const list = Array.isArray(data) ? data : [data];
      return list.map((group) => ({ ...group, members: group.members ?? [] }));
    },

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

/**
 * 공개 그룹 목록.
 *
 * 서버가 20개씩 끊어주므로 무한 스크롤로 이어 붙인다.
 * last가 true면 다음 페이지가 없다.
 */
export const usePublicGroups = (keyword?: string) => {
  const trimmed = keyword?.trim() ?? "";

  return useInfiniteQuery({
    queryKey: [groupkeys.publicGroups, trimmed],

    queryFn: ({ pageParam }) =>
      Get<PageResponse<PublicGroup>>({
        url: "/group/public",
        params: {
          page: pageParam,
          ...(trimmed ? { keyword: trimmed } : {}),
        },
      }),

    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,

    retry: false,
  });
};

/** 공개 · 즉시 가입 그룹에 바로 참여 */
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

/** 공개 · 승인제 그룹에 가입 신청 */
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

/** 그룹 설정 변경 (그룹장 전용). 보낸 값만 바뀐다. */
export const useUpdateGroupSetting = (groupNo: number) => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (params: { visibility?: GroupVisibility; description?: string }) =>
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

/** 가입 신청 대기 목록 (SUPER·SUB만) */
export const useJoinRequests = (groupNo: number, enabled = true) => {
  return useInfiniteQuery({
    queryKey: [groupkeys.joinRequests, groupNo],

    queryFn: ({ pageParam }) =>
      Get<PageResponse<JoinRequest>>({
        url: `/group/${groupNo}/join-requests`,
        params: { page: pageParam },
      }),

    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,

    enabled,
    retry: false,
  });
};

/** 가입 신청 승인 / 거절 */
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
      // 승인하면 멤버가 늘어난다
      queryClient.invalidateQueries({ queryKey: [groupkeys.myGroup] });
    },
  });
};
