import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guard, fail } from "../_guard";
import { getSocialTiles, saveSocialTiles } from "@/lib/db";
import {
  cleanPostLink, isWallShape, WALL_LIMITS, type SocialTile,
} from "@/lib/socialTiles";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, items: await getSocialTiles() });
}

/**
 * Save the whole wall, in order.
 *
 * Everything is checked again here rather than trusted from the editor: the
 * picture has to be one of ours (a file that shipped with the site, or one
 * uploaded through Backstage into Supabase storage), the link is cleaned the
 * same way the editor cleans it, and the shape has to be one the wall knows.
 * A bad link is refused with the tile's position, so the message says which
 * one to fix.
 */
export async function PUT(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ ok: false, error: "Expected a list" }, { status: 400 });
    }
    if (items.length > WALL_LIMITS.tiles) {
      return NextResponse.json(
        { ok: false, error: `That's ${items.length} pictures. The wall takes up to ${WALL_LIMITS.tiles}.` },
        { status: 400 }
      );
    }

    const storage = `${process.env.SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public/brand/`;
    const seen = new Set<string>();
    const clean: SocialTile[] = [];

    for (let i = 0; i < items.length; i++) {
      const it = items[i] as Record<string, unknown>;
      const n = i + 1;
      const src = String(it.src ?? "").trim();
      if (!(src.startsWith("/brand/") || src.startsWith(storage))) {
        return NextResponse.json(
          { ok: false, error: `Picture ${n} isn't one that was uploaded here. Upload it again.` },
          { status: 400 }
        );
      }
      let href: string | null;
      try {
        href = cleanPostLink(String(it.href ?? ""));
      } catch (e) {
        return NextResponse.json(
          { ok: false, error: `Picture ${n}: ${e instanceof Error ? e.message : "bad link"}` },
          { status: 400 }
        );
      }
      // New tiles arrive with a temporary id from the editor; give them a
      // real one. Seeded tiles keep their file-name ids.
      let id = String(it.id ?? "").trim().slice(0, 80);
      if (!id || id.startsWith("tmp-") || seen.has(id) || !/^[A-Za-z0-9_-]+$/.test(id)) {
        id = crypto.randomUUID();
      }
      seen.add(id);
      clean.push({
        id,
        sort: n,
        src,
        alt: String(it.alt ?? "").trim().slice(0, WALL_LIMITS.alt) || "Mortgage Punk on Instagram",
        shape: isWallShape(it.shape) ? it.shape : "reel",
        href,
        hidden: it.hidden === true,
      });
    }

    if (!clean.some((t) => !t.hidden)) {
      return NextResponse.json(
        { ok: false, error: "At least one picture has to stay on the wall." },
        { status: 400 }
      );
    }

    await saveSocialTiles(clean);
    // The home page is cached for five minutes; this makes the change show on
    // the next visit instead.
    revalidatePath("/");
    return NextResponse.json({ ok: true, items: clean });
  } catch (e) {
    return fail(e);
  }
}
