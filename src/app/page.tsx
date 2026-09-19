import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import Section from "@/components/layout/Section";
import PageGround from "@/components/layout/PageGround";

import Hero from "@/components/sections/Hero";
import ChatStage from "@/components/chat/ChatStage";
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
      <Hero />

      {/* fixed concrete for everything below the hero */}
      <PageGround />

      <Section id="ask" sit="open" center title="Ask Mortgage Punk">
        <ChatStage variant="inline" />
      </Section>

      <Section id="money" sit="open" center full title="The Game of Money">
        <MoneyWall />
      </Section>

      <Section id="movement" sit="open" center full title="The Movement">
        <SocialWall />
      </Section>

      <SiteFooter />
    </>
  );
}
