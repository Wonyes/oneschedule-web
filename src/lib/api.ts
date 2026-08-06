import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _skipAuthRefresh?: boolean; // ⬅️ 추가
}

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_IP}/v1/api`,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<void> | null = null;

const publicPaths = [
  "/holidays",
  "/weather",
  "/members/email-check",
  "/members/nickname-check",
  "/members/login",
];

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isPublic = publicPaths.some((path) => config.url?.startsWith(path));
    if (isPublic) {
      return config;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (!error.response) {
      console.error("네트워크 오류:", error.message ?? "알 수 없는 오류");
      return Promise.reject(error);
    }
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const status = error.response.status;

    if (
      status === 401 &&
      (originalRequest.url?.includes("/members/login") ||
        originalRequest.url?.includes("/token-refresh") ||
        originalRequest._skipAuthRefresh)
    ) {
      return Promise.reject(error);
    }

    switch (error.response.status) {
      case 401: {
        // ⬅️ 로그인 등 리프레시를 스킵해야 하는 요청이면 바로 거부
        if (originalRequest._skipAuthRefresh) {
          return Promise.reject(error);
        }

        if (originalRequest.url?.includes("/token-refresh")) {
          return Promise.reject(error);
        }

        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        const shouldRefreshHeader = !refreshPromise;

        try {
          if (!refreshPromise) {
            refreshPromise = api
              .post("/token-refresh")
              .then(() => undefined)
              .finally(() => {
                refreshPromise = null;
              });
          }

          await refreshPromise;

          if (shouldRefreshHeader && typeof window !== "undefined") {
            window.dispatchEvent(new Event("auth:refreshed"));
          }

          return api(originalRequest);
        } catch (refreshError) {
          window.location.replace("/login");
          return Promise.reject(refreshError);
        }
      }

      case 403: {
        alert("권한이 없습니다.");
        window.location.href = "/";
        return Promise.reject(error);
      }

      default: {
        console.log(error.response, "#@#!");
        return Promise.reject(error);
      }
    }
  },
);

export default api;
