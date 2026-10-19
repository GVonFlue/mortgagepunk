import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import Section from "@/components/layout/Section";
import PageGround from "@/components/layout/PageGround";

import CompHero from "@/components/sections/CompHero";
import CompAsk from "@/components/sections/CompAsk";
import MoneyWall from "@/components/sections/MoneyWall";
import SocialWall from "@/components/sections/SocialWall";

export const metadata = {
  title: "Mortgage Punk — Reimagining the American Dream",
  description:
    "A world-class lending team and a movement to change the Game of Money. Ask anything, watch the library, or follow the movement.",
};

export const revalidate = 300;

/**
 * THE HOMEPAGE — four things, in order.
 *
 * Stripped to the Avril model: land, scroll, understand, leave when ready.
 * Every nav item scrolls to a section here; only Chris and Get Approved leave.
 *
 *   Hero      the brand and the one commercial action
 *   Ask       the assistant, immediately — no preamble
 *   Money     one feature video and three below it
 *   Movement  a wall of posts, and one way in
 *
 * WHAT CAME OFF, and where it went:
 *   Tools, Lending, the three doors, testimonials, the Chris teaser and the
 *   contact form. Every one of those pages still exists at its own URL and
 *   stays indexed — /tools, /lending, /about, /testimonials, /contact. They
 *   stopped being the path and became the depth, which is what protects the
 *   search traffic while the homepage stays this short.
 *
 * Headlines carry no supporting line by design. The section names are the
 * whole message; anything under them was the site explaining itself.
 */
export default function Home() {
  return (
    <>
      <AnnouncementBar />
      {/* Sticky, and deliberately not wrapped — a sticky element is confined to
          its parent's box, so a short wrapper would release it immediately. */}
      <SiteNav />
      <CompHero />

      {/* fixed concrete for everything below the hero */}
      <PageGround />

      {/* The Ask section is the approved mockup with live controls on top,
          so it brings its own headline artwork and needs no Section wrapper
          or titleArt. id stays for the nav anchor. */}
      <div id="ask" style={{ scrollMarginTop: "84px" }}>
        <CompAsk />
      </div>

      <Section
        id="money"
        sit="open"
        center
        full
        title="The Game of Money"
        titleArt={{
          // v2, cut from the designer's vector file. The mark is now two
          // stacked lines rather than one, so it is far taller relative to
          // its width (1.35:1 against the old 2.67:1) — hence the smaller
          // cap. Keeping 660 here would have made it twice the height of
          // the section head it sits in.
          src: "/brand/wordmark-game-of-money-v2.png",
          width: 1437,
          height: 1068,
          cap: 420,
        }}
      >
        <MoneyWall />
      </Section>

      <Section
        id="movement"
        sit="open"
        center
        full
        title="The Movement"
        titleArt={{
          // v2, same source. Close to the old proportion (2.25:1), so the
          // cap barely moves.
          src: "/brand/wordmark-the-movement-v2.png",
          width: 1990,
          height: 884,
          cap: 600,
        }}
      >
        <SocialWall />
      </Section>

      <SiteFooter />
    </>
  );
}
