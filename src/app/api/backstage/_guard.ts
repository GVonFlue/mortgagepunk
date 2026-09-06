import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { dbReady } from "@/lib/db";

/**
 * Every /api/backstage write goes through this.
 *
 * Two checks, in order: is this a logged-in session, and is there a database
 * to write to. Returning a clear "not configured" beats a confusing 500 when
 * someone tries to save before Supabase is wired up.
 */
export async function guard(): Promise<NextResponse | null> {
  if (!(await requireSession())) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  if (!dbReady()) {
    return NextResponse.json(
      { ok: false, error: "Database isn't connected yet — nothing was saved." },
      { status: 503 }
    );
  }
  return null;
}

/**
 * These endpoints are behind the password gate, so the caller is always Chris
 * or Garrett. Returning the real error is far more useful to them than a
 * generic apology — "Couldn't save that" told us nothing when the key format
 * was wrong.
 */
export function fail(err: unknown) {
  console.error("[backstage api]", err);
  const detail = err instanceof Error ? err.message : String(err);
  return NextResponse.json(
    { ok: false, error: detail.slice(0, 300) || "Couldn't save that. Try again." },
    { status: 500 }
  );
}
