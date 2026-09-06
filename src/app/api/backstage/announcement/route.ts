import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";
import { saveAnnouncement, getAnnouncement } from "@/lib/db";
import { LIMITS } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, announcement: await getAnnouncement() });
}

export async function PUT(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const a = await req.json();
    await saveAnnouncement({
      enabled: Boolean(a.enabled),
      text: String(a.text ?? "").trim().slice(0, LIMITS.announcement),
      href: String(a.href ?? "").trim().slice(0, 400),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
