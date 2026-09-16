import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteNav from "@/components/layout/SiteNav";
import Section from "@/components/layout/Section";
import PageGround from "@/components/layout/PageGround";

import Hero from "@/components/sections/Hero";
import ThreeDoors from "@/components/sections/ThreeDoors";
import LendingBrief from "@/components/sections/LendingBrief";
import ToolsTiles from "@/components/tools/ToolsTiles";
import MoneyWall from "@/components/sections/MoneyWall";
import MovementBlock from "@/components/sections/MovementBlock";
import ChrisSection from "@/components/sections/ChrisSection";
import ChatStage from "@/components/chat/ChatStage";
import LeadForm from "@/components/sections/LeadForm";

export const metadata = {
  title: "Mortgage Punk — Reimagining the American Dream",
  description:
    "A world-class lending team and a movement to change the Game of Money. Get approved, run your own numbers, or follow the movement.",
};

export const revalidate = 300;

/**
 * ONE PAGE, EIGHT SECTIONS.
 *
 * Restructured so the homepage IS the site rather than a directory pointing at
 * it. Every nav item scrolls to a section here; only Get Approved leaves.
 *
 * The deep pages all still exist at their own URLs and stay indexed — they are
 * what search finds and what someone clicks for depth. They are simply no
 * longer the path you have to walk to understand the business.
 *
 * Each section is a <Section>, which allows exactly one headline and at most
 * one call to action. That constraint is the reason the page reads as one
 * continuous thing instead of eight separately designed blocks: the visitor
 * learns the rhythm in the first section and stops having to work.
 *
 * ORDER, and why:
 *   Hero      the brand, and the only two things anyone can do
 *   Proof     four reasons to keep scrolling
 *   Lending   what we actually do — buy, refinance, invest
 *   Tools     something to DO, before anyone is asked for anything
 *   Money     the content itself, not an advert for the content
 *   Movement  the conference, as evidence the movement is real
 *   Chris     one photo and eighty words
 *   Proof     client stories, once we have been useful
 *   Ask       the assistant
 *   Contact   the only form on the page
 */
export default function Home() {
  return (
    <>
      <AnnouncementBar />
      {/* One sticky nav sitewide. The hero used to carry its own, which lived
          inside the scaled stage and scrolled away with it.

          Deliberately NOT wrapped in .mp-above-ground: a sticky element is
          constrained by its parent's box, so a short wrapper would pin it for
          a few pixels and then release it. It carries z-index:70 itself, which
          already clears the ground. */}
      <SiteNav />
      <Hero />

      {/* Fixed concrete for the whole page below the hero. */}
      <PageGround />

      <ThreeDoors />

      <Section
        id="movement"
        sit="open"
        center
        kicker="The Movement"
        title="The American Dream"
        accent="isn't a checklist."
        lede="It's the freedom and the opportunity to rewrite your story."
        cta={{ label: "Enter the movement", href: "/movement" }}
      >
        <MovementBlock />
      </Section>

      {/* open: the video wall IS the design, so no panel competes with it */}
      <Section
        id="money"
        sit="open"
        kicker="The Game of Money"
        title="Everything they never taught you"
        accent="about money."
        cta={{ label: "Show me more", href: "/library" }}
      >
        <MoneyWall />
      </Section>

      <Section
        id="lending"
        sit="float"
        kicker="The Lending Team"
        title="A movement out front."
        accent="A serious operation behind it."
        lede="Three ways in. The process is the same either way — what changes is the paperwork and what we're solving for."
      >
        <LendingBrief />
      </Section>

      <Section
        id="ask"
        sit="solid"
        kicker="Ask anything"
        title="No dumb questions."
        accent="Only expensive silence."
        lede="Most people don't ask because they think they should already know. Ask here instead."
      >
        <ChatStage variant="inline" />
      </Section>

      <Section
        id="tools"
        sit="float"
        kicker="Run your own numbers"
        title="No form. No call."
        accent="Just the math."
        lede="Most lender calculators leave out taxes, insurance and mortgage insurance, then hand you a number that's thousands off. These don't."
      >
        <ToolsTiles />
      </Section>

      <Section
        id="chris"
        sit="float"
        kicker="Chris"
        title="Two words that were"
        accent="never supposed to go together."
      >
        <ChrisSection />
      </Section>

      <Section
        id="contact"
        tone="red"
        sit="solid"
        kicker="Start here"
        title="Talk to a person."
        accent="Not a call center."
        lede="Tell us where you are and someone from the team comes back to you."
      >
        <LeadForm />
      </Section>

      <div className="mp-above-ground">
        <SiteFooter />
      </div>
    </>
  );
}
