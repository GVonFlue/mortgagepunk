import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import ToolsTiles from "@/components/tools/ToolsTiles";
import LoudLead from "@/components/sections/LoudLead";
import s from "@/components/Site.module.css";
import { APPLY_URL, EXTERNAL } from "@/lib/links";

export const metadata = {
  title: "Tools — Mortgage Punk",
  description:
    "Free mortgage calculators that include taxes, insurance and PMI instead of hiding them. Affordability, monthly payment, and refinance break-even.",
};

export default function Tools() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />

      {/* Chris pointing straight down the lens. The whole page is "you, run
          your own numbers", and the gesture says it before the copy does. */}
      <section className={s.toolsHero}>
        <div className={s.toolsHeroWrap}>
          <div className={s.toolsHeroCopy}>
            <div className={s.kick}>Tools</div>
            <h1 className={s.h2}>
              Run the numbers
              <em>before anyone calls you.</em>
            </h1>
            <p className={`${s.lede} ${s.prose}`}>
              No signup, no credit pull, nothing lands in an inbox. Most lender
              calculators leave out taxes, insurance and mortgage insurance and
              hand you a number that&rsquo;s thousands off. These don&rsquo;t.
            </p>
          </div>
        </div>
      </section>

      <section className={`${s.sec} ${s.dark}`}>
        <div className={s.wrap}>
          <ToolsTiles />
        </div>
      </section>

      <section className={`${s.sec} ${s.bone}`}>
        <div className={s.wrap}>
          <div className={s.kick}>What the numbers can&rsquo;t tell you</div>
          <h2 className={s.h2}>
            A calculator
            <em>isn&rsquo;t an underwriter.</em>
          </h2>
          <p className={`${s.lede} ${s.prose}`}>
            These give a solid working estimate. What they can&rsquo;t see is
            your credit profile, your reserves, your job history, or which of
            the dozen programs actually fits — which is why plenty of people
            qualify for more than a calculator suggests, and occasionally less.
          </p>
          <div style={{ marginTop: 34, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={APPLY_URL} {...EXTERNAL} className={`${s.btn} ${s.btnSolid}`}>
              Get pre-approved &rarr;
            </a>
            <Link href="/freebies" className={`${s.btn} ${s.btnGhost}`}>
              Free guides &rarr;
            </Link>
          </div>
        </div>
      </section>

      <LoudLead
        kicker="When you're ready"
        title="Numbers are a start."
        accent="A person is better."
        lede="Send them over and someone from the team will tell you what they actually mean for you."
      />
      <SiteFooter />
    </>
  );
}
