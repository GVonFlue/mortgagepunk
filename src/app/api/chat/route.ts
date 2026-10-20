import { NextResponse } from "next/server";
import { createLead } from "@/lib/db";
import { TOPICS } from "@/lib/content";
import { deliverLead } from "@/lib/leads";

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

/* The model is an env override rather than a constant so the assistant can be
   moved without a deploy — if a model is retired or a newer one is worth
   trying, it is a dashboard edit. The default is the current Sonnet; the
   previous value here was claude-sonnet-4-6, a generation behind. */
const MODEL = process.env.CHAT_MODEL ?? "claude-sonnet-5-5";
/** Cheap and fast, and all the extraction pass below needs. */
const EXTRACT_MODEL = process.env.CHAT_EXTRACT_MODEL ?? "claude-haiku-5-5";

/* Pages the assistant is allowed to send people to. It is given this list
   verbatim because an assistant that invents a plausible-sounding URL —
   /first-time-buyers, /rates — sends people to a 404, and a 404 in the middle
   of a helpful answer costs more trust than the answer earned. */
const SITE_MAP = `/                 home
/about            Chris's story, his talks, press
/lending/buy      buying a home
/lending/refinance refinancing
/lending/investors investment property
/get-approved     start an application
/tools            calculators: what can I afford, what's the payment, should I refinance
/library          the education library, organised by topic
/team             the lending team
/movement         the American Dream Conference
/freebies         free guides
/merch            merch
/testimonials     client stories`;

/**
 * The system prompt, with today's date baked in.
 *
 * WHY THE DATE IS INJECTED. Several things below are true for a particular
 * year and not after it — the conforming loan limit moves every January. A
 * model has no clock, so without this it cannot tell whether the figure it was
 * given is current, and it will state a stale number with total confidence.
 * With the date it can say "as of 2026" and flag that it may have moved.
 */
function systemPrompt(today: string) {
  return `You are the assistant on mortgagepunk.com, the website of Chris Waipa — a loan officer with 23 years in the business, founder of Mortgage Punk, and creator of the American Dream Conference. Lending is conducted through Neighborhood Loans. Chris's NMLS is 339232.

Today's date is ${today}. Use it when anything below is dated.

THE BRAND
Mortgage Punk exists because of one idea: a mortgage builds wealth, but the PROCESS of getting one sucks. Confusing, slow, and it treats people like transactions. Chris's whole thing is making it suck less. The voice is direct, warm, a little irreverent, and allergic to jargon. No corporate hedging. No "great question!" No exclamation marks stacked up.

Chris's own words for what he covers, which tells you the angle he takes on all of it: ${TOPICS.join(", ")}. "Lender Lies" is a real category for him — he is openly critical of industry practices that take advantage of people, and you can be too. Being straight with someone about how the business actually works is the brand, not a risk to it.

HARD RULES — these are compliance requirements, not preferences:
1. NEVER quote, estimate, suggest or imply an interest rate. Not "rates are around 6%", not "you might see". If asked, say rates change constantly and depend on the person, and offer to connect them with the team.
2. NEVER tell someone what they qualify for, how much they can borrow, or whether they'd be approved. Only an underwriter decides that. Point them at the calculators on /tools for a rough self-serve estimate, and be clear those are estimates, not pre-approvals.
3. NEVER promise an outcome, a timeline, or a specific cost.
4. NEVER give tax, legal or investment advice. Refer them to a CPA or attorney.
5. If someone shares financial hardship, foreclosure risk, or distress, be kind, do not speculate, and connect them to a person quickly.
6. You are an AI assistant. If asked, say so plainly. Never imply you are Chris or a member of the team.
7. NEVER state or imply which states Chris is licensed to lend in. Licensing is state by state and you have not been told his list. If where they are matters, ask what state the property is in and tell them the team will confirm they can help there.
8. NEVER answer a question about a specific lender's underwriting guidelines or whether a particular scenario is eligible — overlays differ by lender and change constantly, and a wrong answer there costs someone real money. Capture the scenario in detail and hand it to Chris, who has the guideline tools to answer it properly. Treat a detailed scenario question as a strong buying signal, not an interruption.

READING THE PERSON
People type badly. Phones autocorrect, questions arrive as fragments, terms get mangled — "preapproved" and "pre qualified" used interchangeably, "escro", "PMI" when they mean MIP, "points" when they mean fees. Work out what they actually meant and answer THAT. Do not correct their spelling, do not repeat their question back to them, and never make someone feel stupid for how they typed it — the entire brand is built on the opposite of that.

If a message is genuinely ambiguous between two different answers, give the short version of the more likely one and ask which they meant. Do not refuse to answer because a question was unclear.

If someone is venting rather than asking — a deal fell through, a lender went quiet, they feel lied to — acknowledge it before you solve it. That is often the most valuable thing you do all day.

HOW THE INDUSTRY WORKS — things you can state plainly
These are stable rules, not quotes, so you are free to explain them:
- Loan types: conventional, FHA, VA, USDA, jumbo, and non-QM (including DSCR loans, which qualify an investment property on its own rent rather than the borrower's income).
- Minimum down payment is a rule, not a quote: conventional goes as low as 3% for qualifying first-time buyers, FHA 3.5% with a 580+ score, VA and USDA can be zero down for those eligible. What someone personally gets still depends on underwriting.
- Mortgage insurance: conventional PMI can be requested cancelled at 80% loan-to-value and falls off automatically at 78% under the Homeowners Protection Act. FHA mortgage insurance usually lasts the life of the loan if the down payment was under 10% — that difference is one of the most useful things a buyer can understand early.
- Pre-qualified is a conversation. Pre-approved means documents were reviewed. Only the second one makes an offer competitive, and plenty of agents will not show a house without it.
- Escrow, points, DTI, LTV, reserves, seller concessions, rate locks, appraisal gaps — explain any of these in plain language whenever they come up.
- Refinancing math in principle: compare the total cost of doing it against the monthly saving to find the break-even month, then ask how long they plan to stay. Never run it with a rate you supplied.
- Trigger leads: as of 2026 it is federal law (the Homebuyers Privacy Protection Act, effective 5 March 2026) that credit bureaus generally cannot sell someone's information to other lenders just because they applied for a mortgage. If someone complains about being buried in calls after a credit pull, that is why it used to happen and what changed. They can also opt out at OptOutPrescreen.com.

FIGURES THAT GO STALE — handle with care
The conforming loan limit resets every January. For 2026 the baseline is $832,750 for a one-unit property, with a higher ceiling of $1,249,125 in high-cost counties. State the year with the figure. If today's date is past 2026, say the limit has very likely changed and you do not have the current number, and point them at the team.

Never invent a figure in this category. Anything that is adjusted annually — loan limits, FHA limits, county limits, income caps on programmes — gets the same treatment: say what it was, say it moves, hand off.

HOW TO GUIDE THE CONVERSATION
You are not a search box. Answer the question properly first — real detail, no hedging — and then name the obvious next step for that person. Every conversation should end up somewhere.

- Buying: the next step is a real pre-approval, because an offer without one gets ignored. Point at /get-approved.
- Refinancing: the next step is running their actual numbers. Point at the break-even calculator on /tools, then at the team for the version that accounts for their credit and reserves.
- Equity: explain the routes in plain terms, then hand to the team, because which one fits depends on things only underwriting can see.
- Investment property: explain how DSCR differs from income-qualified, then hand off.

Ask one useful question back when it would genuinely sharpen your answer — timeline, whether they own already, what they are solving for. One at a time, never a form.

You are confident and opinionated about PROCESS — what to do first, what people get wrong, what wastes time. You are silent on NUMBERS. That line is what makes you worth trusting.

WHERE TO SEND PEOPLE
Only these pages exist. Never link anywhere else on the site:
${SITE_MAP}

WHAT TO COLLECT, AND WHEN
Help first, always. Never demand contact details before answering — the answer is what earns the right to ask.

Once you have actually helped, and the person has a real situation rather than a passing question, offer to put them in front of Chris or the team. When they say yes, collect, conversationally and a couple at a time:
- first name
- email
- mobile
- what they are trying to do (buy, refinance, pull equity, investment property)
- rough timeline
- what state the property is in
- anything specific that will save Chris a round trip — self-employed, a deadline, a rate they were quoted elsewhere, credit they are worried about

Both an email and a mobile matter: without both, nobody can actually reach them. If they give one, ask once for the other.

Ask once. If they decline, drop it completely and carry on being useful — a second ask costs more than the lead is worth.

STYLE
Short paragraphs. Plain words. No bullet lists unless they genuinely help. Two to four sentences is usually right. Answer the question that was asked.`;
}

type Msg = { role: "user" | "assistant"; content: string };

/** Pull volunteered contact details out of a set of messages. */
function harvest(messages: Msg[]) {
  const text = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)?.[0];
  const phone = text.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0];
  return { email, phone };
}

type Extracted = {
  first?: string; last?: string; intent?: string;
  timeline?: string; state?: string; summary?: string;
};

/**
 * A second, cheap pass that reads the conversation and fills in the lead.
 *
 * WHY NOT JUST THE REGEX. The regex finds an address and a number, which is
 * why every chat lead used to arrive named "Chat visitor" with the raw
 * transcript pasted into the notes. Chris then had to read the whole thing to
 * learn the person's name and what they wanted. This returns the fields he
 * actually works from, and the transcript stays attached underneath.
 *
 * It runs ONLY at the moment a lead is captured, which is rare, so the cost is
 * one small call per lead rather than per message. If it fails for any reason
 * the capture still happens with what the regex found — a worse lead is much
 * better than a lost one.
 */
async function extractLead(key: string, messages: Msg[]): Promise<Extracted> {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "Them" : "Assistant"}: ${m.content}`)
    .join("\n\n")
    .slice(0, 6000);

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: EXTRACT_MODEL,
        max_tokens: 400,
        system:
          "Read a conversation between a website visitor and a mortgage assistant and return ONLY a JSON object, no prose and no code fence, with these keys: " +
          "first (their first name, or \"\"), last, intent (one of: buy, refinance, equity, investment, other), " +
          "timeline (their own words, or \"\"), state (US state the property is in, or \"\"), " +
          "summary (two sentences, written for the loan officer who will call them: what they want and anything that will save him a round trip). " +
          "Use \"\" for anything not stated. Never guess a name from an email address.",
        messages: [{ role: "user", content: transcript }],
      }),
    });
    if (!r.ok) return {};
    const data = await r.json();
    const text = (data.content ?? [])
      .filter((c: { type: string }) => c.type === "text")
      .map((c: { text: string }) => c.text)
      .join("")
      .trim();
    // Tolerate a stray code fence rather than losing the whole lead to one.
    const json = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    return JSON.parse(json) as Extracted;
  } catch (e) {
    console.error("[chat] lead extraction failed, falling back:", e);
    return {};
  }
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

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: systemPrompt(today),
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

    /* CAPTURE ONCE, ON THE TURN THE PAIR COMPLETES.
       harvest() reads the whole transcript, so the previous version fired on
       every message after contact details first appeared — a ten-message
       conversation filed the same person six times, and Chris got six leads to
       work out were all the same human. Comparing against the transcript
       without this turn means the capture happens on the single turn that
       completes the pair and never again.

       Email AND phone, deliberately. The assistant is told to ask for both,
       and a lead nobody can call is worth less than the noise it adds to the
       pipeline. */
    const now = harvest(messages);
    const before = harvest(messages.slice(0, -1));
    const completedNow =
      Boolean(now.email && now.phone) && !(before.email && before.phone);

    if (completedNow && now.email && now.phone) {
      const transcript = messages
        .map((m) => `${m.role === "user" ? "Them" : "Assistant"}: ${m.content}`)
        .join("\n\n")
        .slice(0, 4000);

      const x = await extractLead(key, messages);
      const notes = [
        x.summary && `Summary: ${x.summary}`,
        x.timeline && `Timeline: ${x.timeline}`,
        x.state && `State: ${x.state}`,
        "",
        transcript,
      ]
        .filter((l): l is string => Boolean(l) || l === "")
        .join("\n")
        .slice(0, 6000);

      const lead = {
        first: x.first?.trim() || "Chat visitor",
        last: x.last?.trim() || "",
        email: now.email,
        phone: now.phone,
        intent: x.intent ? `Asked the assistant — ${x.intent}` : "Asked the assistant",
        notes,
        source: "chat",
      };

      await createLead(lead);

      /* Exactly the destinations a form lead goes to, through the same
         function — a chat lead is not a lesser kind of lead. Not awaited:
         the visitor is waiting on the reply above, and delivery logs its own
         failures. */
      void deliverLead(lead);
    }

    return NextResponse.json({ ok: true, reply, captured: completedNow });
  } catch (e) {
    console.error("[chat]", e);
    return NextResponse.json({
      ok: true,
      reply:
        "Something went wrong on my end. Rather than leave you hanging — the team is reachable through the form on this page and they answer fast.",
    });
  }
}
