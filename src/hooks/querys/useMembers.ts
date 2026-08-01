import { useQuery } from "@tanstack/react-query";
import { Get, Post } from "./useMutations";
import { memberskeys } from "./key/members";
import { useLoginStore } from "../stores/useLoginStore";
import { useAppMutation } from "@/src/types/ErrorResponse";

type MyInfoResponse = {
  email: string;
  groupCode: string;
  name: string;
  nickname: string;
  phoneNumber: string;
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
  });
};

export const useMyInfo = (enabled: boolean) => {
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
  return useAppMutation({
    mutationFn: () =>
      Post({
        url: "/members/logout",
      }),

    onSuccess: () => {
      useLoginStore.getState().logout();
    },
  });
};
