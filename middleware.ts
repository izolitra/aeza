import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/src/shared/config";

const PUBLIC_FILE = /\.[^/]+$/;
const AVAILABLE_LOCALIZED_PATHS = new Set(["", "/login", "/overview", "/profile"]);

function isPublicFile(pathname: string): boolean {
  return PUBLIC_FILE.test(pathname);
}

function hasLocalePrefix(pathname: string): boolean {
  return locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

function isIgnoredPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    isPublicFile(pathname)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isIgnoredPath(pathname)) {
    return NextResponse.next();
  }

  if (hasLocalePrefix(pathname)) {
    const locale = locales.find(
      (candidate) =>
        pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`)
    );
    const localizedPath = locale
      ? pathname.slice(`/${locale}`.length).replace(/\/$/, "")
      : "";

    if (AVAILABLE_LOCALIZED_PATHS.has(localizedPath)) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/overview`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
