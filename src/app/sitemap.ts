import type { MetadataRoute } from "next";
import { getTopics } from "@/lib/db";
import { topicSlug } from "@/lib/library";

/**
 * sitemap.xml.
 *
 * Listed by hand rather than crawled off the route tree, because the route
 * tree also contains /backstage and the API. An explicit list is the one that
 * cannot accidentally publish the admin.
 *
 * Priorities are relative to each other and only matter in so far as they tell
 * a crawler what this site is for: getting approved and the lending pages come
 * first, the movement and the library next, merch last.
 *
 * The library's topic pages are generated from the live topic list, so a
 * category Chris adds in Backstage appears here without a deploy.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    "https://mortgagepunk.vercel.app";

  const now = new Date();

  const fixed: [string, number][] = [
    ["/", 1],
    ["/get-approved", 0.9],
    ["/lending/buy", 0.8],
    ["/lending/refinance", 0.8],
    ["/lending/investors", 0.8],
    ["/tools", 0.8],
    ["/about", 0.7],
    ["/library", 0.7],
    ["/movement", 0.7],
    ["/team", 0.6],
    ["/testimonials", 0.6],
    ["/freebies", 0.6],
    ["/book", 0.5],
    ["/contact", 0.5],
    ["/merch", 0.3],
  ];

  const entries: MetadataRoute.Sitemap = fixed.map(([path, priority]) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));

  /* The library topics are database-backed. If the database is unreachable the
     sitemap still has to be served — a missing topic list is a smaller problem
     than a 500 where the sitemap should be. */
  try {
    const topics = await getTopics();
    for (const t of topics) {
      entries.push({
        url: `${base}/library/${topicSlug(t.name)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch (e) {
    console.error("[sitemap] topic list unavailable:", e);
  }

  return entries;
}
