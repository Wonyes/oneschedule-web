import { AxiosError } from "axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export interface ErrorResult {
  errorClass?: string;
  errorLocation?: string;
  errorMessage?: string;
  [key: string]: unknown;
}

/** 검증 실패(422) 응답의 result 원소. 필드별 실패 사유가 여기 담긴다. */
export interface ValidationErrorItem {
  key?: string;
  value?: string | null;
  reason?: string;
}

export interface ErrorResponse<
  T = ErrorResult | ValidationErrorItem[] | null,
> {
  success: boolean;
  code: number;
  message: string;
  result: T;
}

export type CustomError<T = ErrorResponse> = AxiosError<T>;

/**
 * 사용자에게 보여줄 메시지를 고른다.
 *
 * 검증 실패는 서버가 message에 "파라미터 검증 에러입니다." 같은 총평만 담고
 * 실제 사유("비밀번호는 8~20자여야 합니다.")는 result 배열의 reason에 넣는다.
 * 그래서 배열이면 reason을 먼저 본다.
 *
 * axios의 err.message("Request failed with status code 500")는 화면에 띄우지
 * 않는다. 사용자에게 의미가 없고 영어라서 fallback이 더 낫다.
 */
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
