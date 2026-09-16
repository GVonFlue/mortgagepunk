import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Gate for /backstage.
 *
 * The secret path is only obscurity — one forwarded link and it's public. The
 * real protection is this check. Both together: not discoverable, and not
 * usable if discovered.
 *
 * EDGE RUNTIME. Middleware does not run on Node, so there is no `crypto`
 * module and no `Buffer` here. Verification uses Web Crypto (crypto.subtle),
 * which is available in Edge and produces a byte-identical HMAC-SHA256 to the
 * Node `createHmac` used in lib/auth.ts when the token is issued.
 *
 * Do not import from lib/auth.ts in this file — it pulls in node:crypto and
 * the middleware will crash on invocation.
 */
const COOKIE = "mp_backstage";

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Length-safe, data-independent compare. No Buffer in Edge, so do it by hand. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function valid(token: string | undefined, secret: string): Promise<boolean> {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(`${exp}.${nonce}`));
  if (!safeEqual(toHex(mac), sig)) return false;

  return Number(exp) > Date.now();
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // the login screen itself must stay reachable
  if (pathname === "/backstage") return NextResponse.next();

  if (pathname.startsWith("/backstage")) {
    let ok = false;
    try {
      ok = await valid(req.cookies.get(COOKIE)?.value, process.env.BACKSTAGE_SECRET ?? "");
    } catch {
      // a verification failure is a failed login, never a 500
      ok = false;
    }
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
