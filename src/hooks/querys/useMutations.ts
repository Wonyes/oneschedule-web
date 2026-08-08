import api from "@/src/lib/api";
import axios, { AxiosResponse } from "axios";

interface ApiProps {
  url: string;
  body?: object;
  params?: object;
  headers?: object;
  responseFull?: boolean;
}

interface ApiErrorResponse {
  message: string;
  code: number;
  success: boolean;
  result: null;
}

export const Get = async <T = unknown>({
  url,
  params,
}: ApiProps): Promise<T> => {
  try {
    const response = await api.get(url, { params });

    return (response.data.result ?? response.data) as T;
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      throw new Error(
        error.response?.data.message ?? "요청 처리 중 오류가 발생했습니다.",
      );
    }

    throw error;
  }
};

export const Post = async <T>({
  url,
  body,
  params,
  headers,
  responseFull = false,
}: ApiProps): Promise<T | AxiosResponse<T>> => {
  const response = await api.post(url, body, { params, headers });

  return (responseFull ? response : (response.data.result ?? response.data)) as
    | T
    | AxiosResponse<T>;
};

export const Delete = async <T>({ url, params }: ApiProps): Promise<T> => {
  const response = await api.delete(url, { params });
  return (response.data.result ?? response.data) as T;
};

export const Patch = async <T>({ url, body, params }: ApiProps): Promise<T> => {
  const response = await api.patch(url, body, { params });
  return (response.data.result ?? response.data) as T;
};

export const Put = async <T>({ url, body }: ApiProps): Promise<T> => {
  const response = await api.put(url, body);
  return (response.data.result ?? response.data) as T;
};
