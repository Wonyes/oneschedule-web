"use client";

import axios from "axios";

export const holidayApi = axios.create({
  baseURL: `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    ServiceKey: process.env.NEXT_PUBLIC_API_KEY,
    dataType: "json",
  },
  responseType: "json",
});

export const weatherApi = axios.create({
  baseURL: `	https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    ServiceKey: process.env.NEXT_PUBLIC_API_KEY,
    dataType: "json",
  },
  responseType: "json",
});

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_IP}/v1/api/`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
});

api.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") return config;

    const accessToken = localStorage.getItem("access-token");
    const refreshToken = localStorage.getItem("refresh-token");

    if (accessToken) {
      config.headers.req = refreshToken;
      config.headers.Authorization = accessToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    const accessToken = response.headers["authorization"];
    if (accessToken && typeof window !== "undefined") {
      localStorage.setItem("access-token", accessToken);
    }
    return response;
  },
  async (error) => {
    if (error.response) {
      const errorStatusCode = error.response.status;

      switch (errorStatusCode) {
        case 401: {
          const authRefreshToken = localStorage.getItem("refresh-token");
          const authAccessToken = localStorage.getItem("access-token");

          if (authRefreshToken) {
            try {
              const refreshResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_IP}/v1/api/auth/refresh`,
                {},
                {
                  headers: {
                    authorization: `${authAccessToken}`,
                    refresh: `${authRefreshToken}`,
                  },
                },
              );

              const { authorization } = refreshResponse.headers;
              localStorage.setItem("access-token", authorization);

              return api(error.config);
            } catch (err) {
              localStorage.removeItem("access-token");
              localStorage.removeItem("refresh-token");
              window.location.href = "/";
              return Promise.reject(err);
            }
          }
          break;
        }

        case 403: {
          alert("권한이 없습니다. 홈화면으로 돌아갑니다.");
          window.location.href = "/";
          return Promise.reject(error);
        }

        default:
          return Promise.reject(error.response);
      }
    } else {
      console.error(
        "네트워크 에러:",
        error.message || "요청을 처리할 수 없습니다.",
      );
    }

    return Promise.reject(error);
  },
);

export default api;
