import { AxiosError } from "axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export interface ErrorResult {
  errorClass?: string;
  errorLocation?: string;
  errorMessage?: string;
  [key: string]: unknown;
}

export interface ErrorResponse<T = ErrorResult | null> {
  success: boolean;
  code: number;
  message: string;
  result: T;
}

export type CustomError<T = ErrorResponse> = AxiosError<T>;

export function getErrorMessage(
  err: CustomError,
  fallback = "요청 처리 중 오류가 발생했습니다.",
) {
  return (
    err.response?.data?.message ??
    err.response?.data?.result?.errorMessage ??
    fallback
  );
}

export function useAppMutation<
  TData = unknown,
  TVariables = void,
  TError = CustomError,
>(options: UseMutationOptions<TData, TError, TVariables>) {
  return useMutation(options);
}
