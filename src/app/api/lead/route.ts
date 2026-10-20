import { NextResponse } from "next/server";
import { createLead } from "@/lib/db";
import { deliverLead } from "@/lib/leads";

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
 *   LEAD_WEBHOOK    optional second destination -> the CRM. See lib/leads.
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
    source: String(body.source ?? "site"),
    receivedAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") ?? "",
  };

  // Write to the database first so the lead shows in /backstage, but never
  // let a database failure stop the sheet + inbox delivery below.
  await createLead({
    first,
    last: String(body.last ?? ""),
    email,
    phone,
    intent: String(body.intent ?? ""),
    notes: String(body.notes ?? ""),
    source: String(body.source ?? "site"),
  });

  /* Fans out to the sheet and, when it is configured, the CRM. See lib/leads:
     the legs settle independently, so a CRM outage cannot cost the sheet copy.
     ok is true if any leg landed. */
  const delivery = await deliverLead(payload);
  if (!delivery.ok) {
    // Fail loudly in logs, quietly to the visitor — never lose a lead silently.
    return NextResponse.json({ ok: false, error: "delivery failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
