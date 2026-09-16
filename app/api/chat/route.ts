import { NextResponse } from "next/server";
import { createLead } from "@/lib/db";

export const runtime = "nodejs";

/**
 * The Mortgage Punk assistant.
 *
 * COMPLIANCE FIRST. Mortgage advertising is regulated, and an assistant that
 * appears to quote a rate, promise an approval, or state what someone
 * qualifies for creates real exposure under Regulation Z and UDAAP. The system
 * prompt below is not decoration — it is the control. Read it before changing
 * anything here.
 *
 * The assistant may: explain how things work, define terms, describe the
 * process, talk about the movement, and hand off to a human.
 * The assistant may NOT: quote rates, estimate what someone qualifies for,
 * promise approval, or give tax or legal advice.
 *
 * Lead capture is a side effect, never the point. When someone volunteers
 * contact details the conversation is handed to /api/lead's same destinations —
 * the database and the Apps Script sheet + inbox — so a chat lead lands in
 * exactly the same places a form lead does.
 */

const SYSTEM = `You are the assistant on mortgagepunk.com, the website of Chris Waipa — a loan officer with 23 years in the business, founder of Mortgage Punk, and creator of the American Dream Conference. Lending is conducted through Neighborhood Loans. Chris's NMLS is 339232.

THE BRAND
Mortgage Punk exists because of one idea: a mortgage builds wealth, but the PROCESS of getting one sucks. Confusing, slow, and it treats people like transactions. Chris's whole thing is making it suck less. The voice is direct, warm, a little irreverent, and allergic to jargon. No corporate hedging. No "great question!" No exclamation marks stacked up.

HARD RULES — these are compliance requirements, not preferences:
1. NEVER quote, estimate, suggest or imply an interest rate. Not "rates are around 6%", not "you might see". If asked, say rates change constantly and depend on the person, and offer to connect them with the team.
2. NEVER tell someone what they qualify for, how much they can borrow, or whether they'd be approved. Only an underwriter decides that. Point them at the calculators on /tools for a rough self-serve estimate, and be clear those are estimates, not pre-approvals.
3. NEVER promise an outcome, a timeline, or a specific cost.
4. NEVER give tax, legal or investment advice. Refer them to a CPA or attorney.
5. If someone shares financial hardship, foreclosure risk, or distress, be kind, do not speculate, and connect them to a person quickly.
6. You are an AI assistant. If asked, say so plainly. Never imply you are Chris or a member of the team.

WHAT YOU'RE GOOD FOR
Explaining how the mortgage process actually works, what documents are needed and why, what terms mean (escrow, PMI, DTI, points, DSCR), the difference between pre-qualified and pre-approved, what makes an offer strong, how refinancing math works in principle, and what the American Dream Conference is. Also the education library at /library and Chris's story at /about.

HANDOFF
When someone is ready to actually do something — get pre-approved, talk numbers on a real house, discuss their situation — get them to a human. Ask for a first name, an email and a mobile. Never demand contact details before helping; help first, always.

STYLE
Short paragraphs. Plain words. No bullet lists unless they genuinely help. Two to four sentences is usually right. Answer the question that was asked.`;

type Msg = { role: "user" | "assistant"; content: string };

/** Pull volunteered contact details out of the conversation. */
function harvest(messages: Msg[]) {
  const text = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0];
  const phone = text.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0];
  return { email, phone };
}

export async function POST(req: Request) {
  let body: { messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
  if (messages.length === 0) {
    return NextResponse.json({ ok: false, error: "No message" }, { status: 400 });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({
      ok: true,
      reply:
        "The assistant isn't switched on yet. In the meantime the team is one message away — use the form on this page and someone will come back to you.",
    });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 700,
        system: SYSTEM,
        messages: messages.map((m) => ({
          role: m.role,
          content: String(m.content).slice(0, 4000),
        })),
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error("[chat] anthropic error", r.status, detail.slice(0, 300));
      throw new Error("upstream");
    }

    const data = await r.json();
    const reply = (data.content ?? [])
      .filter((c: { type: string }) => c.type === "text")
      .map((c: { text: string }) => c.text)
      .join("\n")
      .trim();

    // If they volunteered contact details, route them exactly like a form lead.
    const { email, phone } = harvest(messages);
    if (email && phone) {
      const transcript = messages
        .map((m) => `${m.role === "user" ? "Them" : "Assistant"}: ${m.content}`)
        .join("\n\n")
        .slice(0, 4000);

      await createLead({
        first: "Chat visitor",
        last: "",
        email,
        phone,
        intent: "Asked the assistant",
        notes: transcript,
        source: "chat",
      });

      // Same sheet + inbox the forms use, so nothing depends on the database.
      const endpoint = process.env.LEAD_ENDPOINT;
      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            first: "Chat visitor", email, phone,
            intent: "Asked the assistant", notes: transcript,
            source: "chat", receivedAt: new Date().toISOString(),
          }),
        }).catch((e) => console.error("[chat] sheet delivery failed:", e));
      }
    }

    return NextResponse.json({ ok: true, reply, captured: Boolean(email && phone) });
  } catch (e) {
    console.error("[chat]", e);
    return NextResponse.json({
      ok: true,
      reply:
        "Something went wrong on my end. Rather than leave you hanging — the team is reachable through the form on this page and they answer fast.",
    });
  }
}
