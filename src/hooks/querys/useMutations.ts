import api from "@/src/lib/api";
import { AxiosResponse } from "axios";

interface ApiProps {
  url: string;
  body?: object | null;
  params?: object;
  headers?: object;
  responseFull?: boolean;
}

export const Get = async <T = unknown>({
  url,
  params,
}: ApiProps): Promise<T> => {
  const response = await api.get(url, { params });

  return (response.data.result ?? response.data) as T;
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
    T | AxiosResponse<T>;
};

export const Delete = async <T>({ url, params }: ApiProps): Promise<T> => {
  const response = await api.delete(url, { params });
  return (response.data.result ?? response.data) as T;
};

export const Patch = async <T>({ url, body, params }: ApiProps): Promise<T> => {
  const response = await api.patch(url, body, { params });
  return (response.data.result ?? response.data) as T;
};

export const Put = async <T>({ url, body, params }: ApiProps): Promise<T> => {
  const response = await api.put(url, body, { params });
  return (response.data.result ?? response.data) as T;
};
