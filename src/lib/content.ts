/**
 * Content store for everything Chris edits in /backstage.
 *
 * Backed by Supabase when SUPABASE_URL and SUPABASE_SERVICE_KEY are set.
 * Without them the app falls back to the seed data below so the whole
 * dashboard is browsable and reviewable before the database exists — writes
 * just don't persist, and every screen says so.
 *
 * Run supabase-schema.sql (repo root) to create the tables.
 * Both env vars are server-side only. Never NEXT_PUBLIC_.
 */

/**
 * Chris's ten topics, verbatim from onboarding.
 *
 * These are now only the SEED and the fallback. The live list lives in the
 * library_topics table and Chris edits it in /backstage → Topics, because a
 * hardcoded list means every new category is a code change.
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

export type LibraryTopic = { id: string; name: string; sort: number };

export type Video = {
  id: string;
  youtube_id: string;
  title: string;
  blurb: string;
  /** A video can belong to several topics — plenty of them straddle two. */
  topics: string[];
  featured: boolean;
  published: boolean;
  sort: number;
};

export type PressItem = {
  id: string;
  kind: string;
  outlet: string;
  note: string;
  url?: string;
  pending: boolean;
  sort: number;
};

export type Talk = { id: string; title: string; blurb: string; sort: number };

export type Conference = {
  headline: string;
  date_label: string;
  venue: string;
  keynote: string;
  blurb: string;
  stats: { value: string; label: string }[];
  prizes: string[];
  url: string;
};

export type Announcement = { enabled: boolean; text: string; href: string };

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  featured: boolean;
  published: boolean;
  sort: number;
};

export type Hero = {
  /** Uploaded headline artwork. When art_url is set it replaces the type
   *  lines entirely — same position, same scale, still behind Chris. */
  art_url?: string | null;
  art_w?: number | null;
  art_h?: number | null;
  art_mobile_url?: string | null;
  art_mobile_w?: number | null;
  art_mobile_h?: number | null;
  /** Width on the 1512-wide stage. 1030 matches the current headline. */
  art_width_units?: number | null;
  art_top_units?: number | null;

  eyebrow: string;
  line_small: string;
  line_big: string;
  line_accent: string;
  rail_top: string;
  rail_hit: string;
  rail_bottom: string;
  cta1_label: string;
  cta1_href: string;
  cta2_label: string;
  cta2_href: string;
  nav_cta_label: string;
  nav_cta_href: string;
};

export type Lead = {
  id: string;
  first: string;
  last: string;
  email: string;
  phone: string;
  intent: string;
  notes: string;
  source: string;
  created_at: string;
};

/** True when a real database is wired up. Screens use this to warn honestly. */
export function isConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

/** Any YouTube URL shape -> the 11-char id. */
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  if (m) return m[1];
  return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
}

export function thumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function topicSlug(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Field caps. Enforced in the UI so no entry can break a layout. */
/**
 * Hero fit reference.
 *
 * The hero is a fixed 1512x900 stage with white-space:nowrap, so a long word
 * doesn't wrap — it runs off the edge and breaks the composition. Hero.tsx
 * scales each line down when it exceeds these lengths, so nothing can overflow;
 * these are the point past which the type starts getting visibly smaller.
 */
export const HERO_FIT = {
  eyebrow: 13,
  line_small: 5,
  line_big: 8,
  line_accent: 6,
};

export const LIMITS = {
  heroLine: 16,
  heroRail: 44,
  ctaLabel: 34,
  topicName: 46,
  testimonialName: 48,
  testimonialRole: 60,
  testimonialQuote: 420,
  videoTitle: 70,
  videoBlurb: 220,
  pressOutlet: 44,
  pressNote: 150,
  talkTitle: 54,
  talkBlurb: 180,
  announcement: 90,
};

// ---------------------------------------------------------------------------
// SEED DATA — shown until Supabase is configured
// ---------------------------------------------------------------------------


/** Only shown before the database is reachable. */
export const SEED_VIDEOS: Video[] = [];

export const SEED_TOPICS: LibraryTopic[] = TOPICS.map((name, i) => ({
  id: `seed-${i}`,
  name,
  sort: i + 1,
}));

export const SEED_PRESS: PressItem[] = [
  { id: "p1", kind: "Feature", outlet: "Wichita Real Producers", pending: false, sort: 1,
    note: "Feature story on Chris Waipa and the rise of Mortgage Punk." },
  { id: "p2", kind: "Recognition", outlet: "Scotsman Guide", pending: false, sort: 2,
    note: "Top Originator recognition." },
  { id: "p3", kind: "Broadcast", outlet: "KSN", pending: false, sort: 3,
    note: "Coverage of Mortgage Punk and the American Dream Conference." },
  { id: "p4", kind: "Pending", outlet: "The Wall Street Journal", pending: true, sort: 4,
    note: "Held back until the appearance is verified and linked." },
];

export const SEED_TALKS: Talk[] = [
  { id: "t1", sort: 1, title: "Reimagining the American Dream",
    blurb: "Why the American Dream isn't dead, and why today's generation needs the tools and the freedom to redefine it." },
  { id: "t2", sort: 2, title: "The Game of Money",
    blurb: "The rules around money, homeownership, investing, taxes, income and wealth that most people were never taught." },
  { id: "t3", sort: 3, title: "Living Beyond a Paycheck",
    blurb: "Moving past simply earning income toward ownership, assets, opportunity and freedom." },
  { id: "t4", sort: 4, title: "Building the Impossible",
    blurb: "Chris's story, Mortgage Punk, and challenging people to rethink what they believe is possible." },
  { id: "t5", sort: 5, title: "Disrupting a Commodity Business",
    blurb: "How personality, community, education and culture turn a commodity service into something people actually want to belong to." },
];

export const SEED_CONFERENCE: Conference = {
  headline: "The American Dream Conference",
  date_label: "October 16-17, 2027",
  venue: "Hyatt Regency · Wichita, Kansas",
  keynote: "Hannah Hammond",
  blurb: "Not a sit-in-a-chair seminar. Real education, real connections, and the volume all the way up.",
  stats: [
    { value: "3", label: "Keynotes" },
    { value: "15", label: "Breakouts" },
    { value: "1", label: "Live concert" },
  ],
  prizes: [
    "Full kitchen remodel, given away live",
    "A brand new roof",
    "New HVAC system",
    "Interior and exterior paint job",
    "One month of mortgage payments",
  ],
  url: "https://mortgagepunklive.com",
};

export const SEED_ANNOUNCEMENT: Announcement = {
  enabled: false,
  text: "Tickets for the American Dream Conference are on sale now.",
  href: "https://mortgagepunklive.com",
};

export const SEED_HERO: Hero = {
  art_url: null,
  art_w: null,
  art_h: null,
  art_mobile_url: null,
  art_mobile_w: null,
  art_mobile_h: null,
  art_width_units: 1030,
  art_top_units: 96,
  eyebrow: "Reimagining",
  line_small: "The",
  line_big: "American",
  line_accent: "Dream",
  rail_top: "Loan Officer.",
  rail_hit: "Leading a Movement.",
  rail_bottom: "Building a World-Class Lending Team.",
  cta1_label: "Get Approved the Right Way",
  cta1_href: "/get-approved",
  cta2_label: "Follow the Movement",
  cta2_href: "/movement",
  nav_cta_label: "Get Approved",
  nav_cta_href: "/get-approved",
};

export const SEED_TESTIMONIALS: Testimonial[] = [];

export const SEED_LEADS: Lead[] = [];
