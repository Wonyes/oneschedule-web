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

export interface CustomError extends ErrorResponse {
  data?: ErrorResponse;
}

export function useAppMutation<
  TData = unknown,
  TVariables = void,
  TError = CustomError,
>(options: UseMutationOptions<TData, TError, TVariables>) {
  return useMutation(options);
}
