/**
 * External destinations.
 *
 * The application portal URL carries a referrer ID that attributes the loan to
 * Chris. If it is pasted into eleven components and the ID ever changes — new
 * lender, new portal, a second loan officer needing their own link — every one
 * of them has to be found and edited, and the one that gets missed silently
 * sends applications to nobody.
 *
 * One constant. One edit.
 */

/** Neighborhood Loans portal, attributed to Chris Waipa. */
export const APPLY_URL =
  "https://portal.neighborhoodloans.com/#/milestones" +
  "?referrerId=cwaipa%40neighborhoodloans.com&loanType=MORTGAGE";

/**
 * Props for any link that leaves the site.
 *
 * `noopener` matters here specifically: without it the portal gets a handle on
 * the window that opened it, and this one collects financial information.
 */
export const EXTERNAL = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/**
 * Chris's Calendly for a mortgage phone call.
 *
 * BARE, AND THAT IS DELIBERATE. The link as it was handed over carried
 * `?back=1&month=2026-10`. `back=1` is Calendly's own in-app navigation state
 * and means nothing to an embed; `month` pins the grid to October 2026, which
 * is correct for about ten more days and then opens every visitor on a month
 * in the past. The embed adds the parameters it actually needs at runtime —
 * see CallBooking, which has to read the hostname to build `embed_domain`.
 *
 * NOT THE SAME THING AS /book. That page is the speaking desk — keynotes,
 * podcasts, press, sponsorship. This is a mortgage conversation. The two
 * audiences share nothing and the same link cannot serve both.
 */
export const CALENDLY_URL = "https://calendly.com/cmpunk/phone-call";
