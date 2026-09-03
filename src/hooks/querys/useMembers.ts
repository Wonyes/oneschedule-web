import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Get, Patch, Post, Put } from "./useMutations";
import { memberskeys } from "./key/members";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { useRouter } from "next/navigation";

export type MyInfoResponse = {
  /** 내 memberNo. 백엔드 추가 예정이며, 없으면 권한 판정을 건너뛴다. */
  memberNo?: number;
  email: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  imageUrl?: string;
};

type MyInfoChangeRequest = {
  nickname?: string;
  phoneNumber?: string;
};

type PasswordChangeRequest = {
  currentPassword: string;
  newPassword: string;
};

export const useEmailCheck = (email: string) => {
  return useQuery({
    queryKey: [memberskeys.emailCheck, email],
    queryFn: () =>
      Get<boolean>({
        url: "/members/email-check",
        params: {
          email: email,
        },
      }),
    retry: false,
    enabled: false,
  });
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
  return useAppMutation({
    mutationFn: () =>
      Post({
        url: "/members/logout",
      }),

    onSuccess: () => {
      queryClient.clear();
      router.push("/");
    },
  });
};

export const useMyinfoChange = () => {
  const queryClient = useQueryClient();

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
    },
    retry: false,
  });
};

export const useProfileImageUpload = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      return (await Post<{ imageUrl: string }>({
        url: "/members/profile-image",
        body: formData,
      })) as { imageUrl: string };
    },

    onSuccess: (data) => {
      queryClient.setQueriesData<MyInfoResponse>(
        { queryKey: [memberskeys.myInfo] },
        (prev) => (prev ? { ...prev, imageUrl: data.imageUrl } : prev),
      );
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
