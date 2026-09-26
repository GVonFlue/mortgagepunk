/**
 * Booking request types, shared by the /book page and the booking form.
 *
 * WHY THIS IS ITS OWN FILE. The form is a client component and the page is a
 * server component. A server component cannot read a value exported from a
 * "use client" module — it receives a client reference, not the object — so a
 * constant the page needs for validating ?type= has to live somewhere neither
 * side owns. This is that somewhere.
 *
 * The keys are what appear in links (/book?type=press). The values are what
 * the visitor reads and what lands in the lead's intent line.
 */
export const REQUEST_TYPES = {
  speaking: "Speaking engagement",
  podcast: "Podcast or interview",
  press: "Press",
  partnership: "Partnership",
  sponsorship: "Sponsor the American Dream Conference",
} as const;

export type RequestKey = keyof typeof REQUEST_TYPES;

/** Narrow an untrusted query value to a known request type. */
export function asRequestKey(v: string | undefined): RequestKey | undefined {
  return v && v in REQUEST_TYPES ? (v as RequestKey) : undefined;
}
