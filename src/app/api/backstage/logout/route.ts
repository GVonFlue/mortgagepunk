import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth";

// Node runtime: lib/auth.ts uses node:crypto to issue the token.
export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
