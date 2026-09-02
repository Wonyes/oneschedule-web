# dashboard_web (ONE SCHEDULER)

개인 일정과 그룹 일정을 한 곳에서 관리하는 캘린더 웹 앱의 프론트엔드(Next.js App Router)입니다.
백엔드 API는 이 저장소에 포함되어 있지 않으며, `NEXT_PUBLIC_SERVER_IP`로 지정한 별도 서버를 호출합니다.

## 요구 사항

- Node.js 20+
- 별도로 실행 중인 백엔드 API 서버 (인증, 일정, 그룹, 공휴일/날씨 프록시 등)

## 환경 변수

`.env.local`을 만들어 아래 값을 채워주세요.

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_WEB_IP` | 프론트 자체 오리진. Playwright e2e의 `baseURL`로 사용 (예: `http://localhost:3000`) |
| `NEXT_PUBLIC_SERVER_IP` | 백엔드 API 오리진. 브라우저(axios)와 서버 컴포넌트 양쪽에서 호출하므로 공개 변수 (예: `http://localhost:8080`) |
| `KAKAO_REST_API_KEY` | 좌표→주소 변환(`/api/address`)에 쓰는 카카오 REST API 키. **서버에서만 사용**하므로 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다 |
| `E2E_EMAIL` / `E2E_PASSWORD` | Playwright 로그인 테스트용 계정. 없으면 해당 테스트는 자동으로 skip됩니다 |

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인합니다.

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (webpack) |
| `npm run build` | `tsc --noEmit` 타입 체크 후 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint |
| `npm run test` | Jest 단위 테스트 |
| `npm run coverage` | Jest 커버리지 리포트 |
| `npm run e2e` | Playwright e2e 테스트 |

## 인증 흐름

- 로그인 성공 시 백엔드가 `access-token` 쿠키(및 refresh 쿠키)를 내려줍니다.
- `src/middleware.ts`가 보호 라우트(`/`, `/schedule`, `/group`, `/profile`) 진입 시 `access-token` 쿠키 유무를 검사하고, 없으면 리프레시를 먼저 시도한 뒤에도 실패하면 `/login`으로 리다이렉트합니다.
- 브라우저에서의 401/403은 `src/lib/api.ts`의 axios 인터셉터가 `/token-refresh`를 호출해 자동 재시도합니다.

## 디렉터리 구조 (요약)

```
src/
  app/            App Router 페이지 및 API 라우트
  components/     기능별 UI 컴포넌트 (common, home, group, schedule, ui)
  hooks/          react-query 훅(querys), zustand 스토어(stores)
  lib/            axios 인스턴스, 서버 전용 fetch, 인증 유틸
  types/          API 응답/요청 타입
  utils/          날짜·일정 계산 순수 함수
```

## 향후 개선 로드맵

이 저장소는 프론트엔드만 포함하므로, 아래 항목은 백엔드 API가 먼저 준비되어야 프론트 구현이 가능합니다.
백엔드/프론트 담당 업무를 기능별로 나눠 정리합니다.

### 1. 일정 알림/리마인더
- **백엔드**: 일정에 "알림 시점" 필드 추가, 알림 발송 인프라(스케줄러/큐 + FCM 또는 웹푸시 서버), 알림 이력 조회 API
- **프론트엔드**: 웹푸시 구독 등록(Service Worker), 일정 생성/수정 폼에 알림 시점 선택 UI, 알림함 UI

### 2. 반복 일정
- **백엔드**: 일정 모델에 반복 규칙(RRULE 등) 저장, 반복 회차 확장(occurrence) 조회 API, "이 일정만/전체 수정" 삭제·수정 로직
- **프론트엔드**: 생성/수정 폼에 반복 설정 UI, 캘린더 뷰의 반복 일정 렌더링, 회차별 수정 옵션 모달

### 3. 외부 캘린더 연동 (ICS)
- **백엔드**: iCalendar(.ics) export 엔드포인트, 구독용 고유 URL 발급
- **프론트엔드**: "캘린더 구독/내보내기" 버튼, 구독 URL 안내 UI

### 4. 다중 그룹 소속
- **백엔드**: 유저-그룹 관계를 1:1 → N:M으로 스키마 변경, 그룹별 권한/전환 API
- **프론트엔드**: 그룹 전환 스위처, `useScheduleViewStore` 등 뷰 상태를 그룹 단위로 확장

### 5. 일정 충돌 시각적 표시 (백엔드 변경 불필요)
개인/그룹 일정 API가 이미 각각 존재하므로, 두 데이터를 동시에 불러와 `utils/schedule.ts`의 겹침 계산 로직을 확장해 하이라이트하면 프론트만으로 구현 가능.

### 6. 라이트 테마 추가 (백엔드 무관)
현재 `globals.css`는 다크 전용 팔레트만 정의되어 있음. 라이트 팔레트 신규 디자인 + 토큰 이원화가 필요한 별도의 디자인 작업.
