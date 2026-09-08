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

/**
 * 공개 그룹 목록.
 *
 * last가 true면 다음 페이지가 없다.
 */

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

/**
 * 그룹원 접속 상태.
 *
 * 멤버 목록과 따로 받는다. 로스터는 가입·탈퇴할 때만 바뀌어 staleTime이 Infinity인데,
 * 접속 상태는 수십 초마다 바뀐다. 합쳐두면 이것 때문에 그룹 전체를 다시 받게 된다.
 *
 * 접속 여부는 서버가 열려 있는 SSE 연결로 판단하고, lastSeenAt은 오프라인일 때만 온다.
 */
export const useMemberPresence = (groupNo?: number) => {
  return useQuery({
    queryKey: [groupkeys.presence, groupNo],

    queryFn: () => Get<MemberPresence[]>({ url: `/group/${groupNo}/online` }),

    enabled: !!groupNo,
    refetchInterval: 30_000,
    retry: false,

    // 렌더마다 배열을 훑지 않도록 memberNo로 색인해 캐시에 둔다
    select: (list) => new Map(list.map((it) => [it.memberNo, it])),
  });
};

/** 가입 신청 대기 목록 (SUPER·SUB만) */
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
