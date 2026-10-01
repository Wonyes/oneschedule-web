import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Delete, Get, Patch, Post, Put } from "./useMutations";
import { memberskeys } from "./key/members";
import { groupkeys } from "./key/groupKey";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { useRouter } from "next/navigation";
import { useActiveGroupStore } from "../stores/useActiveGroupStore";

export type MyInfoResponse = {
  memberNo?: number;
  email: string;
  name: string;
  nickname: string;
  phoneNumber: string | null;
  provider: "LOCAL" | "GOOGLE";
  profileImageUrl?: string;
};

export type MyInfoChangeRequest = {
  name?: string;
  nickname?: string;
  phoneNumber?: string;
};

type PasswordChangeRequest = {
  currentPassword: string;
  newPassword: string;
};

export const useNicknameCheck = (nickname: string) => {
  return useQuery({
    queryKey: [memberskeys.nicknameCheck, nickname],
    queryFn: () =>
      Get<boolean>({
        url: "/members/nickname-check",
        params: {
          nickname: nickname,
        },
      }),
    enabled: false,
    retry: false,
  });
};

export const useMyInfo = (enabled = true) => {
  return useQuery({
    queryKey: [memberskeys.myInfo],

    queryFn: () =>
      Get<MyInfoResponse>({
        url: "/members/info",
      }),

    enabled,
    retry: false,
    staleTime: Infinity,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearActiveGroup = useActiveGroupStore((s) => s.clearActiveGroup);

  return useAppMutation({
    mutationFn: () =>
      Post({
        url: "/members/logout",
      }),

    onSuccess: () => {
      clearActiveGroup();
      queryClient.clear();
      router.push("/");
      router.refresh();
    },
  });
};

/** 회원 탈퇴. 성공하면 서버가 쿠키를 만료시키므로 캐시만 비우고 홈으로 보낸다 */
export const useWithdraw = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearActiveGroup = useActiveGroupStore((s) => s.clearActiveGroup);

  return useAppMutation({
    mutationFn: () => Delete({ url: "/members" }),

    onSuccess: () => {
      clearActiveGroup();
      queryClient.clear();
      router.push("/");
      router.refresh();
    },
  });
};

export const useMyinfoChange = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useAppMutation({
    mutationFn: (body: MyInfoChangeRequest) =>
      Patch({
        url: "/members/info",
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [memberskeys.myInfo],
      });

      router.refresh();
    },
    retry: false,
  });
};

export const useProfileImageUpload = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useAppMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return (await Post<{ profileImageUrl: string }>({
        url: "/members/profile-image",
        body: formData,
        headers: { "Content-Type": undefined },
      })) as { profileImageUrl: string };
    },

    onSuccess: (data) => {
      queryClient.setQueriesData<MyInfoResponse>(
        { queryKey: [memberskeys.myInfo] },
        (prev) =>
          prev ? { ...prev, profileImageUrl: data.profileImageUrl } : prev,
      );

      queryClient.invalidateQueries({
        queryKey: [groupkeys.myGroup],
      });

      router.refresh();
    },
    retry: false,
  });
};

export const usePasswordChange = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (body: PasswordChangeRequest) =>
      Put({
        url: "/members/password",
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [memberskeys.myInfo],
      });
    },
    retry: false,
  });
};
