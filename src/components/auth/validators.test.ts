import { validatePassword } from "./validators";

describe("validatePassword", () => {
  const fail = jest.fn<false, ["password" | "passwordConfirm", string]>(
    () => false,
  );

  beforeEach(() => fail.mockClear());

  test("8자 미만이면 password 필드로 실패", () => {
    expect(validatePassword("1234567", "1234567", fail)).toBe(false);
    expect(fail).toHaveBeenCalledWith(
      "password",
      expect.stringContaining("8자"),
    );
  });

  test("확인이 다르면 passwordConfirm 필드로 실패", () => {
    expect(validatePassword("12345678", "12345679", fail)).toBe(false);
    expect(fail).toHaveBeenCalledWith("passwordConfirm", expect.any(String));
  });

  test("통과하면 true, fail 호출 없음", () => {
    expect(validatePassword("12345678", "12345678", fail)).toBe(true);
    expect(fail).not.toHaveBeenCalled();
  });
});
