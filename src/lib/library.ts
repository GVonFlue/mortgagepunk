// Topic names live in the library_topics table and are edited in
// /backstage → Topics. TOPICS in lib/content.ts is only the seed list.
export { TOPICS } from "./content";

/**
 * The education library.
 *
 * Chris's ten topics, verbatim from onboarding — his language, not generic
 * industry categories. Do not rename or reorder without asking him.
 *
 * Videos live on YouTube and are embedded. Nothing is uploaded to the site, so
 * the library can grow forever without costing storage. Thumbnails are derived
 * from the YouTube ID, which is why the dashboard never asks for an image.
 */


/**
 * NOTE: video records and all reads now live in lib/db.ts, backed by Supabase.
 * This file keeps only the shared constants and pure helpers so both the
 * public pages and the dashboard import the same topic list and the same
 * YouTube-id parsing.
 */

/** Any YouTube URL shape -> the 11-char id. */
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  if (m) return m[1];
  return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
}

export function thumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

/** 640x480. Like hqdefault it has letterbox bars baked in, but at a size
 *  that holds up across a full-width feature. Always generated. */
export function thumbnailSd(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/sddefault.jpg`;
}

/**
 * The same thumbnail at 1280x720, for anywhere it runs wider than a card.
 *
 * hqdefault is 480x360 — a 4:3 frame with letterbox bars baked into the
 * pixels, which is invisible at card size and obvious across a full-width
 * feature. maxresdefault is true 16:9 with no bars, but YouTube only makes it
 * for uploads with a high-resolution source.
 *
 * IT DOES NOT 404 WHEN IT IS MISSING. YouTube answers 200 with a 120x90 grey
 * placeholder, so an onError handler never fires and that 120px image gets
 * stretched across the whole feature — which is exactly what happened to
 * "Mortgage Punk in 2 Minutes". The only reliable test is the decoded width.
 * See VideoArt.tsx.
 */
export function thumbnailLarge(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
}

export function topicSlug(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
