# ONE SCHEDULER

> 개인 일정과 그룹 일정을 한 화면에서 관리하는 캘린더 웹 앱 — **프론트엔드 (Next.js App Router)**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-443E38)
![Tests](https://img.shields.io/badge/Jest-75%20passed-C21325?logo=jest&logoColor=white)

---

## 1. 프로젝트 개요

**"일정 앱은 많은데, 내 일정과 우리 팀 일정을 같이 보는 앱은 왜 없지?"** 에서 시작했습니다.

구글 캘린더는 공유 캘린더를 켜면 색만 다른 일정이 한 그리드에 섞여버리고, 팀 협업 툴은 일정이 프로젝트에 종속됩니다.
ONE SCHEDULER는 **개인 / 그룹이라는 축을 UI 최상단에 두고**, 같은 캘린더에서 탭 하나로 전환하도록 만든 스케줄러입니다.

- **역할**: 프론트엔드 전담 (기획 · 디자인 시스템 · 구현 · 테스트), 백엔드 API 스펙 협의
- **백엔드**: 별도 저장소의 Spring Boot API 서버 (이 저장소에 포함되지 않음)
- **배포**: Vercel (`main` push 시 자동 배포)

### 주요 기능

| 영역 | 내용 |
| --- | --- |
| 캘린더 | 일간 / 주간 / 월간 3개 뷰, 스와이프·버튼 날짜 이동, 시간 그리드 위 일정 카드 절대 배치 |
| 일정 | 등록 / 수정 / 삭제 (바텀시트), 참여자 지정, **등록자만 수정·삭제 가능**한 권한 처리 |
| 그룹 | 초대 코드 기반 가입, 다중 그룹 소속, 헤더에서 그룹 전환, 멤버 직책 관리, 그룹 해체 |
| 인증 | 쿠키(HttpOnly) 기반 로그인, 미들웨어 라우트 가드, 액세스 토큰 자동 재발급 |
| 홈 | 대시보드 (통계 타일 · 다가오는 일정 · 온보딩 체크리스트 · 공휴일 / 날씨 배너) |
| 기타 | 다크 / 라이트 테마, 위치 기반 날씨, 일정 검색, 프로필 이미지 업로드 |

---

## 2. 기술 스택과 선택 이유

| 기술 | 선택 이유 |
| --- | --- |
| **Next.js 16 (App Router)** | 인증 쿠키를 **미들웨어에서 먼저 검사**해야 했습니다. 로그인 여부에 따라 서버에서 아예 다른 컴포넌트를 렌더링하는 구조(§3-1)가 이 프로젝트 최대 난제의 해법이었습니다. |
| **TanStack Query v5** | 서버 상태(일정 · 그룹 · 유저)와 클라이언트 상태를 분리. 서버 컴포넌트에서 `prefetchQuery` → `HydrationBoundary`로 넘겨 첫 화면의 로딩 스켈레톤을 없앴습니다. |
| **Zustand** | 캘린더 뷰 모드 · 선택 날짜 · 바텀시트 · 토스트처럼 **URL에 담을 필요 없는 UI 상태**만 담당. Context 중첩과 불필요한 리렌더를 피했습니다. |
| **Tailwind v4 + CSS 변수** | 뉴모피즘은 그림자 값이 테마마다 완전히 달라집니다. 색·그림자를 전부 CSS 변수로 정의하고 컴포넌트는 시맨틱 토큰만 쓰게 강제했습니다(§5). |
| **axios (인터셉터)** | 401/403 → 토큰 재발급 → 원요청 재시도 흐름을 한 곳에서 처리하기 위해. fetch로는 이 재시도 로직을 매 호출마다 반복해야 했습니다. |
| **Jest + Playwright** | 순수 로직(겹침 계산 · 토큰 재발급)은 Jest, 실제 브라우저가 필요한 것(모바일 오버플로 · 로그인)은 Playwright로 나눴습니다. |

---

## 3. 트러블슈팅 — 실제로 막혔던 것들

> 이 프로젝트에서 가장 많은 시간을 쓴 문제들입니다. 증상 → 원인 → 해결 순으로 정리했습니다.

### 3-1. 로그인하지 않은 사용자가 홈에 들어오면 401 / 403이 무한 발생

가장 오래 붙잡았던 문제입니다.

**증상**

```
GET /v1/api/group/my            401 (Unauthorized)
GET /v1/api/schedules?type=...  403 (Forbidden)
```

비로그인 상태로 `/`에 들어오면 콘솔이 에러로 도배됐습니다. 게다가 axios 인터셉터가 401을 보고 토큰 재발급을 시도 → 재발급도 실패 → 다시 호출... **무한 루프**까지 발생했습니다.

**시도했다가 버린 방법**

- `useQuery`의 `enabled` 옵션으로 막기 → 훅이 늘어날 때마다 매번 빼먹었고, 조건도 훅마다 제각각이 됨
- 에러를 잡아서 무시하기 → 호출 자체는 계속 나가므로 근본 해결이 아님

**원인**

훅이 마운트되는 순간 요청이 나갑니다. 즉 **"조건부로 호출하지 않기"가 아니라 "조건부로 마운트하지 않기"** 가 필요했습니다.

**해결** — 서버 컴포넌트에서 쿠키를 보고 트리 자체를 분기했습니다.

```tsx
// src/app/(main)/page.tsx
export default async function HomePage() {
  const cookieStore = await cookies();

  // 액세스 토큰이 없으면 데이터 훅이 든 트리를 아예 렌더하지 않는다
  if (!cookieStore.get("access-token")) return <GuestHome />;

  const queryClient = getServerQueryClient();
  const [user] = await Promise.all([
    getMyInfo(),
    queryClient.prefetchQuery({ queryKey: [scheduleKeys.list, "PERSONAL"], /* ... */ }),
    queryClient.prefetchQuery({ queryKey: [groupkeys.myGroup],            /* ... */ }),
  ]);

  if (!user) return <GuestHome />;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent user={user} initialGroups={groups} activeGroup={activeGroup} />
    </HydrationBoundary>
  );
}
```

`GuestHome`은 데이터 훅을 하나도 쓰지 않는 정적 소개 화면입니다. 비로그인 요청은 **네트워크 탭에 인증 API가 한 줄도 남지 않게** 됐고, 덤으로 로그인 사용자는 서버 프리페치 덕분에 첫 화면에서 스켈레톤을 보지 않습니다.

> 회귀 방지: `tests/e2e/guest-network.spec.ts` — 비로그인 상태로 `/`, `/login`, `/sign`에 진입해 **`/v1/api` 요청이 0건**인지 검증합니다. 훅은 early return보다 먼저 실행되므로, 화면에 보이지 않는 컴포넌트가 조용히 요청을 흘리는 것을 막기 위한 테스트입니다.

---

### 3-2. 리프레시 토큰이 살아있는데도 로그아웃되던 문제

**증상** 재방문 시 자동 로그인이 되어야 하는데 매번 `/login`으로 튕겼습니다.

**원인** 미들웨어가 **액세스 토큰 쿠키가 없다는 이유만으로 즉시 리다이렉트**하고 있었습니다. 액세스 토큰은 수명이 짧아서 만료가 정상이고, 이때 리프레시 토큰으로 재발급받으면 되는데 미들웨어가 그 기회를 먼저 뺏어간 것입니다.

**해결** 리다이렉트 전에 재발급을 먼저 시도하고, 성공하면 백엔드가 내려준 `Set-Cookie`를 응답에 그대로 얹어 통과시킵니다.

```ts
// src/middleware.ts
if ((isPrivateRoute || isHome) && !accessToken) {
  const refreshed = await tryRefreshToken(request);

  // 재발급 성공 → 새 쿠키를 응답에 붙여서 그대로 진행
  if (refreshed) return applyRefreshedCookies(NextResponse.next(), refreshed);

  // 홈은 재발급 실패해도 통과 (비로그인 소개 화면을 보여줘야 하므로)
  if (isHome) return NextResponse.next();

  return NextResponse.redirect(new URL("/login", request.url));
}
```

**추가로** 브라우저에서도 401/403이 동시에 여러 개 터지면 재발급 요청이 그만큼 중복 발사됐습니다. 인터셉터에 **single-flight** 를 적용해 진행 중인 재발급 Promise를 공유하도록 했습니다.

```ts
// src/lib/api.ts — 여러 요청이 동시에 401을 받아도 재발급은 1회만
if (!refreshPromise) {
  refreshPromise = api.post("/token-refresh")
    .then(() => undefined)
    .finally(() => { refreshPromise = null; });
}
await refreshPromise;
return api(originalRequest);   // 원요청 재시도
```

로그인·재발급 엔드포인트 자신은 이 흐름을 타면 안 되므로 `_skipAuthRefresh` 플래그로 제외하고, `_retry`로 재시도는 1회로 제한했습니다.

---

### 3-3. 겹치는 일정 카드가 서로를 침범하고 높이가 깨지던 문제

**증상** 같은 시간대에 일정이 2개 이상이면 카드가 겹쳐 찍히고, 3개 이상이면 폭이 0에 수렴해 제목이 보이지 않았습니다.

**원인** 처음 구현은 "나와 겹치는 일정 수"로 폭을 나누는 방식이었습니다. 이러면 **체인형 겹침**(A-B 겹침, B-C 겹침, A-C는 안 겹침)에서 A와 C가 같은 폭 기준을 갖지 못해 서로를 침범합니다.

**해결** 계산을 3단계로 재작성했습니다. (`src/utils/schedule.ts`)

1. **클러스터링** — 시작 시각 기준 정렬 후, 직전까지의 최대 종료 시각과 겹치지 않으면 새 묶음으로 분리
2. **열 배정** — 클러스터 안에서 "마지막 일정과 겹치지 않는 기존 열"을 찾아 재사용, 없으면 새 열 생성
3. **폭 분할** — 클러스터의 **열 개수**로 `100%`를 나눔 (개별 일정 기준이 아니라 클러스터 기준인 것이 핵심)

```ts
cluster.forEach((event) => {
  const column = columns.find((col) => !isOverlapping(col[col.length - 1], event));
  column ? column.push(event) : columns.push([event]);
});

const width = 100 / columns.length;
```

**그리고 하나 더** — 폭이 좁은데 열이 늘어나면 어떤 비율로 나눠도 읽을 수 없었습니다. **뷰마다 표시 가능한 최대 열 수를 다르게** 두고(주간 2열, 일간 4열), 넘치는 일정은 클러스터 전체 높이를 차지하는 **`+N` 오버플로 배지**로 묶어 클릭 시 목록을 띄웁니다.

```ts
const visibleColumns = columns.slice(0, MAX_VISIBLE_COLUMNS - 1);
const overflowEvents = columns.slice(MAX_VISIBLE_COLUMNS - 1).flat();
// 배지는 클러스터의 top ~ bottom 전체를 덮는 하나의 카드로 렌더
```

> 단위 테스트로 체인형 겹침 · 완전 포함 · 오버플로 배지 케이스를 고정해뒀습니다.

---

### 3-4. 모바일에서 캘린더가 사용 불가능했던 문제

**증상** 320~390px 구간에서 월간 뷰의 칸이 너무 좁아 **날짜 숫자와 날씨 아이콘이 겹치고**, 주간 뷰는 요일 헤더 텍스트가 칸 밖으로 넘쳤습니다. 일정 카드까지 얹히면 아무것도 읽을 수 없었습니다.

**원인** 데스크톱 그리드를 그대로 축소했기 때문입니다. 그리드는 폭이 줄면 정보 밀도를 유지할 수 없는데, 모바일은 애초에 그 밀도를 감당할 수 없습니다.

**해결** 모바일에서는 **레이아웃 구조 자체를 바꿨습니다.**

- 월간: 그리드에는 **날짜 + 일정 유무 닷** 만 남기고, 선택한 날짜의 일정은 **하단 아젠다 패널**로 분리
- 주간: 요일 헤더의 아이콘/텍스트 정렬을 맞추고, 날씨는 배지로 축약
- 헤더의 스케줄 탭은 모바일에서 숨기고 뷰 전환만 남김

**회귀 방지** 눈으로 확인하는 방식은 매번 놓쳤기 때문에, **320px / 390px에서 가로 오버플로가 생기면 실패하는 e2e 테스트**를 붙였습니다.

```ts
// tests/e2e/mobile-layout.spec.ts — WIDTHS = [320, 390]
const overflow = await page.evaluate(() => {
  const doc = document.documentElement;
  return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth };
});

// 1px 정도의 반올림 오차는 허용한다
expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
```

---

### 3-5. 다중 그룹 전환 — localStorage를 쓰지 않은 이유

**배경** 초기 스키마는 유저당 그룹 1개(`groupCode`)였습니다. 가족·회사에 동시 소속하려면 N:M이 필요해 백엔드 API를 `/{groupNo}` path variable 방식으로 바꾸고, 프론트도 "지금 보고 있는 그룹"이라는 상태를 새로 만들어야 했습니다.

**첫 아이디어** localStorage에 선택한 그룹 번호를 저장.

**문제** 홈은 서버 컴포넌트가 그룹 데이터를 미리 그립니다. localStorage는 **서버에서 읽을 수 없어** 서버는 "그룹 A", 클라이언트는 "그룹 B"를 그리게 되고 → 하이드레이션 미스매치가 납니다.

**해결** `active-group` **쿠키**로 저장했습니다. 서버·클라이언트가 같은 값을 읽을 수 있는 저장소가 필요했던 것이 이유입니다.

```ts
// src/lib/activeGroup.ts
export function resolveActiveGroup(groups: MyGroupResponse[], activeGroupNo: number | null) {
  if (groups.length === 0) return undefined;
  // 저장된 번호가 탈퇴·해체된 그룹일 수 있으므로 항상 목록과 대조 후 폴백
  return groups.find((g) => g.groupNo === activeGroupNo) ?? groups[0];
}
```

**여기서 실제로 터진 버그** 그룹을 해체했는데 쿠키에는 해체된 번호가 남아 빈 화면이 떴습니다. `resolveActiveGroup`이 목록과 대조 후 첫 번째 그룹으로 폴백하도록 하고, 남은 그룹이 없으면 그룹 선택 화면으로 보냅니다.

---

### 3-6. 테마 전환이 새로고침하면 풀리던 문제

**증상** 라이트/다크 토글은 되는데, 페이지 이동이나 `router.refresh()` 후 원래 테마로 되돌아갔습니다.

**원인** 클라이언트에서 `document.documentElement.dataset.theme`만 바꾸고 있었습니다. 서버 렌더 결과에는 그 속성이 없으므로 다시 그려지는 순간 덮였습니다.

**해결** 테마를 `theme` 쿠키에 저장하고, **루트 레이아웃이 서버에서 쿠키를 읽어** `<html data-theme>`에 심습니다. 쿠키가 없으면 속성 자체를 넣지 않고, 이 경우 기본값인 라이트 팔레트가 적용됩니다.

```tsx
// src/app/layout.tsx
const themeCookie = (await cookies()).get("theme")?.value;
const theme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : undefined;

return <html lang="ko" data-theme={theme}> ... </html>;
```

**트레이드오프** 루트에서 쿠키를 읽는 순간 모든 라우트가 동적 렌더링이 됩니다. 지금 규모에서는 깜빡임 없는 테마가 더 가치 있다고 판단했고, 트래픽이 커지면 PPR 도입이나 적용 위치 재검토가 필요하다고 §9에 남겨뒀습니다.

---

### 3-7. 그 외 기록해둘 만한 것들

| 문제 | 원인 · 해결 |
| --- | --- |
| **페이지 이동이 느림** | `router.push`로 이동하고 있어 프리페치가 동작하지 않았습니다. 전부 `<Link>`로 교체해 뷰포트 진입 시 프리페치되도록 변경 |
| **카드 그림자가 좌우로 잘림** | 내부 스크롤 컨테이너의 `overflow` 때문에 뉴모피즘 그림자가 클리핑됐습니다. 메인 콘텐츠 영역 좌우 여백을 그룹 페이지 기준으로 통일 |
| **프로필 사진 변경 후 헤더가 그대로** | 업로드 성공 후 캐시를 갱신하지 않았습니다. `setQueriesData`로 `myInfo` 캐시를 즉시 덮어써 헤더 아바타가 바로 반영되게 처리 |
| **그룹 일정이 개인 일정으로 등록됨** | 바텀시트가 열릴 때의 컨텍스트로 개인/그룹을 판정하는 로직 버그. `useSheetStore.test.ts`로 회귀 고정 |
| **수정 요청의 쿼리 파라미터 누락** | `Put` 래퍼가 `params`를 넘기지 않고 있었습니다. `useMutations.test.ts`로 회귀 고정 |
| **헤더 드롭다운이 콘텐츠 뒤로 감** | 스태킹 컨텍스트 문제. 오버레이 레이어와 z-index 정리 |
| **일정 탭이 그룹 스위처 때문에 밀림** | 탭을 화면 기준 절대 중앙에 고정하고, 좌우 요소가 늘어나도 밀리지 않게 변경 |
| **`useWeathers` 타입 오류** | `strict: true` 적용 중 발견. 실제 응답은 날짜 키 객체인데 배열로 선언돼 있었음 → `ProcessedWeather`로 정정 |

---

## 4. 아키텍처

```mermaid
flowchart TD
    A[브라우저 요청] --> B{middleware.ts}
    B -->|access-token 있음| C[App Router]
    B -->|없음| D[refreshAccessToken]
    D -->|성공| E[Set-Cookie 부착 후 통과]
    E --> C
    D -->|실패 · 홈| C
    D -->|실패 · 보호 라우트| F[/login 리다이렉트]

    C --> G{서버 컴포넌트 쿠키 검사}
    G -->|비로그인| H[GuestHome<br/>데이터 훅 없음 · 인증 요청 0건]
    G -->|로그인| I[prefetchQuery + HydrationBoundary]
    I --> J[클라이언트 컴포넌트]

    J --> K[TanStack Query · 서버 상태]
    J --> L[Zustand · UI 상태]
    K --> M[axios 인터셉터]
    M -->|401 · 403| N[single-flight 토큰 재발급]
    N --> M
    M --> O[(Spring Boot API)]
```

```
src/
  app/            App Router 페이지 · 라우트 핸들러 (/api/address 카카오 좌표→주소 프록시)
  components/     common · home · group · schedule · ui
  hooks/
    querys/       TanStack Query 훅 + 쿼리 키
    stores/       Zustand 스토어 (캘린더 · 시트 · 오버레이 · 활성 그룹)
  lib/            axios 인스턴스 · 서버 전용 fetch · 토큰 재발급 · 활성 그룹
  types/          API 요청 / 응답 타입
  utils/          날짜 · 일정 겹침 계산 등 순수 함수
tests/e2e/        Playwright (로그인 · 모바일 오버플로 · 비로그인 네트워크)
```

### 인증 흐름 요약

1. 로그인 성공 → 백엔드가 `access-token` / refresh 쿠키를 HttpOnly로 내려줌
2. `middleware.ts`가 보호 라우트 진입 시 쿠키 검사 → 없으면 **재발급 먼저 시도**
3. 브라우저의 401/403은 axios 인터셉터가 `/token-refresh` 후 원요청 재시도 (동시 요청은 1회로 합침)
4. 재발급까지 실패하면 `/login`

---

## 5. 디자인 시스템 — 뉴모피즘을 "규칙"으로 만들기

디자인은 이 프로젝트에서 가장 많이 갈아엎은 부분입니다. 여러 방향을 시도했지만 **표면 처리 규칙이 없으면 아무리 예쁜 컴포넌트를 만들어도 화면 전체가 따로 논다**는 것이 결론이었습니다. 그래서 규칙을 세 개로 줄였습니다.

| 유틸리티 | 용도 | 형태 |
| --- | --- | --- |
| `neu-flat` | 카드, 리스트 행 등 대부분의 콘텐츠 면 | 솟아오름 (`--elevation-1`) |
| `neu-float` | 더 떠 있어야 하는 요소 (브랜드 히어로 등) | 크게 솟아오름 (`--elevation-2`) |
| `neu-pressed` | 입력창, 캘린더 그리드, 토글 트랙 | 안으로 파임 (`--inset-1`) |

시행착오에서 얻은 원칙:

- **솟은 면은 "상단 1px 베벨 하이라이트 + 우하단 그림자"** 조합이어야 합니다. 이 베벨이 없으면 같은 그림자여도 사람 눈에는 파인 **구멍**으로 읽힙니다. (초기 뉴모피즘이 촌스러웠던 진짜 원인)
- **표면색(`--surface`)은 항상 배경(`--main-bg`)보다 한 단계 밝아야** 합니다. 같거나 어두우면 아무리 그림자를 얹어도 파여 보입니다.
- **그림자는 불투명 회색이 아니라 반투명(`rgba`)** 으로. 불투명이면 요소가 인접할 때 경계가 띠처럼 보입니다.
- **컴포넌트에 고정 색을 쓰지 않습니다.** `text-white`, `text-slate-400` 같은 값을 직접 쓰면 테마 전환 시 배경만 바뀌고 글자는 그대로 남아 안 보이게 됩니다. 색은 전부 `globals.css`의 CSS 변수로만 정의하고, 컴포넌트는 `bg-surface` / `text-foreground` 같은 시맨틱 토큰만 씁니다.
  (예외: 배경이 테마와 무관하게 고정인 요소 — 브랜드 색 뱃지, 액센트 버튼 위의 흰 글씨)
- **백드롭 필터(글래스모피즘)는 쓰지 않았습니다.** 스크롤 시 성능 부담이 커서 뉴모피즘 쪽으로 방향을 고정했습니다.

---

## 6. 품질 관리

```
Test Suites: 9 passed, 9 total
Tests:      75 passed, 75 total
```

- **Jest 75개** — 일정 겹침 레이아웃, 충돌 표시(`markConflicts`), axios 인터셉터 재발급 흐름, 활성 그룹 폴백, 폼 훅, 시트 스토어의 개인/그룹 판정, 뮤테이션 파라미터 전달
- **Playwright** — 로그인, 회원가입 후 온보딩, **비로그인 인증 요청 0건**, **320 / 390px 가로 오버플로**
- **타입** — `strict: true`, `noImplicitAny: true`. `npm run build`는 `tsc --noEmit`을 먼저 통과해야 진행됩니다.
- 테스트는 대부분 **실제로 터졌던 버그를 고친 뒤 회귀 방지용으로 추가**했습니다. 커버리지 숫자보다 "같은 버그가 두 번 나지 않는 것"을 기준으로 삼았습니다.

---

## 7. 실행 방법

### 요구 사항

- Node.js 20+
- 별도로 실행 중인 백엔드 API 서버 (인증 · 일정 · 그룹 · 공휴일/날씨 프록시)

### 환경 변수 (`.env.local`)

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_WEB_IP` | 프론트 자체 오리진. Playwright e2e의 `baseURL` (예: `http://localhost:3000`) |
| `NEXT_PUBLIC_SERVER_IP` | 백엔드 API 오리진. 브라우저(axios)와 서버 컴포넌트 양쪽에서 호출하므로 공개 변수 (예: `http://localhost:8080`) |
| `KAKAO_REST_API_KEY` | 좌표→주소 변환(`/api/address`)용 카카오 REST API 키. **서버에서만 사용**하므로 `NEXT_PUBLIC_` 접두사 없음 |
| `E2E_EMAIL` / `E2E_PASSWORD` | Playwright 로그인 테스트 계정. 없으면 해당 테스트는 자동 skip |

```bash
npm install
npm run dev
```

### 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | `tsc --noEmit` 타입 체크 후 프로덕션 빌드 |
| `npm run lint` | ESLint |
| `npm run test` | Jest 단위 테스트 |
| `npm run coverage` | 커버리지 리포트 |
| `npm run e2e` | Playwright e2e |

---

## 8. 회고 — 배운 것

**1. "호출을 막는다"와 "마운트를 막는다"는 다르다.**
비로그인 API 호출 문제를 `enabled` 옵션으로만 풀려다 오래 헤맸습니다. 훅이 붙는 순간 요청은 나가므로, 진짜 해법은 **서버에서 트리를 분기**하는 것이었습니다. App Router를 쓴 이유가 여기서 분명해졌습니다.

**2. 서버와 클라이언트가 같이 그리는 화면에서는 저장소 선택이 곧 설계다.**
localStorage는 편하지만 서버가 읽을 수 없습니다. 서버 컴포넌트가 먼저 그리는 값이라면 **쿠키**여야 한다는 것을 하이드레이션 미스매치를 겪고 나서 체득했습니다. 테마도, 활성 그룹도 같은 이유로 쿠키입니다.

**3. 눈으로 확인하는 QA는 반드시 놓친다.**
모바일 오버플로는 고쳐도 다른 작업 중에 다시 깨졌습니다. `scrollWidth > clientWidth`면 실패하는 e2e 한 줄을 붙인 뒤로는 재발하지 않았습니다. 같은 것을 반복해서 눈으로 보고 있다면 그건 테스트로 만들어야 한다는 신호였습니다.

**4. 가장 어려웠던 건 구현이 아니라 기획이었다.**
API는 필요하면 만들면 되지만, "이 화면에 뭘 넣어야 사람들이 쓸까"는 답이 없었습니다. 홈이 계속 비어 보였던 이유는 요소가 부족해서가 아니라 **홈의 역할이 정해지지 않았기 때문**이었습니다. "캘린더는 도구, 홈은 오늘의 요약"으로 역할을 나눈 뒤에야 통계 타일 · 다가오는 일정 · 온보딩 체크리스트라는 답이 나왔습니다.

**5. 디자인은 감각이 아니라 규칙으로 관리해야 한다.**
"예쁘게"를 목표로 매번 다시 그리는 동안에는 오히려 퇴화했습니다. 표면 처리를 3종으로 제한하고 색을 토큰으로 강제한 뒤에야 화면 전체가 한 앱처럼 보이기 시작했습니다.

---

## 9. 남은 과제

정직하게 남겨두는 부분입니다. **알림 · 반복 일정 · 외부 캘린더 연동**은 캘린더 앱의 핵심 가치인데 아직 없습니다. 백엔드 인프라가 함께 필요해 우선순위를 잡아둔 상태입니다.

<details>
<summary>상세 로드맵 (백엔드 / 프론트엔드 분담)</summary>

### 1. 일정 알림 / 리마인더

- **백엔드**: 알림 시점 필드, 발송 인프라(스케줄러/큐 + FCM 또는 웹푸시), 알림 이력 API
- **프론트엔드**: 웹푸시 구독(Service Worker), 폼의 알림 시점 선택 UI, 알림함

### 2. 반복 일정

- **백엔드**: 반복 규칙(RRULE) 저장, occurrence 확장 조회 API, "이 일정만 / 전체" 수정·삭제
- **프론트엔드**: 반복 설정 UI, 캘린더 렌더링, 회차별 수정 옵션 모달

### 3. 외부 캘린더 연동 (ICS)

- **백엔드**: iCalendar export 엔드포인트, 구독용 고유 URL
- **프론트엔드**: 구독 / 내보내기 UI

### 4. 일정 검색 서버화

현재 검색은 클라이언트에 이미 받아온 일정만 대상으로 합니다. 데이터가 많아지면 기간·키워드 검색 API로 데이터 소스만 교체할 예정입니다.

### 5. 프론트엔드 자체 과제

| 항목 | 내용 | 우선순위 |
| --- | --- | --- |
| 컴포넌트 테스트 | 캘린더 뷰(주/월 렌더링)와 시트 폼 동작 테스트 부재 | 중간 |
| 접근성 | 캘린더 그리드 키보드 탐색(방향키), 스크린리더용 날짜 레이블 미구현 | 중간 |
| 운영 | Sentry / Analytics 미연동 — 배포 후 클라이언트 런타임 에러 인지 수단 없음 | 중간 |
| 거대 컴포넌트 | `ui/sheet/sheet.tsx`(493줄)가 폼 · 참여자 선택 · 뮤테이션을 모두 보유 | 낮음 |
| 미들웨어 검증 | 쿠키의 **존재 여부만** 확인. 만료 판정은 백엔드 401에 의존 | 낮음 |
| 정적 렌더링 | 테마 쿠키를 루트에서 읽어 전 라우트가 동적 렌더링 (§3-6 트레이드오프) | 낮음 |

</details>
