import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  GroupVisibility,
  JoinRequestStatus,
  MyGroupResponse,
} from "@/src/types/group";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { groupkeys } from "./key/groupKey";
import { memberskeys } from "./key/members";
import { Patch, Post } from "./useMutations";

/** 그룹 변경 훅. 조회는 useGroupQueries */

const SETTING_URL = (groupNo: number) => `/group/${groupNo}/setting`;

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

export const useGroupProfileImageUpload = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useAppMutation({
    mutationFn: async ({ file, groupNo }: { file: File; groupNo: number }) => {
      const formData = new FormData();
      formData.append("file", file);

      return (await Post<{ profileImageUrl: string }>({
        url: `/group/${groupNo}/profile-image`,
        body: formData,
        headers: { "Content-Type": undefined },
      })) as { profileImageUrl: string };
    },

    onSuccess: (data, variables) => {
      queryClient.setQueriesData<MyGroupResponse[]>(
        { queryKey: [groupkeys.myGroup] },
        (prev) =>
          prev?.map((g) =>
            g.groupNo === variables.groupNo
              ? { ...g, profileImageUrl: data.profileImageUrl }
              : g,
          ),
      );
      queryClient.invalidateQueries({
        queryKey: [groupkeys.myGroup],
      });
      queryClient.invalidateQueries({
        queryKey: [groupkeys.publicGroups],
      });

      router.refresh();
    },
    retry: false,
  });
};
