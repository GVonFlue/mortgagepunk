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

  const source = String(body.source ?? "site");

  /* A Calendly booking arrives as a pointer, not a contact: the name, email
     and phone stay inside Calendly (see CallBooking). It used to be refused
     here for missing them, so no booking was ever recorded. It gets a
     placeholder name and blank contact fields instead. */
  const isBooking = source === "calendly-booking";

  const first = String(body.first ?? "").trim() || (isBooking ? "Calendly booking" : "");
  const email = String(body.email ?? "").trim();
  /* Any phone number at all, exactly as typed: +1 (316) 555-0100, 316.555.0100,
     an international number, an extension. The only check is that something
     is there. Formatting it for the visitor was never this form's job, and a
     strict check turns a real lead away over punctuation. */
  const phone = String(body.phone ?? "").trim().slice(0, 40);

  if (!isBooking) {
    if (!first || !email || !phone) {
      return NextResponse.json({ ok: false, error: "missing required" }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "bad email" }, { status: 400 });
    }
  }

  const payload = {
    ...body,
    first,
    email,
    phone,
    source,
    receivedAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") ?? "",
  };

  // The database is what Backstage → Leads reads.
  const saved = await createLead({
    first,
    last: String(body.last ?? ""),
    email,
    phone,
    intent: String(body.intent ?? ""),
    notes: String(body.notes ?? ""),
    source,
  });

  /* Fans out to the sheet + inbox and, when it is configured, the CRM. See
     lib/leads: the legs settle independently. */
  const delivery = await deliverLead(payload);

  /* SAVED ANYWHERE COUNTS AS SAVED. This used to fail whenever the email leg
     failed, even with the lead safely in the database, so the visitor was
     told to try again, and the error message blamed their name, email or
     phone. That is the likeliest reason a +1 phone number looked like the
     problem on 24 October 2026: nothing here ever checked the number. Only when nothing at all kept it does the visitor see
     an error. */
  if (!saved && !delivery.ok) {
    return NextResponse.json({ ok: false, error: "not saved" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
