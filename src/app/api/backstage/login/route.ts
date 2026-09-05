import { NextResponse } from "next/server";
import { COOKIE, passwordMatches, issueToken } from "@/lib/auth";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Small fixed delay: makes brute-forcing over the network slow and hides any
  // residual timing difference in the comparison.
  await new Promise((r) => setTimeout(r, 350));

  if (!passwordMatches(body.password ?? "")) {
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }

  const { value, maxAge } = issueToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
