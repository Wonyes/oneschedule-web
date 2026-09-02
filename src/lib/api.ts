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
      (status === 401 || status === 403) &&
      (originalRequest.url?.includes("/members/login") ||
        originalRequest.url?.includes("/token-refresh") ||
        originalRequest._skipAuthRefresh)
    ) {
      return Promise.reject(error);
    }

    switch (status) {
      // 액세스 토큰 만료(401) / 재발급 필요(403) 둘 다 같은 리프레시 흐름을 탄다
      case 401:
      case 403: {
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
