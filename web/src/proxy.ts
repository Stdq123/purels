import { NextResponse, type NextRequest } from "next/server";

// The root layout needs the URL's language before the page renders. Never trust
// a client-supplied value of this internal header on the landing routes.
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete("x-purels-landing-locale");
  if (request.nextUrl.pathname === "/i18n/en") headers.set("x-purels-landing-locale", "en");
  if (request.nextUrl.pathname === "/i18n/zh-CN") headers.set("x-purels-landing-locale", "zh-CN");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/", "/i18n/:path*"] };
