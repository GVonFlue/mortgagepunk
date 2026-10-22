/**
 * The public origin of the site, for anything that must be an absolute URL:
 * share-card images, og:url, canonical, the sitemap, robots.
 *
 * WHY PRODUCTION NEVER FALLS BACK TO VERCEL_URL. VERCEL_URL is the address of
 * one specific deployment — mortgagepunk-<hash>-gvonflues-projects.vercel.app
 * — and this project has Vercel's Standard Protection on, which puts every
 * deployment-specific address behind a Vercel login. Only the production
 * domains are public. With no NEXT_PUBLIC_SITE_URL set, every share card on
 * the live site pointed its image at a login page: iMessage, Facebook and the
 * rest fetched it, got refused, and fell back to the small icon instead of
 * the big image. Found on 22 October 2026, the morning mortgagepunk.com went
 * live, when a pasted link came up without its picture.
 *
 * So a production build always advertises the real domain. Previews keep
 * advertising themselves — their cards are behind the same login anyway, and
 * a preview card pointing at production would be a lie about what you are
 * looking at. NEXT_PUBLIC_SITE_URL still wins over both if it is ever set.
 */
const PRODUCTION = "https://mortgagepunk.com";

export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_ENV === "production" ? PRODUCTION : "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  PRODUCTION
).replace(/\/$/, "");
