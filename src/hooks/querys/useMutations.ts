import api from "@/src/lib/api";

interface MutationProps {
  url: string;
  body?: object;
  params?: object;
  headers?: object;
}
export const Post = async <T>({
  url,
  body,
  params,
  headers,
}: MutationProps): Promise<T> => {
  const response = await api.post(url, body, { params, headers });
  return (response.data.result ?? response.data) as T;
};

export const Delete = async <T>({ url, params }: MutationProps): Promise<T> => {
  const response = await api.delete(url, { params });
  return (response.data.result ?? response.data) as T;
};

export const Patch = async <T>({ url, body }: MutationProps): Promise<T> => {
  const response = await api.patch(url, body);
  return (response.data.result ?? response.data) as T;
};

export const Put = async <T>({ url, body }: MutationProps): Promise<T> => {
  const response = await api.put(url, body);
  return (response.data.result ?? response.data) as T;
};
