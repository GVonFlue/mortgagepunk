# mortgagepunklive.com → mortgagepunk.com/movement

Add this to `next.config.ts`. If the file already has a `redirects()`, merge the
array rather than replacing it.

```ts
async redirects() {
  return [
    // The conference lives at /movement on the main site so every link,
    // mention and share pools its authority into one domain instead of
    // splitting it across two. Serving the same content at 200 on both
    // hostnames would look like duplicate content to Google and divide the
    // ranking signal — which is exactly what we're avoiding.
    //
    // 308 (permanent) tells search engines to move the equity across.
    {
      source: "/:path*",
      has: [{ type: "host", value: "(www\\.)?mortgagepunklive\\.com" }],
      destination: "https://mortgagepunk.com/movement",
      permanent: true,
    },
  ];
}
```

## Vercel setup

1. Project → Settings → Domains → **Add** `mortgagepunklive.com`
2. Add `www.mortgagepunklive.com` too and let Vercel redirect it to the apex
3. Point the nameservers or A/CNAME records at Vercel per its instructions
4. Do **not** use Vercel's built-in "Redirect to another domain" option — the
   config above sends everything to `/movement` specifically, which the Vercel
   setting cannot do

## Before you cut over

The current Webflow site at mortgagepunklive.com is still promoting **April 25,
2026**, an event that has already happened. Whatever is worth keeping from it
should move to `/movement` first — the giveaway sponsors, the breakout
descriptions, the Jaelen Johnston booking — because the moment the redirect is
live that content is gone.

## Deep links worth preserving

If anything currently links to a specific page on the live domain (an Eventbrite
campaign, a printed QR code, a sponsor deck), add a targeted rule *above* the
catch-all so it lands somewhere sensible:

```ts
{
  source: "/book-tickets",
  has: [{ type: "host", value: "(www\\.)?mortgagepunklive\\.com" }],
  destination: "https://mortgagepunk.com/movement#tickets",
  permanent: true,
},
```
