import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const session = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Si l'utilisateur va sur /poll sans etre connecte → login
  if (pathname.startsWith("/poll") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si l'utilisateur est connecte et va sur login/register → poll
  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      return NextResponse.redirect(new URL("/poll", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/poll/:path*", "/login", "/register"],
};