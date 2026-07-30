import { create } from "zustand";

interface LoginState {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  accessToken?: string;
}

const loginCheck = () => {
  if (typeof window === "undefined") {
    return false;
  }
  const accessToken = localStorage.getItem("access-token");
  const refreshToken = localStorage.getItem("refresh-token");
  return !!(accessToken && refreshToken);
};

const getAccessToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("access-token");
};

const initialState: LoginState = {
  isLogin: loginCheck(),
  setIsLogin: () => {},
  accessToken: getAccessToken(),
};

export const useLoginStore = create<LoginState>((set) => ({
  ...initialState,
  setIsLogin: (isLogin) => set({ isLogin }),

  accessToken: getAccessToken(),
}));
