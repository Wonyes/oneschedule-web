import type { Metadata } from "next";

import LegalDoc, { LegalSection } from "@/src/components/legal/LegalDoc";

export const metadata: Metadata = {
  title: "개인정보처리방침 — OneSchedule",
};

/**
 * 실제로 수집·저장하는 항목만 적는다. 코드가 바뀌면 여기도 바꾼다:
 * - 가입: MemberSignupRequest (email · password · name · nickname · phoneNumber)
 * - Google: CustomOAuth2UserService (email · name · picture · providerId)
 * - 프로필 사진: NaverImageClient(네이버 클라우드 Object Storage) 업로드
 * - 위치: 브라우저 geolocation → 격자 좌표(nx, ny)만 날씨 조회에 사용, 서버 저장 없음
 * - 쿠키: access-token(30분) · refresh-token(7일) · theme
 */
const SECTIONS: LegalSection[] = [
  {
    title: "수집하는 개인정보와 목적",
    body: [
      "OneSchedule(이하 \"서비스\")은 다음 항목을 수집하며, 적힌 목적 외에는 쓰지 않습니다.",
      [
        "이메일 가입: 이메일(필수), 비밀번호(필수·암호화 저장), 이름(필수), 닉네임(필수), 전화번호(선택) — 회원 식별, 로그인, 이메일 인증·비밀번호 재설정 메일 발송, 그룹 멤버 간 표시",
        "Google 로그인: Google 계정의 이메일, 이름, 프로필 사진 URL, 계정 식별자 — 회원 식별과 로그인",
        "프로필 사진: 이용자가 직접 올린 이미지 — 그룹 멤버 간 표시",
        "일정·그룹 데이터: 일정 제목·내용·시간·카테고리, 그룹 이름·소개·멤버 관계, 가입 신청 메시지 — 서비스의 핵심 기능 제공",
        "위치: 브라우저 위치 권한을 허용한 경우에만 좌표를 기상청 격자 좌표로 바꿔 날씨 조회에 씁니다. 좌표는 서버에 저장하지 않고 브라우저에만 남습니다.",
        "자동 수집: 접속 기록(마지막 접속 시각), 로그인 토큰 쿠키, 테마 설정 쿠키",
      ],
    ],
  },
  {
    title: "보유 기간",
    body: [
      [
        "회원 정보: 탈퇴 시까지. 탈퇴하면 지체 없이 삭제합니다.",
        "이메일 인증 코드: 발송 후 3분, 인증 완료 후 30분.",
        "로그인 토큰: access-token 30분, refresh-token 7일(로그아웃 시 즉시 폐기, 만료분은 매일 정리).",
        "관련 법령이 보존을 요구하는 경우(전자상거래법 등)는 그 기간 동안 보관합니다. 현재 서비스는 결제 기능이 없습니다.",
      ],
    ],
  },
  {
    title: "제3자 제공과 처리 위탁",
    body: [
      "이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 서비스 운영을 위해 아래 업체에 처리를 맡깁니다.",
      [
        "Amazon Web Services(EC2) — 서버·데이터베이스 호스팅",
        "네이버 클라우드 플랫폼(Object Storage) — 프로필 이미지 저장",
        "Google — Google 계정 로그인(OAuth 2.0)",
        "SMTP 메일 서비스 — 인증 코드·비밀번호 재설정 메일 발송(이메일 주소만 전달)",
        "기상청·공공데이터포털 — 날씨·공휴일 조회(개인정보는 전달하지 않고 격자 좌표만 전송)",
      ],
    ],
  },
  {
    title: "이용자의 권리",
    body: [
      [
        "프로필 화면에서 이름·닉네임·전화번호·비밀번호·프로필 사진을 직접 수정할 수 있습니다.",
        "계정 삭제(탈퇴)는 아래 보호책임자 이메일로 요청하면 지체 없이 처리합니다. 삭제되면 계정과 개인 일정이 사라지고, 그룹 일정은 그룹에 남되 작성자 표시만 사라집니다. (프로필 화면의 탈퇴 버튼은 준비 중입니다.)",
        "브라우저 설정에서 위치 권한과 쿠키를 거부할 수 있습니다. 위치를 거부하면 날씨는 기본 지역(서울)으로 표시되고, 로그인 쿠키를 거부하면 로그인이 유지되지 않습니다.",
      ],
    ],
  },
  {
    title: "안전성 확보 조치",
    body: [
      [
        "비밀번호는 복호화할 수 없는 방식(bcrypt)으로 저장합니다.",
        "로그인 토큰은 HttpOnly·Secure 쿠키로 전달해 스크립트가 읽을 수 없게 합니다.",
        "모든 통신은 HTTPS로 암호화합니다.",
        "데이터베이스 접속 정보는 암호화해 보관하며, 접근은 운영자로 제한합니다.",
      ],
    ],
  },
  {
    title: "쿠키",
    body: [
      "서비스는 로그인 유지(access-token, refresh-token)와 테마 설정(theme)에만 쿠키를 씁니다. 광고·추적 목적의 쿠키나 외부 분석 도구는 사용하지 않습니다.",
    ],
  },
  {
    title: "개인정보 보호책임자",
    body: [
      "개인정보에 관한 문의, 열람·정정·삭제 요청은 아래로 연락해 주세요. 확인 후 지체 없이 답변합니다.",
      ["담당: OneSchedule 운영자", "이메일: dnjsl2166@gmail.com"],
    ],
  },
  {
    title: "변경",
    body: [
      "이 방침이 바뀌면 시행일 7일 전부터 서비스 안에 공지합니다. 수집 항목이나 목적이 늘어나는 변경은 다시 동의를 받습니다.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="개인정보처리방침"
      effectiveDate="2026년 9월 22일"
      sections={SECTIONS}
      other={{ href: "/terms", label: "이용약관" }}
    />
  );
}
