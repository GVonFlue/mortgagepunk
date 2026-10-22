/**
 * The Movement wall: the tiles under "The Movement" on the home page.
 *
 * SAFE TO IMPORT ANYWHERE. Types, the seed set and the link rules only — no
 * database access — so Backstage's client editor and the server share one
 * definition of what a tile is and what counts as a valid link.
 *
 * WHERE THE TILES COME FROM. The social_tiles table, edited in Backstage →
 * Movement wall (see supabase-migration-social-tiles.sql). Until that table
 * exists, or if it is empty or unreachable, the wall renders SEED_SOCIAL_TILES
 * below — which is exactly the wall as it shipped. Nothing about the page
 * depends on the migration having been run.
 *
 * WHY NOT A LIVE INSTAGRAM FEED. That needs a Meta app, a business or creator
 * account and a token that has to be renewed every 60 days, and Instagram's
 * own image links expire. Picking posts by hand has nothing that can lapse,
 * and a live picker can still be added on top of this later — it would only
 * write rows into the same table.
 */

export type WallShape = "square" | "portrait" | "tallish" | "reel";

export type SocialTile = {
  id: string;
  sort: number;
  src: string;
  alt: string;
  shape: WallShape;
  /** The post. Null means the tile opens the profile instead. */
  href: string | null;
  hidden: boolean;
};

export const INSTAGRAM_PROFILE = "https://www.instagram.com/mortgagepunk";

/** In the order Backstage offers them, tallest first, with plain names. */
export const WALL_SHAPES: { key: WallShape; label: string; ratio: number }[] = [
  { key: "reel", label: "Tall (reel, 9:16)", ratio: 9 / 16 },
  { key: "tallish", label: "Tall-ish (3:4)", ratio: 3 / 4 },
  { key: "portrait", label: "Portrait (4:5)", ratio: 4 / 5 },
  { key: "square", label: "Square", ratio: 1 },
];

export function isWallShape(v: unknown): v is WallShape {
  return WALL_SHAPES.some((s) => s.key === v);
}

/** The shape nearest a picture's own proportions, so its lettering survives
 *  the crop. Used to pre-pick the shape when a new picture is uploaded. */
export function nearestShape(w: number, h: number): WallShape {
  if (!w || !h) return "reel";
  const r = w / h;
  let best = WALL_SHAPES[0];
  for (const s of WALL_SHAPES) {
    if (Math.abs(s.ratio - r) < Math.abs(best.ratio - r)) best = s;
  }
  return best.key;
}

/**
 * Turn whatever got pasted into the post's clean address.
 *
 * Instagram's share button hands out links with tracking on the end
 * (?igsh=..., ?utm_source=...) and with or without the account name in the
 * path. All of them open the same post, so they are reduced to the one short
 * form: https://www.instagram.com/p/CODE/ or /reel/CODE/.
 *
 * Anything else that is a real https address (a TikTok, a YouTube Short) is
 * kept as it is: the wall is Chris's, and where a tile leads is his call.
 * Returns null for an empty field (the tile opens the profile) and throws a
 * plain-English message for something that is not a link at all.
 */
export function cleanPostLink(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  let u: URL;
  try {
    u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
  } catch {
    throw new Error(`"${v.slice(0, 60)}" isn't a link. Copy it from Instagram's Share button.`);
  }
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(u.hostname) || /\s/.test(v)) {
    throw new Error(`"${v.slice(0, 60)}" isn't a link. Copy it from Instagram's Share button.`);
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    throw new Error("Links have to start with https://");
  }
  const host = u.hostname.replace(/^www\./, "").toLowerCase();
  if (host === "instagram.com" || host === "instagr.am") {
    const m = u.pathname.match(/\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    if (!m) {
      throw new Error(
        "That Instagram link isn't to a post. Open the post itself, tap Share, then Copy link."
      );
    }
    const kind = m[1] === "p" ? "p" : "reel";
    return `https://www.instagram.com/${kind}/${m[2]}/`;
  }
  u.protocol = "https:";
  return u.toString().slice(0, 500);
}

/** True when the tile goes to one post rather than to the profile. */
export function hasPostLink(t: Pick<SocialTile, "href">): boolean {
  return Boolean(t.href);
}

const S = "/brand/social/";

/* id, src, alt, shape, link. The ids are the file names, so a seeded row can
   be told apart from one added later at a glance in the database.

   THE NINE LINKS were matched by eye on 22 October 2026, picture against
   post, from what Instagram shows logged out (the newest twelve posts on
   @chriswaipa and @mortgagepunk). The rest are older than that and still
   open the profile until a link is pasted in for them in Backstage. */
const RAW: [string, string, string, WallShape, string?][] = [
  ["adc-movement-poster", S + "adc-movement-poster.jpg", "American Dream Conference poster: the American Dream isn't a memory, it's a movement", "reel"],
  ["adc-concert", "/brand/adc-concert.jpg", "Live music closing the conference", "square"],
  ["portrait-red", S + "portrait-red.jpg", "Chris in red light, straightening his collar", "reel", "https://www.instagram.com/p/DeJ2ri0kTYi/"],
  ["whats-your-next-move", S + "whats-your-next-move.jpg", "What's your next move? The Game of Money", "reel", "https://www.instagram.com/reel/DeMYh1JxoXZ/"],
  ["lender-lies-01", S + "lender-lies-01.jpg", "Lender Lies number one: the $12,000 free refinance", "tallish"],
  ["so-it-sucked-less", S + "so-it-sucked-less.jpg", "So it sucked less? Chris and a guest mid-conversation", "reel", "https://www.instagram.com/reel/DeaAzLapweZ/"],
  ["review-five-star", S + "review-five-star.jpg", "A client review of working with Chris and the Mortgage Punk team", "portrait"],
  ["lender-lies-02", S + "lender-lies-02.jpg", "Lender Lies number two: why is my lender ghosting me?", "reel"],
  ["nobody-came-for-a-mortgage", S + "nobody-came-for-a-mortgage.jpg", "Nobody came here for a mortgage — Chris on the mic", "reel"],
  ["adc-panel", "/brand/adc-panel.jpg", "Panel session on stage", "tallish"],
  ["thank-you-wichita", S + "thank-you-wichita.jpg", "Thank you, Wichita — same energy in 2027?", "reel"],
  ["seventy-k-first-home", S + "seventy-k-first-home.jpg", "How they got $70,000 to buy their first home", "reel"],
  ["own-it", S + "own-it.jpg", "Own it: you don't have to inherit someone else's definition of the American Dream", "square"],
  ["podcast-kash-nancy-shih", S + "podcast-kash-nancy-shih.jpg", "The Mortgage Punk Show: Achieve K.A.S.H. to make more cash, with Nancy Shih", "reel"],
  ["adc-phone", "/brand/adc-phone.jpg", "An attendee filming the keynote", "portrait"],
  ["american-dream-tee", S + "american-dream-tee.jpg", "American Dream tee: own it, beyond a paycheck", "reel", "https://www.instagram.com/reel/DYdO6SoJa1r/"],
  ["client-story-nothing-to-lose", S + "client-story-nothing-to-lose.jpg", "Client story: five years ago he had nothing to lose", "reel"],
  ["not-everything-needs-a-strategy", S + "not-everything-needs-a-strategy.jpg", "Not everything needs a strategy", "tallish", "https://www.instagram.com/reel/DeDGMcHpY_H/"],
  ["adc-stage-crowd", "/brand/adc-stage-crowd.jpg", "Chris on stage at the conference, room full", "reel"],
  ["paycheck-isnt-the-playbook", S + "paycheck-isnt-the-playbook.jpg", "Your paycheck isn't the playbook", "square", "https://www.instagram.com/reel/Dd1bkFBRpER/"],
  ["problems-start-at-preapproval", S + "problems-start-at-preapproval.jpg", "Most mortgage problems start at pre-approval", "reel"],
  ["what-does-freedom-mean", S + "what-does-freedom-mean.jpg", "What does freedom actually mean? Live at Backstage Pass", "reel", "https://www.instagram.com/reel/Ddl9XdHxNLD/"],
  ["vote-punk-best-of-wichita", S + "vote-punk-best-of-wichita.jpg", "Vote Punk — Best of Wichita 2026, home mortgage and financial education", "portrait"],
  ["one-closing-three-wins", S + "one-closing-three-wins.jpg", "One closing, three wins: home equity, debt paid off, startup capital", "reel"],
  ["game-of-money-chapter-02", S + "game-of-money-chapter-02.jpg", "The Game of Money, chapter two: I've failed, I'm still learning", "tallish"],
  ["never-too-late-to-learn", S + "never-too-late-to-learn.jpg", "Real people, real conversations — it's never too late to learn the game", "reel"],
  ["american-dream-rewrite", S + "american-dream-rewrite.jpg", "The American Dream: the freedom and opportunity to rewrite your story", "reel", "https://www.instagram.com/p/DcEwOJTp6-X/"],
  ["adc-education", "/brand/adc-education.jpg", "Breakout session at the conference", "square"],
  ["ninety-to-a-million", S + "ninety-to-a-million.jpg", "$90 to $1,000,000? The Suck Less Mortgage Process", "reel", "https://www.instagram.com/reel/DdxH1pbp9Mo/"],
  ["chris-stage", "/brand/chris-stage.jpg", "Chris mid-keynote", "portrait"],
  ["recruit-at-restaurants", S + "recruit-at-restaurants.jpg", "I recruit at restaurants — podcast interview", "reel"],
  ["show-sponsor-kihle", S + "show-sponsor-kihle.jpg", "The Mortgage Punk Show, sponsored by Kihle Roofing and Construction", "reel"],
  ["freedom-on-your-own-terms", S + "freedom-on-your-own-terms.jpg", "The American Dream was never about having it all — it was about the freedom to build a life on your own terms", "tallish"],
  ["explanation-didnt-fail", S + "explanation-didnt-fail.jpg", "The American Dream didn't fail. The explanation did.", "reel"],
  ["adc-stageset", "/brand/adc-stageset.jpg", "The stage before doors", "tallish"],
  ["adc-interview", "/brand/adc-interview.jpg", "Chris interviewing on stage", "reel"],
];

/**
 * The wall as it shipped, and the fallback whenever the table can't be read.
 * The ordering rationale (shapes interleaved, never clustered) is in
 * SocialWall.tsx.
 */
export const SEED_SOCIAL_TILES: SocialTile[] = RAW.map(([id, src, alt, shape, href], i) => ({
  id,
  sort: i + 1,
  src,
  alt,
  shape,
  href: href ?? null,
  hidden: false,
}));

/** Field caps, enforced in the API as well as the editor. */
export const WALL_LIMITS = { alt: 200, tiles: 80 };
