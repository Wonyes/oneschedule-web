import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "@/src/lib/refreshAccessToken";

function applyRefreshedCookies(
  response: NextResponse,
  refreshed: Response,
) {
  refreshed.headers.getSetCookie().forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
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
      return applyRefreshedCookies(NextResponse.next(), refreshed);
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
