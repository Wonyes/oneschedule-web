/** 백엔드 VerificationPurpose enum과 이름이 같아야 한다. */
export const verificationTypes = {
  SIGNUP: "SIGNUP",
  PASSWORD_RESET: "PASSWORD_RESET",
} as const;

export type VerificationPurpose =
  (typeof verificationTypes)[keyof typeof verificationTypes];

/** 코드 유효 시간(초). 백엔드 CODE_TTL(3분)과 맞춘다. */
export const VERIFICATION_CODE_TTL = 180;
/** 재전송 대기(초). 백엔드 RESEND_INTERVAL(60초)과 맞춘다. */
export const VERIFICATION_RESEND_WAIT = 60;
