import type { NextConfig } from "next";

/**
 * The conference domains both land on /movement.
 *
 * americandreamlive.com and mortgagepunklive.com are separate registrations
 * that exist to be typed off a flyer or a slide. Neither needs a site of its
 * own: everything they would say already lives at /movement, and splitting the
 * same content across three hostnames splits the search ranking three ways
 * instead of pooling it on one.
 *
 * WHY THIS IS HERE AND NOT IN VERCEL'S DOMAIN SETTINGS. Vercel's "Redirect to
 * Another Domain" sends a hostname to another hostname — it cannot aim at a
 * path. These have to land on /movement specifically, not on the home page, so
 * the rule belongs in the app where it can name the path.
 *
 * ORDER OF OPERATIONS. The destination is mortgagepunk.com, so that domain has
 * to be pointing at this site before these two are switched over. Pointed
 * first, they would redirect to a page on whatever mortgagepunk.com still
 * resolves to.
 *
 * 308 rather than 302: permanent, so the ranking these domains carry moves
 * across rather than being held where it cannot be used.
 */
const CONFERENCE_DOMAINS = [
  "(www\\.)?americandreamlive\\.com",
  "(www\\.)?mortgagepunklive\\.com",
];

function supabaseHost() {
  try {
    const u = new URL(process.env.SUPABASE_URL ?? "");
    if (u.protocol !== "https:" || u.hostname.endsWith(".supabase.co")) return [];
    return [{ protocol: "https" as const, hostname: u.hostname, pathname: "/storage/v1/object/public/**" }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  /* Pictures uploaded through Backstage live in Supabase storage, not in
     /public, and next/image refuses any outside address that isn't listed
     here. Without this, a photo swapped in Backstage → Photos or a new tile
     on the Movement wall would save fine and then fail to show. Public
     storage objects only, nothing else on the host. */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // And whatever host SUPABASE_URL actually names, in case the project
      // is ever moved onto a custom domain.
      ...supabaseHost(),
    ],
  },
  async redirects() {
    return CONFERENCE_DOMAINS.map((host) => ({
      /* Every path, not just the root. A QR code printed with a deep link
         still has somewhere to land. */
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://mortgagepunk.com/movement",
      permanent: true,
    }));
  },
};

export default nextConfig;
