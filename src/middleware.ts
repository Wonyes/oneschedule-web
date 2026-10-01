import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "@/src/lib/refreshAccessToken";

function parseCookiePair(setCookie: string): [string, string] | null {
  const pair = setCookie.split(";")[0];
  const eq = pair.indexOf("=");

  if (eq <= 0) return null;

  return [pair.slice(0, eq).trim(), pair.slice(eq + 1)];
}

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
    const refreshed = await tryRefreshToken(request);

    if (refreshed) {
      return applyRefreshedCookies(request, refreshed);
    }

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
  matcher: [
    "/",
    "/login",
    "/sign",
    "/schedule",
    "/group",
    "/group/:path*",
    "/profile",
  ],
};
