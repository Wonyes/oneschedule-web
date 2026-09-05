import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
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

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (!error.response) {
      console.error("네트워크 오류:", error.message ?? "알 수 없는 오류");
      return Promise.reject(error);
    }

    console.error(error.response);

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

    switch (status) {
      // 401만 재발급 흐름을 탄다.
      // 서버는 인증 실패(만료/위조/미로그인)를 전부 401로 내려주고,
      // 403은 "그룹 관리 권한 없음", "일정 접근 권한 없음" 같은 진짜 권한 거부다.
      // 403까지 재발급을 태우면 권한 오류 메시지가 재시도에 묻혀 사라진다.
      case 401: {
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
          return Promise.reject(refreshError);
        }
      }

      default: {
        return Promise.reject(error);
      }
    }
  },
);

export default api;
