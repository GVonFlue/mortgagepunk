import type { Metadata } from "next";
import WheelStage from "./WheelStage";

/* The live-drawing wheel for giveaways at Backstage Pass nights and the
   conference. It is a tool for whoever is running the room, not a page for
   the public to land on, so it stays out of search and out of the sitemap.
   It has no site nav or footer on purpose: it gets projected. */
export const metadata: Metadata = {
  title: "Live Drawing · Mortgage Punk",
  description: "The Mortgage Punk live drawing wheel.",
  robots: { index: false, follow: false },
};

export default function WheelPage() {
  return <WheelStage />;
}
