import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";
import { savePress, getPress } from "@/lib/db";
import { LIMITS } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, items: await getPress() });
}

/** Replace-all. The list is short and always saved as a whole, so a diff
 *  would be more machinery than the problem deserves. */
export async function PUT(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ ok: false, error: "Expected a list" }, { status: 400 });
    }
    await savePress(
      items.slice(0, 40).map((it: Record<string, unknown>, i: number) => ({
        kind: String(it.kind ?? "").slice(0, 30),
        outlet: String(it.outlet ?? "").trim().slice(0, LIMITS.pressOutlet),
        note: String(it.note ?? "").trim().slice(0, LIMITS.pressNote),
        url: it.url ? String(it.url).slice(0, 400) : undefined,
        pending: Boolean(it.pending),
        sort: i + 1,
      }))
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
