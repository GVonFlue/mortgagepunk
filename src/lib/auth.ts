import { createHmac, timingSafeEqual, randomBytes } from "crypto";

/**
 * Single-user session auth for /backstage.
 *
 * Deliberately not Supabase Auth or NextAuth: this is one client editing his
 * own content, and neither Garrett nor Chris should have to create accounts in
 * a new service to make it work. Password lives in a server-side env var, the
 * session is an httpOnly signed cookie. If this ever needs multiple users with
 * separate permissions, swap this file for Supabase Auth — nothing else in the
 * dashboard depends on how the session is produced.
 *
 * Required env (server-side only, never NEXT_PUBLIC_):
 *   BACKSTAGE_PASSWORD   what Chris types
 *   BACKSTAGE_SECRET     long random string used to sign the cookie
 */

export const COOKIE = "mp_backstage";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function secret(): string {
  const s = process.env.BACKSTAGE_SECRET;
  if (!s || s.length < 24) {
    throw new Error("BACKSTAGE_SECRET is missing or too short (need 24+ chars)");
  }
  return s;
}

/** Constant-time compare so the password can't be guessed by timing. */
export function passwordMatches(given: string): boolean {
  const expected = process.env.BACKSTAGE_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** token = <expiry>.<hmac(expiry)> — no user data, nothing to leak. */
export function issueToken(): { value: string; maxAge: number } {
  const exp = Date.now() + MAX_AGE * 1000;
  const nonce = randomBytes(8).toString("hex");
  const payload = `${exp}.${nonce}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return { value: `${payload}.${sig}`, maxAge: MAX_AGE };
}

export function tokenIsValid(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  const expected = createHmac("sha256", secret())
    .update(`${exp}.${nonce}`)
    .digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}
