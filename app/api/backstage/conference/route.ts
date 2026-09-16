import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";
import { saveConference, getConference } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, conference: await getConference() });
}

export async function PUT(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const c = await req.json();
    await saveConference({
      headline: String(c.headline ?? "").slice(0, 44),
      date_label: String(c.date_label ?? "").slice(0, 30),
      venue: String(c.venue ?? "").slice(0, 54),
      keynote: String(c.keynote ?? "").slice(0, 40),
      blurb: String(c.blurb ?? "").slice(0, 170),
      // exactly three tiles — the layout is a three-column grid
      stats: (Array.isArray(c.stats) ? c.stats : []).slice(0, 3).map(
        (s: Record<string, unknown>) => ({
          value: String(s.value ?? "").slice(0, 4),
          label: String(s.label ?? "").slice(0, 18),
        })
      ),
      prizes: (Array.isArray(c.prizes) ? c.prizes : [])
        .slice(0, 8)
        .map((p: unknown) => String(p).slice(0, 60))
        .filter(Boolean),
      url: String(c.url ?? "").slice(0, 400),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
