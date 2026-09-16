import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";

export const runtime = "nodejs";

/**
 * Upload hero artwork to Supabase Storage.
 *
 * PNG only, and that is deliberate rather than lazy: the headline sits over a
 * photographic background and behind Chris, so it must have a real alpha
 * channel. A JPG would arrive with a white box around it and look broken in a
 * way that is confusing to diagnose.
 *
 * Filenames are timestamped so a re-upload never has to fight the CDN cache —
 * replacing art at the same path is the classic "I uploaded it but the old one
 * is still showing" trap.
 */
const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const form = await req.formData();
    const file = form.get("file");
    const slot = String(form.get("slot") ?? "desktop");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
    }
    if (file.type !== "image/png") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "PNG only. The headline sits over a photo and behind Chris, so it needs a transparent background — a JPG will show up with a white box around it.",
        },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: `That's ${(file.size / 1048576).toFixed(1)}MB. Keep it under 6MB.` },
        { status: 400 }
      );
    }

    const stamp = Date.now();
    const path = `hero/${slot}-${stamp}.png`;
    const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_KEY ?? "";

    const headers: Record<string, string> = {
      apikey: key,
      "Content-Type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    };
    // sb_secret_ keys are not JWTs — sending one as a Bearer token fails.
    if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;

    const buf = Buffer.from(await file.arrayBuffer());
    const up = await fetch(`${base}/storage/v1/object/brand/${path}`, {
      method: "POST",
      headers,
      body: buf,
    });

    if (!up.ok) {
      const detail = await up.text().catch(() => "");
      throw new Error(`Storage ${up.status}: ${detail.slice(0, 240)}`);
    }

    return NextResponse.json({
      ok: true,
      url: `${base}/storage/v1/object/public/brand/${path}`,
    });
  } catch (e) {
    return fail(e);
  }
}
