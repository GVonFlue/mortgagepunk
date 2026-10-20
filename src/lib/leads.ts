/**
 * Lead delivery.
 *
 * Every lead on this site — the forms, the call request, the assistant —
 * lands here, and this is the only place that knows where leads go. Before
 * this, the fan-out was written twice (once in /api/lead, once inline in the
 * chat route) and the two had already drifted: the chat copy sent a different
 * shape and skipped a field. One function, one shape, one place to add the
 * next destination.
 *
 * TWO DESTINATIONS, BOTH OPTIONAL, NEITHER ABLE TO BLOCK THE OTHER.
 *
 *   LEAD_ENDPOINT   The Apps Script /exec URL. Writes the backup sheet and
 *                   sends the inbox copy. This is the one that must not break,
 *                   because it is the record of last resort.
 *   LEAD_WEBHOOK    The CRM leg. Chris's CRM is Jungo, which is built on
 *                   Salesforce; its API access was still pending when this was
 *                   written, so this is deliberately a plain webhook rather
 *                   than a Jungo client. Point it at a Zapier or Make catch
 *                   hook that maps into Jungo and the connection is a URL
 *                   paste, not a deploy — and it keeps working unchanged if he
 *                   ever moves off Jungo, which a hand-written Salesforce
 *                   integration would not.
 *
 * They are delivered in parallel and settled independently. A CRM outage must
 * never cost the sheet copy, and vice versa — losing a lead is the one failure
 * this site cannot recover from, so every leg fails loudly into the log and
 * quietly to the visitor.
 */

export type LeadPayload = {
  first: string;
  last?: string;
  email: string;
  phone: string;
  intent?: string;
  notes?: string;
  source: string;
  [k: string]: unknown;
};

export type Delivery = {
  /** True if at least one destination accepted it. */
  ok: boolean;
  /** Which legs were configured and how each went, for the log. */
  results: { name: string; ok: boolean; detail?: string }[];
};

async function post(name: string, url: string, payload: LeadPayload) {
  try {
    const r = await fetch(url, {
      method: "POST",
      /* text/plain is not a mistake. Apps Script web apps reject a JSON
         content-type preflight; the body is still JSON and is parsed as such
         at the other end. A normal webhook accepts it happily, so one header
         serves both and there is no per-destination special case. */
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return { name, ok: true };
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    console.error(`[lead] ${name} delivery failed:`, detail, payload.email);
    return { name, ok: false, detail };
  }
}

export async function deliverLead(payload: LeadPayload): Promise<Delivery> {
  const stamped: LeadPayload = {
    ...payload,
    receivedAt: payload.receivedAt ?? new Date().toISOString(),
  };

  const legs: Promise<{ name: string; ok: boolean; detail?: string }>[] = [];
  if (process.env.LEAD_ENDPOINT) {
    legs.push(post("sheet", process.env.LEAD_ENDPOINT, stamped));
  }
  if (process.env.LEAD_WEBHOOK) {
    legs.push(post("crm", process.env.LEAD_WEBHOOK, stamped));
  }

  if (legs.length === 0) {
    // Loud in the log, because this means the lead exists only in the database.
    console.error(
      "[lead] no destination configured (LEAD_ENDPOINT / LEAD_WEBHOOK). Lead:",
      stamped.email
    );
    return { ok: false, results: [] };
  }

  const results = await Promise.all(legs);
  return { ok: results.some((r) => r.ok), results };
}
