import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Get, Patch, Post, Put } from "./useMutations";
import { memberskeys } from "./key/members";
import { groupkeys } from "./key/groupKey";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { useRouter } from "next/navigation";

export type MyInfoResponse = {
  /** 내 memberNo. 구버전 서버 응답에는 없을 수 있어 옵셔널로 둔다. */
  memberNo?: number;
  email: string;
  name: string;
  nickname: string;
  /** 소셜 가입자는 가입 시점에 번호가 없어 null로 내려온다. */
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
      // (main) 레이아웃이 쿠키를 읽는 서버 컴포넌트라 push만으로는 헤더가
      // 로그아웃 상태를 즉시 반영하지 못해서, 라우트 캐시를 강제로 갱신한다.
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

      // 그룹 멤버 목록(GroupMemberSection, GroupQuickLink, 참여자 선택 등)에도
      // 내 프로필 사진이 들어있으니 같이 갱신한다.
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
