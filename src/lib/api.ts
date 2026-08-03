import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_IP}/v1/api`,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 여러 401 요청이 발생해도 토큰 갱신 요청은 하나만 유지
let refreshPromise: Promise<void> | null = null;

/**
 * 인증 없이 접근 가능한 API
 */
const publicPaths = [
  "/holidays",
  "/weather",
  "/members/email-check",
  "/members/nickname-check",
];

/**
 * 요청 인터셉터
 */
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

/**
 * 응답 인터셉터
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (!error.response) {
      console.error("네트워크 오류:", error.message ?? "알 수 없는 오류");
      return Promise.reject(error);
    }

    const originalRequest = error.config as CustomAxiosRequestConfig;

    switch (error.response.status) {
      /**
       * Access Token 만료
       */
      case 401: {
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

          // refresh를 실제로 시작한 요청에서만 한 번 발생
          if (shouldRefreshHeader && typeof window !== "undefined") {
            window.dispatchEvent(new Event("auth:refreshed"));
          }

          return api(originalRequest);
        } catch (refreshError) {
          window.location.replace("/login");
          return Promise.reject(refreshError);
        }
      }
      /**
       * 권한 없음
       */
      case 403: {
        alert("권한이 없습니다.");
        window.location.href = "/";

        return Promise.reject(error);
      }

      /**
       * 기타 오류
       */
      default: {
        return Promise.reject(error.response.data);
      }
    }
  },
);

export default api;
