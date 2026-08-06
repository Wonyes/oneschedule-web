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

export function useAppMutation<
  TData = unknown,
  TVariables = void,
  TError = CustomError,
>(options: UseMutationOptions<TData, TError, TVariables>) {
  return useMutation(options);
}
