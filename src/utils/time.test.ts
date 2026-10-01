import { formatTime } from "./time";

describe("formatTime", () => {
  test("빈 문자열은 빈 문자열을 반환한다", () => {
    expect(formatTime("")).toBe("");
  });

  test("숫자가 하나도 없으면 빈 문자열을 반환한다", () => {
    expect(formatTime("abc")).toBe("");
  });

  test("두 자리 이하일 때는 콜론 없이 시간만 반환한다", () => {
    expect(formatTime("1")).toBe("1");
    expect(formatTime("12")).toBe("12");
  });

  test("23시를 초과하면 23으로 고정한다", () => {
    expect(formatTime("25")).toBe("23");
  });

  test("네 자리 입력은 HH:mm 형태로 반환한다", () => {
    expect(formatTime("1234")).toBe("12:34");
  });

  test("59분을 초과하면 59로 고정한다", () => {
    expect(formatTime("2560")).toBe("23:59");
  });

  test("숫자가 아닌 문자는 무시하고, 5자리 이상은 4자리까지만 사용한다", () => {
    expect(formatTime("12:34:56")).toBe("12:34");
    expect(formatTime("123abc456")).toBe("12:34");
  });
});
