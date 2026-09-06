import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";
import { getTopics, saveTopics, renameTopic } from "@/lib/db";
import { LIMITS } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, topics: await getTopics() });
}

export async function PUT(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ ok: false, error: "Expected a list" }, { status: 400 });
    }

    // de-duplicate: name is the unique key, and a clash would fail the whole
    // insert, which just looks like "saving is broken"
    const seen = new Set<string>();
    const clean: { name: string; sort: number }[] = [];
    for (const it of items.slice(0, 40)) {
      const name = String((it as Record<string, unknown>).name ?? "")
        .trim()
        .slice(0, LIMITS.topicName);
      if (!name || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      clean.push({ name, sort: clean.length + 1 });
    }

    await saveTopics(clean);
    return NextResponse.json({ ok: true, count: clean.length });
  } catch (e) {
    return fail(e);
  }
}

/** Rename a topic and carry every video that used it across with it. */
export async function PATCH(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const { from, to } = await req.json();
    if (!from || !to) {
      return NextResponse.json({ ok: false, error: "Need both names" }, { status: 400 });
    }
    const moved = await renameTopic(
      String(from),
      String(to).trim().slice(0, LIMITS.topicName)
    );
    return NextResponse.json({ ok: true, moved });
  } catch (e) {
    return fail(e);
  }
}
