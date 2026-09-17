export const PASSWORD_MIN_LENGTH = 8;

/** 비밀번호 길이·확인 일치. 실패하면 fail()의 반환값(false)을 그대로 돌려준다 */
export function validatePassword<F extends "password" | "passwordConfirm">(
  password: string,
  confirm: string,
  fail: (field: F, message: string) => false,
) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return fail("password" as F, `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 해요.`);
  }
  if (password !== confirm) {
    return fail("passwordConfirm" as F, "비밀번호가 일치하지 않아요.");
  }
  return true;
}
