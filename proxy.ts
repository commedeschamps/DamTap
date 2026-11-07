import { NextResponse, type NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE, DEMO_SESSION_HEADER, demoSessionStart } from "./lib/demo-session";

export function proxy(request: NextRequest) {
  const previous = request.cookies.get(DEMO_SESSION_COOKIE)?.value;
  const start = String(demoSessionStart(previous, Date.now()));
  const headers = new Headers(request.headers);
  // Overwrite caller-provided values; the initial render and later routes share one clock.
  headers.set(DEMO_SESSION_HEADER, start);
  const response = NextResponse.next({ request: { headers } });
  if (previous !== start) response.cookies.set(DEMO_SESSION_COOKIE, start, {
    httpOnly: true, sameSite: "lax", path: "/", secure: request.nextUrl.protocol === "https:",
  });
  return response;
}

export const config = { matcher: ["/", "/offers/:path*"] };
