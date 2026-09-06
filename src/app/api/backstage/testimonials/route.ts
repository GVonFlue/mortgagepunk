import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";
import { getTestimonials, saveTestimonials } from "@/lib/db";
import { LIMITS } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, items: await getTestimonials() });
}

export async function PUT(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ ok: false, error: "Expected a list" }, { status: 400 });
    }

    // Max three on the homepage — the grid is three across and a fourth
    // would silently wrap into a lonely second row.
    let featured = 0;
    const clean = items.slice(0, 200).map((it: Record<string, unknown>, i: number) => {
      const wantsFeature = Boolean(it.featured);
      const canFeature = wantsFeature && featured < 3;
      if (canFeature) featured++;
      return {
        name: String(it.name ?? "").trim().slice(0, LIMITS.testimonialName),
        role: String(it.role ?? "").trim().slice(0, LIMITS.testimonialRole),
        quote: String(it.quote ?? "").trim().slice(0, LIMITS.testimonialQuote),
        rating: Math.min(5, Math.max(1, Number(it.rating ?? 5))),
        featured: canFeature,
        published: it.published !== false,
        sort: i + 1,
      };
    }).filter((t) => t.name && t.quote);

    await saveTestimonials(clean);
    return NextResponse.json({ ok: true, count: clean.length });
  } catch (e) {
    return fail(e);
  }
}
