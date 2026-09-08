import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "@/src/lib/refreshAccessToken";

/** "access-token=abc; Path=/; HttpOnly" 에서 이름과 값만 떼어낸다. */
function parseCookiePair(setCookie: string): [string, string] | null {
  const pair = setCookie.split(";")[0];
  const eq = pair.indexOf("=");

  if (eq <= 0) return null;

  return [pair.slice(0, eq).trim(), pair.slice(eq + 1)];
}

/**
 * 재발급받은 쿠키를 브라우저와 "이번 요청" 양쪽에 반영한다.
 *
 * Set-Cookie만 붙이면 브라우저는 새 토큰을 받지만 지금 렌더되는 서버 컴포넌트는
 * 여전히 토큰이 없는 원본 요청을 본다. getMyInfo가 null을 돌려주고 헤더가
 * 로그아웃으로 그려진 뒤, 새로고침해야 로그인으로 바뀌던 이유가 이것이다.
 *
 * NextResponse.next({ headers })가 아니라 { request: { headers } }여야 한다.
 * 전자는 클라이언트로 나가는 응답 헤더고, 우리가 고쳐야 하는 건 위로 전달되는
 * 요청 헤더다.
 */
function applyRefreshedCookies(request: NextRequest, refreshed: Response) {
  const setCookies = refreshed.headers.getSetCookie();

  const jar = new Map(
    request.cookies.getAll().map((cookie) => [cookie.name, cookie.value]),
  );

  setCookies.forEach((setCookie) => {
    const parsed = parseCookiePair(setCookie);
    if (parsed) jar.set(parsed[0], parsed[1]);
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "cookie",
    Array.from(jar, ([name, value]) => `${name}=${value}`).join("; "),
  );

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  setCookies.forEach((setCookie) => {
    response.headers.append("Set-Cookie", setCookie);
  });

  return response;
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access-token");

  const pathname = request.nextUrl.pathname;

  const authRoutes = ["/sign", "/login"];
  const privateRoutePrefixes = ["/schedule", "/group", "/profile"];

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutePrefixes.some((route) =>
    pathname.startsWith(route),
  );
  const isHome = pathname === "/";

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if ((isPrivateRoute || isHome) && !accessToken) {
    // 액세스 토큰 쿠키가 없어도 리프레시 토큰이 살아있으면 재발급부터 시도
    const refreshed = await tryRefreshToken(request);

    if (refreshed) {
      return applyRefreshedCookies(request, refreshed);
    }

    // 홈은 재발급도 실패했을 때 그냥 통과시켜서 자체 로그인 유도 화면을 보여준다
    if (isHome) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

function tryRefreshToken(request: NextRequest) {
  return refreshAccessToken(request.headers.get("cookie") ?? "");
}

export const config = {
  matcher: ["/", "/login", "/sign", "/schedule", "/group", "/profile"],
};
