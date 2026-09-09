import { AxiosError } from "axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export interface ErrorResult {
  errorClass?: string;
  errorLocation?: string;
  errorMessage?: string;
  [key: string]: unknown;
}

export interface ValidationErrorItem {
  key?: string;
  value?: string | null;
  reason?: string;
}

export interface ErrorResponse<T = ErrorResult | ValidationErrorItem[] | null> {
  success: boolean;
  code: number;
  message: string;
  result: T;
}

export type CustomError<T = ErrorResponse> = AxiosError<T>;

export function getErrorMessage(
  err: CustomError,
  fallback = "요청 처리 중 오류가 발생했습니다.",
): string {
  const data = err.response?.data;
  const result = data?.result;

  if (Array.isArray(result)) {
    const reasons = result
      .map((item) => item?.reason)
      .filter((reason): reason is string => !!reason);

    if (reasons.length > 0) return reasons.join("\n");
  }

  return data?.message ?? fallback;
}

export function useAppMutation<
  TData = unknown,
  TVariables = void,
  TError = CustomError,
>(options: UseMutationOptions<TData, TError, TVariables>) {
  return useMutation(options);
}
