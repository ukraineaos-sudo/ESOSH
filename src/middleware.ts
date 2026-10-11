import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { ADMIN_SESSION_COOKIE, hasAdminSessionCookie } from "./lib/admin/auth-cookie";
import { shouldBlockSearchIndexing } from "./lib/seo-host";

const intlMiddleware = createMiddleware(routing);

function withSearchIndexingPolicy(request: NextRequest, response: NextResponse): NextResponse {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  if (shouldBlockSearchIndexing(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

/** RU: Admin без locale + защита cookie; остальное — next-intl. EN: Protect /admin then run next-intl. */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/login" || pathname.startsWith("/api/admin/login/")) {
      return NextResponse.next();
    }
    if (!hasAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return withSearchIndexingPolicy(request, NextResponse.next());
    }
    if (!hasAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", pathname);
      return withSearchIndexingPolicy(request, NextResponse.redirect(login));
    }
    return withSearchIndexingPolicy(request, NextResponse.next());
  }

  return withSearchIndexingPolicy(request, intlMiddleware(request));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
