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

export type Video = {
  id: string;          // row id
  youtubeId: string;   // extracted from whatever URL was pasted
  title: string;       // auto-fetched from YouTube, editable
  blurb: string;       // 2-3 sentences, capped in the dashboard
  topic: Topic;
  featured: boolean;   // max 4 on the homepage
  published: boolean;
  sort: number;
};

/** Any YouTube URL shape -> the 11-char id. */
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : url.match(/^[\w-]{11}$/) ? url : null;
}

export function thumbnail(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function topicSlug(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * PLACEHOLDER CONTENT — replace with the Supabase query once the dashboard is
 * built. Real videos come from Chris's channel; these exist so the layout can
 * be reviewed on Sept 11 without waiting on his content pass.
 */
export const PLACEHOLDER: Video[] = [
  {
    id: "1", youtubeId: "", topic: "Lender Lies", featured: true, published: true, sort: 1,
    title: "The rate is not the deal",
    blurb: "Why the number everyone shops for is the one that matters least, and what to look at instead.",
  },
  {
    id: "2", youtubeId: "", topic: "Buying a Home", featured: true, published: true, sort: 2,
    title: "What you actually need to close",
    blurb: "Down payment myths, what underwriting really looks at, and the timeline nobody explains up front.",
  },
  {
    id: "3", youtubeId: "", topic: "Building Wealth", featured: true, published: true, sort: 3,
    title: "Your house is not your plan",
    blurb: "Equity, leverage, and the difference between owning something and building something.",
  },
];
