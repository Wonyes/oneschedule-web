import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Get, Patch, Post, Put } from "./useMutations";
import { memberskeys } from "./key/members";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { useRouter } from "next/navigation";

export type MyInfoResponse = {
  email: string;
  groupCode: string;
  name: string;
  nickname: string;
  phoneNumber: string;
};

type MyInfoChangeRequest = {
  nickname?: string;
  phoneNumber?: string;
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

export const useMyInfo = () => {
  return useQuery({
    queryKey: [memberskeys.myInfo],

    queryFn: () =>
      Get<MyInfoResponse>({
        url: "/members/info",
      }),

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
      queryClient.removeQueries({
        queryKey: [memberskeys.myInfo],
      });

      router.refresh();
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
  });
};

export const usePasswordChange = ({ body }: { body: MyInfoChangeRequest }) => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: () =>
      Put({
        url: "/members/password",
        body,
      }),

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [memberskeys.myInfo],
      });
    },
  });
};
