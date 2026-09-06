import {
  SEED_VIDEOS, SEED_TOPICS, SEED_PRESS, SEED_TALKS, SEED_CONFERENCE,
  SEED_ANNOUNCEMENT,
  SEED_TESTIMONIALS, SEED_HERO,
  type Video, type LibraryTopic, type PressItem, type Talk, type Conference,
  type Announcement, type Lead, type Testimonial, type Hero,
} from "./content";

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
// HERO COPY
// ---------------------------------------------------------------------------

export async function getHero(): Promise<Hero> {
  return safeRead(
    async () => {
      const [row] = await rest<Hero[]>("site_hero?select=*&id=eq.1");
      return row ?? SEED_HERO;
    },
    SEED_HERO,
    "site_hero"
  );
}

export async function saveHero(h: Hero): Promise<void> {
  await rest("site_hero?id=eq.1", "PATCH", h);
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
