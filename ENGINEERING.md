# Mortgage Punk — Engineering Rules

These are constraints, not suggestions. If a change violates one of these, the
change is wrong, not the rule.

## Components

**One component file per section. Never a monolithic `page.tsx`.**

A route's `page.tsx` composes sections and does nothing else — no markup beyond
the composition, no inline section bodies, no "just this once" exceptions.

```
src/app/page.tsx          composes; owns no section markup
src/components/sections/  one file per page section (Hero.tsx, Proof.tsx, ...)
src/components/layout/    nav, footer, shells, page chrome
src/components/ui/        primitives reused across sections (Button, Rule, ...)
src/lib/                  pure helpers, constants, types. No JSX.
public/brand/             brand assets. See "Assets" below.
```

When a section grows past roughly one screenful of code, split it — a section
file that has grown its own sub-sections is a directory waiting to happen.

## Server components by default

Every component is a server component unless it genuinely cannot be. `"use
client"` is a cost: it ships the component and its imports to the browser, and
it pulls every child into the client bundle with it.

A component may be a client component only for: state or refs, effects, browser
event handlers, browser-only APIs, or a client-only third-party library.
Wanting to is not a reason.

**Every `"use client"` carries a comment on the line below saying why.** No
exceptions — an uncommented directive fails review.

```tsx
"use client";
// Needs IntersectionObserver to trigger the headline's assemble-in on scroll.
```

Push the boundary as far down the tree as it will go. If one button inside a
section needs interactivity, the button is the client component, not the
section.

## Secrets

**No secrets in `NEXT_PUBLIC_` variables.** Anything prefixed `NEXT_PUBLIC_` is
inlined into the JavaScript bundle at build time and is readable by anyone who
opens devtools. It is public the moment it is built, and rotating it later does
not un-publish it.

`NEXT_PUBLIC_` is for values that are already public: the site's own URL, a
public analytics site ID, a publishable client key that the vendor documents as
publishable. API keys, tokens, signing secrets, database URLs, and anything from
a vendor's "keep this server-side" list are read without the prefix, in server
components, route handlers, or server actions only.

## Storage

**No `localStorage`. No `sessionStorage`. Anywhere.**

Not for preferences, not for dismissed banners, not for a "seen the intro"
flag, not for form drafts, not behind a `typeof window !== "undefined"` guard.
They are unavailable during server rendering, they throw outright in some
privacy configurations, and they desync the first client paint from the server
HTML. If something genuinely must persist, raise it as a decision rather than
reaching for browser storage quietly. In-memory React state covers the session.

## Color

**`#EB2933` is not up for reinterpretation.**

It is sampled from the delivered logo. It is not a suggestion, not a starting
point, and not "close enough to" any Tailwind red. Do not warm it, cool it,
darken it for contrast, or substitute a palette value that looks similar in a
screenshot.

Consume it as the token, never as a literal:

```tsx
<span className="text-mp-red" />        // yes
<span style={{ color: "#EB2933" }} />   // no
```

`--mp-red-deep` (`#B81F27`) exists for pressed/hover/shadowed states. Reach for
it rather than inventing a new derivation of the brand red.

All tokens live in `src/app/globals.css`. `tailwind.config.ts` mirrors them by
reference — it restates no literal values. Change a token in one place.

## Motion

**All motion respects `prefers-reduced-motion`.**

`globals.css` carries a global reduce rule that collapses animation and
transition durations. That is a floor, not a licence to stop thinking: any
motion driven by JavaScript (scroll-linked, observer-driven, staggered
sequences) must check the media query itself and render the finished state
immediately when reduce is set. Never render a permanently-hidden element that
only becomes visible via an animation that reduced-motion just disabled.

The feel is **a poster assembling itself** — heavy, deliberate, weighted, with
things arriving and settling into place.

- Easing is `--ease-out-heavy` for entrances and `--ease-in-heavy` for exits.
- Durations are `--dur-fast` (240ms), `--dur-base` (520ms), `--dur-slow` (900ms).
- **No bounce. No spring easing anywhere.** No overshoot, no elastic, no `back`
  curves, no physics-based spring libraries. Nothing in this project wobbles
  when it lands.

## Type

Display is Anton (`--font-display`); Archivo Black (`--font-display-alt`) is
the heavier substitute for short, wide lockups where Anton reads too condensed.
Body is Inter (`--font-body`).

Display type clamps to ~12vw at the hero, tracking `-0.03em`, line-height
`0.82`. Body sits between 16px and 18px. Use the `.mp-display` / `.mp-display-alt`
classes so tracking and leading stay locked together.

**Fonts come from `next/font/google` only.** No CDN `<link>` tags, no
self-hosted `@font-face`, no Adobe/Typekit. Adding a font means adding it in
`src/app/layout.tsx` alongside the others.

## Assets

`public/brand/` holds four files, and that is the complete delivered set:

| File | Size | Note |
| --- | --- | --- |
| `mortgagepunk-logo@3x.png` | 1209×825 | The only logo raster that exists |
| `chris-hero-bwred.png` | 879×1116 | |
| `chris-hero-color.png` | 879×1116 | |
| `hero-plate.jpg` | 2560×1440 | |

### The logo is @3x only

**There is no 1x logo.** It was never delivered, so it does not exist — do not
add a `mortgagepunk-logo.png` alongside the @3x, and do not write markup that
assumes a 1x/2x/3x set. Reference `mortgagepunk-logo@3x.png` everywhere and let
`next/image` downscale it; it handles this correctly and emits appropriately
sized variants.

### The logo must be replaced with an SVG before go-live

`mortgagepunk-logo@3x.png` is not a true @3x export. Its source is a **403px
raster**, upscaled 3× (403 × 3 = 1209, matching the file exactly). There is no
additional detail in it — it is a soft, interpolated enlargement of a small
bitmap, and it will show its edges anywhere it renders large, on any HiDPI
display, or against flat brand color.

**Action item, blocking for launch:** obtain vector artwork and replace this
file with an SVG. Until that lands, keep the logo small on screen, never render
it above roughly 400px wide, and do not use it as a hero element.

## Checklist before opening a PR

- [ ] No section markup added to a `page.tsx`
- [ ] Every `"use client"` is necessary and carries its why-comment
- [ ] No secret behind a `NEXT_PUBLIC_` prefix
- [ ] No `localStorage` / `sessionStorage`
- [ ] Brand red consumed as a token, never as a hex literal
- [ ] New motion honors `prefers-reduced-motion`, and does not bounce
