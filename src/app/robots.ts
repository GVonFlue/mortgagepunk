import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

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
    SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/backstage", "/backstage/", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
