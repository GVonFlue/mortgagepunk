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

export const TOPICS = [
  "The Game of Money",
  "Buying a Home",
  "Getting a Mortgage the Right Way",
  "Building Wealth",
  "Living Beyond a Paycheck",
  "Real Estate Investing",
  "Taxes + Keeping More of Your Money",
  "Lender Lies",
  "Saved Loans / Real Stories",
  "Reimagining the American Dream",
] as const;

export type Topic = (typeof TOPICS)[number];

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

export function topicSlug(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
