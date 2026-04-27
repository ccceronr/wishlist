import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set(["/login", "/register"]);
const PUBLIC_PATTERNS = [/^\/u\//];

function isPublicRoute(pathname: string) {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  return PUBLIC_PATTERNS.some((pattern) => pattern.test(pathname));
}

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const isPublic = isPublicRoute(nextUrl.pathname);

  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAuthenticated && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon\\.ico).*)"],
};
