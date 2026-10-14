import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";
import { getImages, saveImage, clearImage } from "@/lib/db";
import { ALL_SLOTS } from "@/lib/images";

export const runtime = "nodejs";

/**
 * Read and write the per-slot photo overrides.
 *
 * The slot is validated against the registry rather than trusted, so a typo
 * or a stale tab cannot write a row that nothing will ever read — a row like
 * that is invisible in Backstage and looks exactly like "my upload didn't
 * save".
 *
 * DELETE removes the override and the slot falls back to the file that
 * shipped with the build, which is how "put the original back" works. There
 * is no separate reset flag to keep in sync.
 */
export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, images: await getImages() });
}

export async function PUT(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const body = await req.json();
    const slot = String(body.slot ?? "");

    if (!ALL_SLOTS.some((s) => s.key === slot)) {
      return NextResponse.json(
        { ok: false, error: `Unknown photo slot "${slot}".` },
        { status: 400 }
      );
    }
    const url = String(body.url ?? "").slice(0, 600);
    if (!url) {
      return NextResponse.json({ ok: false, error: "No image URL" }, { status: 400 });
    }

    await saveImage({
      slot,
      url,
      // Stored so the live page can reserve the right box before the picture
      // arrives. Null is tolerated — pickImage falls back to the slot's shape.
      w: Number.isFinite(Number(body.w)) ? Number(body.w) : null,
      h: Number.isFinite(Number(body.h)) ? Number(body.h) : null,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const slot = new URL(req.url).searchParams.get("slot") ?? "";
    if (!ALL_SLOTS.some((s) => s.key === slot)) {
      return NextResponse.json(
        { ok: false, error: `Unknown photo slot "${slot}".` },
        { status: 400 }
      );
    }
    await clearImage(slot);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
