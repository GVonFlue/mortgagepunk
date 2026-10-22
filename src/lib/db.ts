import {
  SEED_VIDEOS, SEED_TOPICS, SEED_PRESS, SEED_TALKS, SEED_CONFERENCE,
  SEED_ANNOUNCEMENT,
  SEED_TESTIMONIALS,
  type Video, type LibraryTopic, type PressItem, type Talk, type Conference,
  type Announcement, type Lead, type Testimonial,
} from "./content";
import { type SiteImage } from "./images";
import { SEED_SOCIAL_TILES, type SocialTile } from "./socialTiles";

/**
 * Supabase access via PostgREST over plain fetch.
 *
 * No @supabase/supabase-js on purpose: the client library is a large
 * dependency for what amounts to six tables of CRUD, and going direct means
 * this works identically in every runtime with nothing to keep in sync.
 *
 * SERVER ONLY. The service key bypasses row-level security, so nothing in this
 * file may ever be imported into a client component. Every caller is either a
 * server component or a route handler behind the password gate.
 *
 * When the env vars are absent every read returns seed data and every write
 * reports "not configured" — so the dashboard stays fully browsable before the
 * database exists, and says so rather than pretending to save.
 */

const URL_ = () => process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "";
const KEY = () => process.env.SUPABASE_SERVICE_KEY ?? "";

export function dbReady(): boolean {
  return Boolean(URL_() && KEY());
}

/**
 * Actually talk to the database.
 *
 * dbReady() only proves the env vars exist. This proves the credentials work,
 * which is the difference between the dashboard saying "connected" and the
 * dashboard being connected. Reads fall back to seed data on failure, so
 * without this probe a broken key looks identical to a working one.
 */
export async function dbProbe(): Promise<{ ok: boolean; error?: string }> {
  if (!dbReady()) return { ok: false, error: "SUPABASE_URL or SUPABASE_SERVICE_KEY is not set." };
  try {
    await rest("library_videos?select=id&limit=1");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

type Method = "GET" | "POST" | "PATCH" | "DELETE";

/**
 * Header set for PostgREST.
 *
 * Supabase has two key formats in the wild:
 *   legacy  service_role JWT, starts with "eyJ"
 *   current sb_secret_... which is NOT a JWT
 *
 * The `apikey` header works for both. `Authorization: Bearer` must only carry
 * a JWT — handing PostgREST an `sb_secret_...` value there makes it try to
 * parse a non-JWT as a JWT and fail the request outright. That failure looks
 * exactly like a permissions problem, which is a miserable thing to debug.
 */
function authHeaders(): Record<string, string> {
  const key = KEY();
  const h: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
  };
  if (key.startsWith("eyJ")) h.Authorization = `Bearer ${key}`;
  return h;
}

async function rest<T>(
  path: string,
  method: Method = "GET",
  body?: unknown,
  prefer?: string
): Promise<T> {
  const res = await fetch(`${URL_()}/rest/v1/${path}`, {
    method,
    headers: {
      ...authHeaders(),
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase ${method} ${path} -> ${res.status} ${detail.slice(0, 300)}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/**
 * Reads never throw. A database hiccup should degrade the page to seed
 * content, not 500 the public site in front of a visitor. Failures are logged
 * so they surface in Vercel rather than disappearing.
 */
async function safeRead<T>(fn: () => Promise<T>, fallback: T, what: string): Promise<T> {
  if (!dbReady()) return fallback;
  try {
    return await fn();
  } catch (err) {
    console.error(`[db] read failed for ${what}:`, err);
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// LIBRARY
// ---------------------------------------------------------------------------

export async function getVideos(opts?: { publishedOnly?: boolean }): Promise<Video[]> {
  return safeRead(
    async () => {
      const q = opts?.publishedOnly ? "&published=eq.true" : "";
      return await rest<Video[]>(`library_videos?select=*${q}&order=sort.asc`);
    },
    opts?.publishedOnly ? SEED_VIDEOS.filter((v) => v.published) : SEED_VIDEOS,
    "library_videos"
  );
}

export async function createVideo(v: Omit<Video, "id">): Promise<Video> {
  const [row] = await rest<Video[]>("library_videos", "POST", v, "return=representation");
  return row;
}

export async function updateVideo(id: string, patch: Partial<Video>): Promise<void> {
  await rest(`library_videos?id=eq.${encodeURIComponent(id)}`, "PATCH", patch);
}

export async function deleteVideo(id: string): Promise<void> {
  await rest(`library_videos?id=eq.${encodeURIComponent(id)}`, "DELETE");
}

// ---------------------------------------------------------------------------
// TOPICS
// ---------------------------------------------------------------------------

export async function getTopics(): Promise<LibraryTopic[]> {
  return safeRead(
    () => rest<LibraryTopic[]>("library_topics?select=*&order=sort.asc"),
    SEED_TOPICS,
    "library_topics"
  );
}

/**
 * Replace-all, and it deliberately does NOT touch library_videos.
 *
 * Videos store topic names as plain strings. If Chris renames a topic, the
 * videos keep the old name and simply stop matching — which is visible and
 * fixable. The alternative, cascading a rename across every video, is the
 * kind of silent bulk edit that is very hard to undo when it goes wrong.
 * renameTopic() below handles the deliberate case.
 */
export async function saveTopics(items: { name: string; sort: number }[]): Promise<void> {
  await rest("library_topics?id=not.is.null", "DELETE");
  if (items.length) await rest("library_topics", "POST", items);
}

/** Deliberate rename: move every video off the old name and onto the new one. */
export async function renameTopic(from: string, to: string): Promise<number> {
  const affected = await rest<Video[]>(
    `library_videos?select=id,topics&topics=cs.${encodeURIComponent(`{"${from}"}`)}`
  );
  for (const v of affected) {
    const next = Array.from(new Set((v.topics ?? []).map((t) => (t === from ? to : t))));
    await rest(`library_videos?id=eq.${encodeURIComponent(v.id)}`, "PATCH", { topics: next });
  }
  return affected.length;
}

/** Max four featured. Enforced here as well as in the UI, because the UI is
 *  only a suggestion once someone knows the endpoint exists. */
export async function featuredCount(): Promise<number> {
  const rows = await safeRead(
    () => rest<{ id: string }[]>("library_videos?select=id&featured=eq.true"),
    [],
    "featured count"
  );
  return rows.length;
}

// ---------------------------------------------------------------------------
// PRESS
// ---------------------------------------------------------------------------

export async function getPress(opts?: { publicOnly?: boolean }): Promise<PressItem[]> {
  return safeRead(
    async () => {
      const q = opts?.publicOnly ? "&pending=eq.false" : "";
      return await rest<PressItem[]>(`press_items?select=*${q}&order=sort.asc`);
    },
    opts?.publicOnly ? SEED_PRESS.filter((p) => !p.pending) : SEED_PRESS,
    "press_items"
  );
}

export async function savePress(items: Omit<PressItem, "id">[]): Promise<void> {
  await rest("press_items?id=not.is.null", "DELETE");
  if (items.length) await rest("press_items", "POST", items);
}

// ---------------------------------------------------------------------------
// SPEAKING
// ---------------------------------------------------------------------------

export async function getTalks(): Promise<Talk[]> {
  return safeRead(
    () => rest<Talk[]>("speaking_topics?select=*&order=sort.asc"),
    SEED_TALKS,
    "speaking_topics"
  );
}

export async function saveTalks(items: Omit<Talk, "id">[]): Promise<void> {
  await rest("speaking_topics?id=not.is.null", "DELETE");
  if (items.length) await rest("speaking_topics", "POST", items);
}

// ---------------------------------------------------------------------------
// CONFERENCE + ANNOUNCEMENT (single-row tables)
// ---------------------------------------------------------------------------

export async function getConference(): Promise<Conference> {
  return safeRead(
    async () => {
      const [row] = await rest<Conference[]>("site_conference?select=*&id=eq.1");
      return row ?? SEED_CONFERENCE;
    },
    SEED_CONFERENCE,
    "site_conference"
  );
}

export async function saveConference(c: Conference): Promise<void> {
  await rest("site_conference?id=eq.1", "PATCH", c);
}

export async function getAnnouncement(): Promise<Announcement> {
  return safeRead(
    async () => {
      const [row] = await rest<Announcement[]>("site_announcement?select=*&id=eq.1");
      return row ?? SEED_ANNOUNCEMENT;
    },
    SEED_ANNOUNCEMENT,
    "site_announcement"
  );
}

export async function saveAnnouncement(a: Announcement): Promise<void> {
  await rest("site_announcement?id=eq.1", "PATCH", a);
}

// ---------------------------------------------------------------------------
// SECTION PHOTOGRAPHY
// ---------------------------------------------------------------------------
// One row per slot, and only for slots that have actually been overridden.
// An empty table is the normal state: every slot then resolves to the file
// that shipped with the build. See lib/images.ts for the slot registry and
// pickImage().

/** Keyed by slot so a page can look one up without scanning an array. */
export async function getImages(): Promise<Record<string, SiteImage>> {
  return safeRead(
    async () => {
      const rows = await rest<SiteImage[]>("site_images?select=*");
      return Object.fromEntries(rows.map((r) => [r.slot, r]));
    },
    {},
    "site_images"
  );
}

/**
 * Upsert one slot.
 *
 * resolution=merge-duplicates makes this a true upsert on the primary key, so
 * Backstage does not have to know whether a slot has ever been set before —
 * which it cannot know without an extra read it would only use for branching.
 */
export async function saveImage(img: SiteImage): Promise<void> {
  await rest("site_images", "POST", img, "resolution=merge-duplicates");
}

/** Drop an override and fall back to the file that shipped with the build. */
export async function clearImage(slot: string): Promise<void> {
  await rest(`site_images?slot=eq.${encodeURIComponent(slot)}`, "DELETE");
}

// ---------------------------------------------------------------------------
// THE MOVEMENT WALL
// ---------------------------------------------------------------------------
// The tiles under The Movement on the home page. See lib/socialTiles.ts.

/**
 * An empty table reads as "not set up yet" and gets the shipped wall, the
 * same as a missing or unreachable one. Nobody wants a home page with a blank
 * where the wall was, and the API refuses to save an empty wall, so an empty
 * table only ever means the migration has not seeded it.
 */
export async function getSocialTiles(opts?: { visibleOnly?: boolean }): Promise<SocialTile[]> {
  const all = await safeRead(
    async () => {
      const rows = await rest<SocialTile[]>("social_tiles?select=*&order=sort.asc");
      return rows.length ? rows : SEED_SOCIAL_TILES;
    },
    SEED_SOCIAL_TILES,
    "social_tiles"
  );
  return opts?.visibleOnly ? all.filter((t) => !t.hidden) : all;
}

/** Whether the table exists yet, so Backstage can say "run the setup step"
 *  instead of letting someone edit a wall that cannot be saved. */
export async function wallTableReady(): Promise<{ ok: boolean; error?: string }> {
  if (!dbReady()) return { ok: false, error: "The database isn't connected." };
  try {
    await rest("social_tiles?select=id&limit=1");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Save the whole wall: upsert every tile, then delete whatever is no longer
 * in the list.
 *
 * In that order on purpose. Every other list here deletes everything and
 * re-inserts, which leaves a moment with nothing in the table — harmless for
 * a press page, but this is the home page, and a visitor landing in that
 * moment would get the fallback wall instead of Chris's. Upserting first
 * means the table is never emptier than the wall being saved.
 */
export async function saveSocialTiles(items: SocialTile[]): Promise<void> {
  if (!items.length) throw new Error("The wall needs at least one picture.");
  await rest("social_tiles", "POST", items, "resolution=merge-duplicates");
  const keep = items.map((t) => `"${t.id.replace(/"/g, "")}"`).join(",");
  await rest(`social_tiles?id=not.in.(${encodeURIComponent(keep)})`, "DELETE");
}

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------

export async function getTestimonials(opts?: {
  publishedOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<Testimonial[]> {
  return safeRead(
    async () => {
      let q = "";
      if (opts?.publishedOnly) q += "&published=eq.true";
      if (opts?.featuredOnly) q += "&featured=eq.true";
      return await rest<Testimonial[]>(`testimonials?select=*${q}&order=sort.asc`);
    },
    SEED_TESTIMONIALS,
    "testimonials"
  );
}

export async function saveTestimonials(
  items: Omit<Testimonial, "id" | "created_at">[]
): Promise<void> {
  await rest("testimonials?id=not.is.null", "DELETE");
  if (items.length) await rest("testimonials", "POST", items);
}

// ---------------------------------------------------------------------------
// LEADS
// ---------------------------------------------------------------------------

export async function getLeads(limit = 200): Promise<Lead[]> {
  return safeRead(
    () => rest<Lead[]>(`leads?select=*&order=created_at.desc&limit=${limit}`),
    [],
    "leads"
  );
}

/**
 * Never let a database failure lose a lead. The Apps Script leg in
 * /api/lead runs regardless, so the sheet and inbox always get it even if
 * this write fails.
 */
export async function createLead(l: Omit<Lead, "id" | "created_at">): Promise<boolean> {
  if (!dbReady()) return false;
  try {
    await rest("leads", "POST", l);
    return true;
  } catch (err) {
    console.error("[db] lead insert failed (sheet + inbox still delivered):", err);
    return false;
  }
}
