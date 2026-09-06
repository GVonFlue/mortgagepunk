import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";
import { getHero, saveHero } from "@/lib/db";
import { LIMITS } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, hero: await getHero() });
}

/** Internal paths or full URLs only — no javascript: or data: schemes. */
function safeHref(v: unknown, fallback: string): string {
  const s = String(v ?? "").trim().slice(0, 300);
  if (!s) return fallback;
  if (s.startsWith("/") || s.startsWith("https://") || s.startsWith("http://")) return s;
  return fallback;
}

export async function PUT(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const h = await req.json();
    const line = (v: unknown, d: string) =>
      String(v ?? "").trim().slice(0, LIMITS.heroLine) || d;
    const rail = (v: unknown, d: string) =>
      String(v ?? "").trim().slice(0, LIMITS.heroRail) || d;
    const label = (v: unknown, d: string) =>
      String(v ?? "").trim().slice(0, LIMITS.ctaLabel) || d;

    const url = (v: unknown) => {
      const s = String(v ?? "").trim();
      return s.startsWith("http") ? s.slice(0, 600) : null;
    };
    const num = (v: unknown, d: number | null) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? Math.round(n) : d;
    };

    await saveHero({
      art_url: url(h.art_url),
      art_w: num(h.art_w, null),
      art_h: num(h.art_h, null),
      art_mobile_url: url(h.art_mobile_url),
      art_mobile_w: num(h.art_mobile_w, null),
      art_mobile_h: num(h.art_mobile_h, null),
      // clamped so the art can't be scaled outside the composition
      art_width_units: Math.min(1420, Math.max(300, num(h.art_width_units, 1030) ?? 1030)),
      art_top_units: Math.min(400, Math.max(20, num(h.art_top_units, 96) ?? 96)),
      // every field falls back to the current wording rather than going blank —
      // an empty hero line would leave a hole in the composition
      eyebrow: line(h.eyebrow, "Reimagining"),
      line_small: line(h.line_small, "The"),
      line_big: line(h.line_big, "American"),
      line_accent: line(h.line_accent, "Dream"),
      rail_top: rail(h.rail_top, "Loan Officer."),
      rail_hit: rail(h.rail_hit, "Leading a Movement."),
      rail_bottom: rail(h.rail_bottom, "Building a World-Class Lending Team."),
      cta1_label: label(h.cta1_label, "Get Approved the Right Way"),
      cta1_href: safeHref(h.cta1_href, "/get-approved"),
      cta2_label: label(h.cta2_label, "Follow the Movement"),
      cta2_href: safeHref(h.cta2_href, "/movement"),
      nav_cta_label: label(h.nav_cta_label, "Get Approved"),
      nav_cta_href: safeHref(h.nav_cta_href, "/get-approved"),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
