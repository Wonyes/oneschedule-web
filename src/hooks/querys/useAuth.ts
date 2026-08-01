import { Post } from "./useMutations";
import { useAppMutation } from "@/src/types/ErrorResponse";
import { useLoginStore } from "../stores/useLoginStore";

export const useLogin = () => {
  const login = useLoginStore((state) => state.login);

  return useAppMutation({
    mutationFn: (body: { email: string; password: string }) =>
      Post({
        url: "/members/login",
        body,
      }),

    onSuccess: () => {
      login();
    },
  });
};

export const useLogout = () => {
  const logout = useLoginStore((state) => state.logout);

  return useAppMutation({
    mutationFn: () =>
      Post({
        url: "/members/logout",
      }),

    onSuccess: () => {
      logout();
    },
  });
};
