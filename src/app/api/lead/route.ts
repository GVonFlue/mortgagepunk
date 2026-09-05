import { NextResponse } from "next/server";

/**
 * Lead intake.
 *
 * Per the proposal, every lead fires to three places: the CRM, the inbox, and
 * a backup sheet. Right now only the sheet+email leg exists, because the CRM
 * (Jungo / Salesforce) API access is still pending Gavin.
 *
 * That is deliberate. The Apps Script endpoint is the same proven pattern as
 * the onboarding form, so leads are captured from day one and Jungo becomes a
 * third destination later — one function, not a refactor.
 *
 * Env (server-side only, never NEXT_PUBLIC_):
 *   LEAD_ENDPOINT   Apps Script /exec URL -> Sheet + email
 *   JUNGO_API_KEY   not yet issued
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const first = String(body.first ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!first || !email || !phone) {
    return NextResponse.json({ ok: false, error: "missing required" }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "bad email" }, { status: 400 });
  }

  const payload = {
    ...body,
    first,
    email,
    phone,
    receivedAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") ?? "",
  };

  const endpoint = process.env.LEAD_ENDPOINT;
  if (!endpoint) {
    // Fail loudly in logs, quietly to the visitor — never lose a lead silently.
    console.error("LEAD_ENDPOINT is not set. Lead not delivered:", payload);
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 500 });
  }

  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`endpoint ${r.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead delivery failed:", err, payload);
    return NextResponse.json({ ok: false, error: "delivery failed" }, { status: 502 });
  }
}
