import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access-token");

  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [];
  const protectedRoutes2 = ["/sign", "/login"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isProtected2 = protectedRoutes2.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isProtected2 && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/sign"],
};
