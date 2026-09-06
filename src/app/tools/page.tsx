import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import ToolsTabs from "@/components/tools/ToolsTabs";
import LoudLead from "@/components/sections/LoudLead";
import s from "@/components/Site.module.css";
import Link from "next/link";

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
      <PageHead
        tone="bone"
        kicker="Tools"
        title="Run the numbers"
        accent="before anyone calls you."
        lede="No signup, no credit pull, nothing lands in an inbox. Most lender calculators leave out taxes, insurance and mortgage insurance and hand you a number that's thousands off. These don't."
      />

      <section className={`${s.sec} ${s.dark}`} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <ToolsTabs />
        </div>
      </section>

      <section className={`${s.sec} ${s.bone}`}>
        <div className={s.wrap}>
          <div className={s.kick}>What the numbers can&rsquo;t tell you</div>
          <h2 className={s.h2}>
            A calculator
            <br />
            <em>isn&rsquo;t an underwriter.</em>
          </h2>
          <p className={`${s.lede} ${s.prose}`}>
            These give you a solid working estimate. What they can&rsquo;t see is
            your credit profile, your reserves, your job history, or which of the
            dozen programs actually fits your situation — which is why plenty of
            people qualify for more than a calculator suggests, and occasionally
            less.
          </p>
          <div className={s.lend} style={{ marginTop: 44 }}>
            <div className={s.c}>
              <div className={s.n}>01</div>
              <h3>Get the real number</h3>
              <p>
                A full pre-approval, underwritten up front. Takes about a day and
                it&rsquo;s what actually holds up when you make an offer.
              </p>
            </div>
            <div className={s.c}>
              <div className={s.n}>02</div>
              <h3>Free guides</h3>
              <p>
                Checklists and walkthroughs you can keep. No gate on the ones
                that are genuinely useful.
              </p>
            </div>
            <div className={s.c}>
              <div className={s.n}>03</div>
              <h3>Just ask</h3>
              <p>
                The assistant in the corner answers process questions any hour.
                A person picks it up when it matters.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 34, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/get-approved" className={`${s.btn} ${s.btnSolid}`}>
              Get pre-approved &rarr;
            </Link>
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
