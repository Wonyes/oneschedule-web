import { useMutation, UseMutationOptions } from "@tanstack/react-query";

// 1. 에러 타입 미리 정의
export interface ErrorResponse {
  success: boolean;
  code: number;
  message: string;
  result: {
    errorClass: string;
    errorLocation: string;
    errorMessage: string;
  };
}

export interface CustomError {
  data: ErrorResponse;
}

// 2. 에러 타입이 고정된 커스텀 훅 생성
export function useAppMutation<TData = unknown, TVariables = void>(
  options: UseMutationOptions<TData, CustomError, TVariables>,
) {
  return useMutation(options);
}
