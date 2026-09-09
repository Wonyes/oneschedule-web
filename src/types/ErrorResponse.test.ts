/**
 * 서버 에러 응답에서 사용자에게 보여줄 문구를 고르는 규칙 테스트.
 *
 * 서버(SuccessResponse/ErrorResponse)는 {success, code, message, result} 봉투로
 * 내려주고, 검증 실패일 때만 result가 필드별 사유 배열이 된다.
 */
import { AxiosError } from "axios";
import { getErrorMessage, CustomError, ErrorResponse } from "./ErrorResponse";

const axiosError = (
  data?: Partial<ErrorResponse>,
  status = 400,
  message = "Request failed with status code 400",
): CustomError => {
  const err = new AxiosError<ErrorResponse>(message);

  if (data) {
    err.response = {
      data: data as ErrorResponse,
      status,
      statusText: "",
      headers: {},
      config: { headers: {} },
    } as never;
  }

  return err;
};

describe("getErrorMessage", () => {
  test("일반 에러는 서버 message를 그대로 쓴다", () => {
    const err = axiosError({
      success: false,
      code: -212,
      message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      result: null,
    });

    expect(getErrorMessage(err)).toBe(
      "이메일 또는 비밀번호가 올바르지 않습니다.",
    );
  });

  test("그룹 중복 가입(409)의 문구를 그대로 노출한다", () => {
    const err = axiosError(
      {
        success: false,
        code: -401,
        message: "이미 가입한 그룹입니다.",
        result: null,
      },
      409,
    );

    expect(getErrorMessage(err, "그룹 가입에 실패했습니다.")).toBe(
      "이미 가입한 그룹입니다.",
    );
  });

  // 검증 실패는 message에 "파라미터 검증 에러입니다." 총평만 담기고
  // 진짜 사유는 result 배열의 reason에 들어온다.
  test("검증 실패는 총평 대신 필드별 사유를 보여준다", () => {
    const err = axiosError(
      {
        success: false,
        code: -104,
        message: "파라미터 검증 에러입니다.",
        result: [
          {
            key: "password",
            value: "123",
            reason: "비밀번호는 8~20자여야 합니다.",
          },
          {
            key: "nickname",
            value: "가",
            reason: "닉네임은 2~10자여야 합니다.",
          },
        ],
      },
      422,
    );

    expect(getErrorMessage(err)).toBe(
      "비밀번호는 8~20자여야 합니다.\n닉네임은 2~10자여야 합니다.",
    );
  });

  test("reason이 비어 있는 배열이면 message로 되돌아간다", () => {
    const err = axiosError(
      {
        success: false,
        code: -104,
        message: "파라미터 검증 에러입니다.",
        result: [{ key: "password" }],
      },
      422,
    );

    expect(getErrorMessage(err)).toBe("파라미터 검증 에러입니다.");
  });

  // axios의 "Request failed with status code 500"은 영어라 화면에 띄우지 않는다.
  test("응답이 없는 네트워크 오류는 fallback을 쓴다", () => {
    const err = axiosError(undefined, 0, "Network Error");

    expect(getErrorMessage(err)).toBe("요청 처리 중 오류가 발생했습니다.");
    expect(getErrorMessage(err, "그룹 가입에 실패했습니다.")).toBe(
      "그룹 가입에 실패했습니다.",
    );
  });

  test("서버가 message 없이 응답해도 axios 내부 문구가 새지 않는다", () => {
    const err = axiosError({ success: false, code: -100, result: null }, 500);

    expect(getErrorMessage(err)).toBe("요청 처리 중 오류가 발생했습니다.");
  });
});
