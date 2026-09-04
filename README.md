<div align="center">

# 🗓️ ONE SCHEDULER

**개인 일정과 그룹 일정을 하나의 캘린더에서 관리하는 스케줄러**

`Next.js 16` · `React 19` · `TypeScript (strict)` · `TanStack Query 5` · `Zustand 5` · `Tailwind v4` · `Jest` · `Playwright`

</div>

---

구글 캘린더는 공유 캘린더를 켜면 색만 다른 일정이 한 그리드에 섞이고, 협업 툴은 일정이 프로젝트에 종속됩니다.
**개인 / 그룹이라는 축을 UI 최상단에 두고 탭 하나로 전환하는 구조**를 만들었습니다.

이 저장소는 프론트엔드이고, 백엔드는 별도의 Spring Boot API 서버입니다.

| | 기능 |
| :---: | --- |
| 📅 | **캘린더** — 일간 / 주간 / 월간, 스와이프 · 버튼 이동, 시간 그리드 위 일정 카드 절대 배치 |
| ✏️ | **일정** — 바텀시트 기반 CRUD, 참여자 지정, 등록자만 수정 · 삭제 가능 |
| 👥 | **그룹** — 초대 코드 가입, 다중 그룹 소속, 헤더에서 그룹 전환, 직책 관리, 해체 |
| 🔐 | **인증** — HttpOnly 쿠키, 미들웨어 라우트 가드, 액세스 토큰 자동 재발급 |
| 🏠 | **홈** — 통계 타일, 다가오는 일정, 온보딩 체크리스트, 공휴일 / 날씨 |
| 🌗 | **그 외** — 다크 / 라이트 테마, 위치 기반 날씨, 일정 검색, 프로필 이미지 업로드 |

<br>

---

## 🔒 비로그인 상태에서 API를 호출하지 않기

비로그인으로 홈에 들어오면 `401`, `403`이 쏟아졌습니다. 인터셉터가 401을 보고 토큰 재발급을 시도 → 실패 → 재호출로 **루프**까지 돌았습니다.

`useQuery`의 `enabled`로 막아봤지만 훅이 늘어날 때마다 조건이 제각각이 됐습니다.

> 💡 **훅이 마운트되는 순간 요청은 이미 나간다.**
> 호출을 막을 게 아니라 마운트를 막아야 했고, 그건 서버에서만 가능했습니다.

```tsx
// src/app/(main)/page.tsx
export default async function HomePage() {
  const cookieStore = await cookies();

  // 데이터 훅이 든 트리를 아예 렌더하지 않는다
  if (!cookieStore.get("access-token")) return <GuestHome />;

  const queryClient = getServerQueryClient();
  const [user] = await Promise.all([getMyInfo(), /* prefetchQuery ... */]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent user={user} activeGroup={activeGroup} />
    </HydrationBoundary>
  );
}
```

`GuestHome`은 데이터 훅이 하나도 없는 정적 화면이라 **네트워크 탭이 비어 있고**, 로그인 사용자는 서버 프리페치 덕분에 첫 화면에서 스켈레톤을 보지 않습니다.

✅ `tests/e2e/guest-network.spec.ts` — `/`, `/login`, `/sign`에서 `/v1/api` 요청 0건 검증

<br>

## 🔑 토큰 재발급의 순서

재방문 시 리프레시 토큰이 살아있는데도 매번 `/login`으로 튕겼습니다. 미들웨어가 **액세스 토큰 쿠키가 없다는 이유만으로** 리다이렉트하고 있었기 때문입니다. 액세스 토큰은 수명이 짧아 만료가 정상이고, 재발급받으면 되는 상황을 미들웨어가 먼저 잘라낸 셈입니다.

```ts
// src/middleware.ts
if ((isPrivateRoute || isHome) && !accessToken) {
  const refreshed = await tryRefreshToken(request);

  // 성공하면 백엔드가 내려준 Set-Cookie를 응답에 얹어 그대로 통과
  if (refreshed) return applyRefreshedCookies(NextResponse.next(), refreshed);
  if (isHome) return NextResponse.next();

  return NextResponse.redirect(new URL("/login", request.url));
}
```

브라우저 쪽은 401이 동시에 여러 개 터지면 재발급도 그만큼 중복 발사됐습니다. 진행 중인 Promise를 공유하도록 **single-flight**를 걸었습니다.

```ts
// src/lib/api.ts
if (!refreshPromise) {
  refreshPromise = api.post("/token-refresh")
    .then(() => undefined)
    .finally(() => { refreshPromise = null; });
}
await refreshPromise;
return api(originalRequest);
```

로그인 · 재발급 엔드포인트 자신은 `_skipAuthRefresh`로 제외하고, `_retry`로 재시도는 1회로 제한합니다.

<br>

## 📐 겹치는 일정의 폭 계산

처음에는 "나와 겹치는 일정 수"로 폭을 나눴습니다. A-B가 겹치고 B-C가 겹치지만 A-C는 안 겹치는 **체인형 겹침**에서 A와 C의 기준이 달라져 카드가 서로를 침범합니다.

> 💡 **폭의 단위를 개별 일정이 아니라 연결된 덩어리(클러스터)로.**

```ts
// src/utils/schedule.ts — ① 클러스터링 ② 열 배정 ③ 폭 분할
cluster.forEach((event) => {
  const column = columns.find((col) => !isOverlapping(col[col.length - 1], event));
  column ? column.push(event) : columns.push([event]);
});

const width = 100 / columns.length;
```

열이 늘어나면 어떤 비율로 나눠도 읽을 수 없어서, 뷰마다 표시 가능한 최대 열 수를 다르게 두고(주간 2, 일간 4) 넘치는 일정은 클러스터 높이만큼을 차지하는 `+N` 배지로 묶었습니다.

<br>

## 🍪 서버와 클라이언트가 같은 값을 읽어야 할 때

다중 그룹을 붙이면서 "지금 보고 있는 그룹"을 `localStorage`에 넣으려다 막혔습니다. 홈은 서버 컴포넌트가 그룹 데이터를 먼저 그리는데 **서버는 localStorage를 읽을 수 없어** 서버와 클라이언트가 다른 그룹을 그리고, 하이드레이션이 깨집니다.

테마도 같은 문제였습니다. 클라이언트에서 `data-theme` 속성만 바꾸면 `router.refresh()` 때 서버 렌더 결과에 덮여 사라집니다.

> 💡 **서버가 먼저 그리는 값이라면 저장소는 쿠키여야 한다.**
> 테마도, 활성 그룹도 같은 이유로 쿠키입니다. 대신 모든 라우트가 동적 렌더링이 되는데, 지금 규모에서는 깜빡임 없는 테마가 더 가치 있다고 판단했습니다.

저장된 그룹 번호는 탈퇴 · 해체로 언제든 무효가 되므로 항상 목록과 대조합니다.

```ts
// src/lib/activeGroup.ts
export function resolveActiveGroup(groups: MyGroupResponse[], activeGroupNo: number | null) {
  if (groups.length === 0) return undefined;
  return groups.find((g) => g.groupNo === activeGroupNo) ?? groups[0];
}
```

<br>

## 📱 모바일 캘린더는 축소가 아니라 구조 변경

320~390px에서 월간 뷰는 날짜와 날씨 아이콘이 겹치고, 주간 뷰는 요일 텍스트가 칸을 넘쳤습니다. 데스크톱 그리드를 그대로 줄였기 때문인데, **그리드는 폭이 줄면 정보 밀도를 유지할 수 없습니다.**

월간은 그리드에 **날짜와 일정 유무 닷만** 남기고, 선택한 날짜의 일정은 하단 아젠다 패널로 분리했습니다.

눈으로 보는 QA로는 다른 작업 중에 계속 다시 깨져서, 가로 오버플로가 생기면 실패하는 테스트를 붙였습니다.

```ts
// tests/e2e/mobile-layout.spec.ts — WIDTHS = [320, 390]
expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
```

<br>

## 🧩 그 외

| 문제 | 원인 · 해결 |
| --- | --- |
| 페이지 이동이 느림 | `router.push`로 이동해 프리페치가 동작하지 않았음 → 전부 `<Link>`로 교체 |
| 카드 그림자가 잘림 | 내부 스크롤 컨테이너의 `overflow`가 뉴모피즘 그림자를 클리핑 → 콘텐츠 영역 여백 통일 |
| 프로필 변경이 헤더에 미반영 | 업로드 성공 후 `setQueriesData`로 `myInfo` 캐시 즉시 갱신 |
| 그룹 일정이 개인 일정으로 등록 | 시트의 개인/그룹 판정 로직 버그 → `useSheetStore.test.ts`로 고정 |
| 수정 요청의 파라미터 누락 | `Put` 래퍼가 `params`를 넘기지 않음 → `useMutations.test.ts`로 고정 |
| `useWeathers` 타입 오류 | `strict` 적용 중 발견. 응답은 날짜 키 객체인데 배열로 선언돼 있었음 |

<br>

---

## 🎨 디자인 시스템

표면 처리 규칙이 없으면 컴포넌트를 아무리 다듬어도 화면 전체가 따로 놉니다. 규칙을 **셋**으로 줄이고 색은 전부 CSS 변수로만 정의했습니다.

| 유틸리티 | 용도 | 형태 |
| --- | --- | --- |
| `neu-flat` | 카드, 리스트 행 등 대부분의 면 | 솟아오름 `--elevation-1` |
| `neu-float` | 브랜드 히어로 등 더 떠 있어야 하는 요소 | 크게 솟아오름 `--elevation-2` |
| `neu-pressed` | 입력창, 캘린더 그리드, 토글 트랙 | 파임 `--inset-1` |

- 🔦 솟은 면은 **상단 1px 베벨 + 우하단 그림자**가 세트입니다. 베벨이 없으면 같은 그림자여도 눈에는 구멍으로 읽힙니다.
- 🪜 표면색은 배경보다 **항상 한 단계 밝아야** 합니다. 같거나 어두우면 무슨 그림자를 얹어도 파여 보입니다.
- 🌫️ 그림자는 불투명 회색이 아니라 **반투명**으로. 불투명이면 요소가 인접할 때 경계가 띠처럼 보입니다.
- 🚫 컴포넌트에 `text-white` 같은 **고정 색을 쓰지 않습니다.** 테마를 바꾸면 배경만 바뀌고 글자가 남아 안 보입니다.

<br>

## 🧪 테스트

```
Test Suites: 9 passed, 9 total
Tests:      75 passed, 75 total
```

| | 커버 대상 |
| :---: | --- |
| **Jest** | 일정 겹침 레이아웃, 충돌 표시, 인터셉터 재발급 흐름, 활성 그룹 폴백, 시트의 개인/그룹 판정 |
| **Playwright** | 로그인, 온보딩, 비로그인 네트워크 0건, 320 / 390px 가로 오버플로 |

대부분 **실제로 터진 버그를 고친 뒤 회귀 방지용으로 추가**한 것들입니다. `npm run build`는 `tsc --noEmit`을 먼저 통과해야 진행됩니다.

<br>

## ⚙️ 실행

Node.js 20+, 그리고 실행 중인 백엔드 API 서버가 필요합니다.

```bash
npm install
npm run dev
```

**`.env.local`**

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_WEB_IP` | 프론트 오리진. Playwright의 `baseURL` |
| `NEXT_PUBLIC_SERVER_IP` | 백엔드 오리진. 브라우저와 서버 컴포넌트 양쪽에서 호출 |
| `KAKAO_REST_API_KEY` | 좌표→주소 변환용. 서버에서만 쓰므로 `NEXT_PUBLIC_` 없음 |
| `E2E_EMAIL` / `E2E_PASSWORD` | Playwright 로그인 계정. 없으면 해당 테스트 skip |

```
src/
  app/          App Router 페이지 · 라우트 핸들러
  components/   common · home · group · schedule · ui
  hooks/        querys(TanStack Query) · stores(Zustand)
  lib/          axios 인스턴스 · 서버 전용 fetch · 토큰 재발급 · 활성 그룹
  utils/        날짜 · 일정 겹침 계산 등 순수 함수
```

<br>

## 🚧 다음

알림, 반복 일정, 외부 캘린더(ICS) 연동은 백엔드 인프라가 함께 필요해 아직 없습니다.
프론트 쪽으로는 캘린더 뷰 컴포넌트 테스트, 캘린더 그리드 키보드 탐색, 에러 모니터링 연동이 남아 있습니다.
