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
