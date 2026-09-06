import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Hero from "@/components/sections/Hero";
import ProofStrip from "@/components/sections/ProofStrip";
import ThreeDoors from "@/components/sections/ThreeDoors";
import ToolsTeaser from "@/components/sections/ToolsTeaser";
import AskSection from "@/components/sections/AskSection";
import Testimonials from "@/components/sections/Testimonials";
import LibraryTeaser from "@/components/sections/LibraryTeaser";
import MovementBlock from "@/components/sections/MovementBlock";
import LendingBrief from "@/components/sections/LendingBrief";
import LeadSection from "@/components/sections/LeadSection";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Mortgage Punk — Reimagining the American Dream",
  description:
    "A world-class lending team and a movement to change the Game of Money. Get approved the right way, run your own numbers, or follow the movement.",
};

export const revalidate = 300;

/**
 * Homepage order, and the reasoning behind it.
 *
 *  1 Hero              the brand, and the two loudest actions
 *  2 ProofStrip        four reasons to keep reading
 *  3 ThreeDoors        the fork — ready / curious / learning. The middle door
 *                      is new and is where most traffic actually sits
 *  4 ToolsTeaser       something to DO. This is what makes people stay
 *  4b AskSection       the assistant, inline. Sits right after the tools
 *                      because someone who just ran their numbers has exactly
 *                      one follow-up, and that is the warmest moment here
 *  5 Testimonials      social proof, immediately after we've been useful
 *  6 LendingBrief      the business, on a light band
 *  7 LibraryTeaser     free education
 *  8 MovementBlock     the conference and the mission
 *  9 LeadSection       final capture
 *
 * Two changes from the old order worth keeping: the tools sit high, because a
 * visitor who runs their numbers is warmer than one who bounced past a form;
 * and proof lands right after we've given something away rather than in the
 * footer where nobody reads it.
 */
export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <ProofStrip />
      <ThreeDoors />
      <ToolsTeaser />
      <AskSection />
      <Testimonials />
      <LendingBrief />
      <LibraryTeaser />
      <MovementBlock />
      <LeadSection />
      <SiteFooter />
    </>
  );
}
