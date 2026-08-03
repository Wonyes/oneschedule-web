import { Post } from "./useMutations";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { useQueryClient } from "@tanstack/react-query";

import { Get } from "./useMutations";
import { MyInfoResponse } from "./useMembers";
import { memberskeys } from "./key/members";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useAppMutation({
    mutationFn: (body: { email: string; password: string }) =>
      Post({
        url: "/members/login",
        body,
      }),

    onSuccess: async () => {
      const user = await Get<MyInfoResponse>({
        url: "/members/info",
      });

      queryClient.setQueryData([memberskeys.myInfo], user);
    },
  });
};
