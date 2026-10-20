import type { MetadataRoute } from "next";

/**
 * robots.txt.
 *
 * /backstage is Chris's admin and /api is machinery; neither belongs in a
 * search index, and /backstage especially must never be the thing somebody
 * finds by searching his name. Disallow is not a security control — the login
 * is — but a crawler that is told to stay out generally does.
 */
export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    "https://mortgagepunk.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/backstage", "/backstage/", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
