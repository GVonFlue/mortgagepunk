import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Gate for /backstage.
 *
 * The secret path is only obscurity — one forwarded link and it's public. The
 * real protection is this check. Both together: not discoverable, and not
 * usable if discovered.
 *
 * Verification is inlined rather than imported so this stays inside the Edge
 * runtime's constraints.
 */
const COOKIE = "mp_backstage";

function valid(token: string | undefined, secret: string): boolean {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  const expected = createHmac("sha256", secret).update(`${exp}.${nonce}`).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // the login screen itself must stay reachable
  if (pathname === "/backstage") return NextResponse.next();

  if (pathname.startsWith("/backstage")) {
    const ok = valid(req.cookies.get(COOKIE)?.value, process.env.BACKSTAGE_SECRET ?? "");
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/backstage";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/backstage/:path*"] };
