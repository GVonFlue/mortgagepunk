import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";
import { ALL_SLOTS } from "@/lib/images";

export const runtime = "nodejs";

/**
 * Upload a replacement photograph for one named section slot.
 *
 * SEPARATE FROM /api/backstage/upload ON PURPOSE. That route is for the hero
 * headline artwork: PNG only, and it checks the alpha channel, because the
 * headline sits over a photo and behind Chris. Section photos are ordinary
 * photographs — forcing PNG on them would turn a 400KB JPEG into a 4MB file
 * for no gain. Relaxing the rule on the existing route would have quietly
 * weakened the check the hero depends on, so this is its own endpoint.
 *
 * Slots that genuinely need a cut-out are marked needsTransparency in the
 * registry, and this route enforces PNG for exactly those.
 *
 * Filenames are timestamped so replacing a photo never fights the CDN cache —
 * re-uploading to the same path is the classic "I changed it but the old one
 * is still there" trap, and it is maddening to diagnose from the outside.
 */
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const form = await req.formData();
    const file = form.get("file");
    const slotKey = String(form.get("slot") ?? "");

    // "wall" is the Movement wall: not a fixed spot on a page but a new tile,
    // so it has no entry in the slot registry. Same checks otherwise.
    const slot =
      slotKey === "wall"
        ? { key: "wall", needsTransparency: false }
        : ALL_SLOTS.find((s) => s.key === slotKey);
    if (!slot) {
      return NextResponse.json(
        { ok: false, error: `Unknown photo slot "${slotKey}".` },
        { status: 400 }
      );
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { ok: false, error: "That file type isn't supported. Use a JPG, PNG or WebP." },
        { status: 400 }
      );
    }
    if (slot.needsTransparency && file.type !== "image/png") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "This spot needs a cut-out with a transparent background, so it has to be a PNG. A JPG will show up inside a white box.",
        },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: `That's ${(file.size / 1048576).toFixed(1)}MB. Keep it under 8MB so the page stays fast.`,
        },
        { status: 400 }
      );
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path =
      slot.key === "wall"
        ? `wall/${Date.now()}.${ext}`
        : `sections/${slot.key}-${Date.now()}.${ext}`;
    const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_KEY ?? "";

    const headers: Record<string, string> = {
      apikey: key,
      "Content-Type": file.type,
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
