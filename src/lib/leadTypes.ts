/**
 * The kinds of lead, for Backstage → Leads and the CSV downloads.
 *
 * Every form posts to /api/lead with a `source` tag. That tag is a code name
 * ("waitlist", "booking"); these are the names Chris knows the forms by. A
 * new form whose tag isn't listed lands under Contact rather than vanishing.
 *
 * Safe to import anywhere: no database access.
 */
export type LeadKind = "tickets" | "speaking" | "chat" | "calls" | "contact";

export const LEAD_KINDS: { key: LeadKind; label: string; blurb: string; sources: string[] }[] = [
  { key: "tickets", label: "Ticket list", blurb: "The American Dream Conference waitlist.", sources: ["waitlist"] },
  { key: "speaking", label: "Book Chris", blurb: "Speaking and media requests from /book.", sources: ["booking"] },
  { key: "chat", label: "Ask Mortgage Punk", blurb: "People who left their details with the assistant.", sources: ["chat"] },
  { key: "calls", label: "Calls booked", blurb: "Calls booked through Calendly. Name and number are on the Calendly invite.", sources: ["calendly-booking"] },
  { key: "contact", label: "Contact forms", blurb: "Everything else.", sources: [] },
];

export function kindOf(source: string | null | undefined): LeadKind {
  const s = (source ?? "").trim();
  return LEAD_KINDS.find((k) => k.sources.includes(s))?.key ?? "contact";
}

export function isLeadKind(v: unknown): v is LeadKind {
  return LEAD_KINDS.some((k) => k.key === v);
}
