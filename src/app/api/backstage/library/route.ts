import { NextResponse } from "next/server";
import { guard, fail } from "../_guard";
import { createVideo, updateVideo, deleteVideo, featuredCount, getVideos } from "@/lib/db";
import { LIMITS, youtubeId } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, videos: await getVideos() });
}

export async function POST(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const b = await req.json();

    // Re-validate server-side. The UI caps these too, but the UI is only a
    // suggestion once someone knows the endpoint exists.
    const vid = youtubeId(String(b.youtube_id ?? b.url ?? ""));
    if (!vid) {
      return NextResponse.json({ ok: false, error: "Not a valid YouTube link" }, { status: 400 });
    }
    const title = String(b.title ?? "").trim().slice(0, LIMITS.videoTitle);
    const blurb = String(b.blurb ?? "").trim().slice(0, LIMITS.videoBlurb);
    if (!title || !blurb) {
      return NextResponse.json({ ok: false, error: "Title and blurb are required" }, { status: 400 });
    }

    let featured = Boolean(b.featured);
    if (featured && (await featuredCount()) >= 4) featured = false;

    const row = await createVideo({
      youtube_id: vid,
      title,
      blurb,
      topic: String(b.topic ?? ""),
      featured,
      published: b.published !== false,
      sort: Number(b.sort ?? 0),
    });
    return NextResponse.json({ ok: true, video: row });
  } catch (e) {
    return fail(e);
  }
}

export async function PATCH(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const { id, ...patch } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

    if (patch.featured === true && (await featuredCount()) >= 4) {
      return NextResponse.json(
        { ok: false, error: "Only four videos can sit on the homepage." },
        { status: 400 }
      );
    }
    if (typeof patch.title === "string") patch.title = patch.title.slice(0, LIMITS.videoTitle);
    if (typeof patch.blurb === "string") patch.blurb = patch.blurb.slice(0, LIMITS.videoBlurb);

    await updateVideo(id, patch);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    await deleteVideo(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
