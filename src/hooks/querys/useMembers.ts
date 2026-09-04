import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Get, Patch, Post, Put } from "./useMutations";
import { memberskeys } from "./key/members";
import { groupkeys } from "./key/groupKey";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { useRouter } from "next/navigation";

export type MyInfoResponse = {
  /** 내 memberNo. 백엔드 추가 예정이며, 없으면 권한 판정을 건너뛴다. */
  memberNo?: number;
  email: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  profileImageUrl?: string;
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

      // 헤더의 닉네임은 (main) 레이아웃이 서버에서 한 번 조회해 내려준 값이라
      // react-query 캐시 갱신만으로는 반영되지 않는다. 로그인/로그아웃과 같은
      // 이유로 라우트 캐시를 강제로 갱신한다.
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

      // 헤더 아바타도 서버 컴포넌트가 내려준 값이라 위와 같은 이유로 강제 갱신한다.
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
