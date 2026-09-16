import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";
import { saveTalks, getTalks } from "@/lib/db";
import { LIMITS } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, items: await getTalks() });
}

export async function PUT(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ ok: false, error: "Expected a list" }, { status: 400 });
    }
    await saveTalks(
      items.slice(0, 20).map((it: Record<string, unknown>, i: number) => ({
        title: String(it.title ?? "").trim().slice(0, LIMITS.talkTitle),
        blurb: String(it.blurb ?? "").trim().slice(0, LIMITS.talkBlurb),
        sort: i + 1,
      }))
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
