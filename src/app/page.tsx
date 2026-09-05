import Hero from "@/components/sections/Hero";
import ProofStrip from "@/components/sections/ProofStrip";
import TwoPaths from "@/components/sections/TwoPaths";
import LibraryTeaser from "@/components/sections/LibraryTeaser";
import MovementBlock from "@/components/sections/MovementBlock";
import LendingBrief from "@/components/sections/LendingBrief";
import LeadSection from "@/components/sections/LeadSection";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Mortgage Punk — Reimagining the American Dream",
  description:
    "A world-class lending team and a movement to change the Game of Money. Get approved the right way, or follow the movement.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <TwoPaths />
      <LibraryTeaser />
      <MovementBlock />
      <LendingBrief />
      <LeadSection />
      <SiteFooter />
    </>
  );
}
