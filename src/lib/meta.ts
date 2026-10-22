import type { Metadata } from "next";

/**
 * One place that builds a page's share card.
 *
 * THE PROBLEM THIS SOLVES. Only the root layout defined `openGraph`, and
 * Next merges metadata **shallowly** — a nested object like `openGraph` is
 * replaced wholesale by the last segment that defines one, never merged field
 * by field. Since no page defined its own, every page on the site inherited
 * the layout's card verbatim. Sharing /about, /movement or /library to
 * Facebook produced the home page's title and the home page's description,
 * every time, on a brand whose whole model is being shared.
 *
 * Worse, `og:url` was the same string on every page. Facebook keys a shared
 * object on og:url, so as far as it was concerned the entire site was one
 * page — likes, shares and comments on any URL all pooled onto one object.
 *
 * The fix cannot be "set og:title on each page", because that would drop the
 * image, the site name and the type along with it. It has to be a whole card
 * per page, which is exactly the shared-module pattern Next's own metadata
 * documentation recommends.
 *
 * WHY `title` AND THE SHARE TITLE DIFFER. The root layout carries
 * `title.template = "%s — Mortgage Punk"`, which applies to the <title> tag
 * only; Open Graph tags get no template. So `title` here is the bare page
 * name and the share title is assembled with the suffix, which is what makes
 * a Facebook post read "Buy a Home — Mortgage Punk" instead of "Buy a Home".
 */

export const SITE_NAME = "Mortgage Punk";

/** The approved hero comp, cropped to 1200x630: logo, headline, Chris. */
export const DEFAULT_OG_IMAGE = {
  url: "/brand/og-default.jpg",
  width: 1200,
  height: 630,
  alt: "Mortgage Punk — Reimagining the American Dream. Chris Waipa.",
};

type Img = { url: string; width: number; height: number; alt: string };

export function pageMeta({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  absolute = false,
  index = true,
}: {
  /** The bare page name. The layout's template adds the suffix to <title>. */
  title: string;
  description: string;
  /** Root-relative, e.g. "/about". Resolved against metadataBase. */
  path: string;
  image?: Img;
  /** Set for a title that already reads as the whole brand — the home page. */
  absolute?: boolean;
  index?: boolean;
}): Metadata {
  const shareTitle = absolute ? title : `${title} — ${SITE_NAME}`;

  return {
    title: absolute ? { absolute: title } : title,
    description,
    /* Gives every page its own canonical, which is also what stops search
       engines treating the whole site as duplicates of the home page. */
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [image.url],
    },
    ...(index ? {} : { robots: { index: false, follow: false } }),
  };
}
