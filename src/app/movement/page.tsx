import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import LeadSection from "@/components/sections/LeadSection";
import s from "@/components/Site.module.css";

export const metadata = {
  title: "The Movement — Mortgage Punk",
  description:
    "Reimagining the American Dream. The mission behind Mortgage Punk, in Chris Waipa's own words.",
};

export default function Movement() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead
        kicker="The Movement"
        title="Reimagining"
        accent="the American Dream."
        lede="The American Dream is not a predetermined checklist. It is the freedom and opportunity to rewrite your story."
      />

      <section className={`${s.sec} ${s.ink}`}>
        <div className={s.wrap}>
          <div className={s.kick}>How it started</div>
          <h2 className={s.h2}>Two words that were<br /><em>never supposed to go together.</em></h2>
          <p className={s.lede}>
            More than two decades ago Chris and his wife were seriously chasing music.
            Creativity, connection, and the chance to affect people were a real part of
            who he was. Life took him into mortgage lending instead, where he built a
            career — and grew steadily more frustrated with an industry that left people
            confused, stressed, and treated like transactions.
          </p>
          <p className={s.lede}>
            Then during a branding conversation, a young designer described an idea as
            looking like &ldquo;mortgage punk.&rdquo; The two words were not supposed to
            fit together. That was exactly why they worked.
          </p>
          <p className={s.lede}>
            What began as an unconventional approach to a very conventional industry has
            grown into a lending team, a media platform, an education community, a live
            event, and a movement.
          </p>
        </div>
      </section>

      <section className={`${s.sec} ${s.bone}`}>
        <div className={s.wrap}>
          <div className={s.kick}>What we stand for</div>
          <h2 className={s.h2}>Changing the<br /><em>Game of Money.</em></h2>
          <p className={s.lede}>
            It started by challenging the mortgage experience, but it is bigger than that
            now: homeownership, real estate investing, taxes, entrepreneurship, building
            wealth, and living beyond a paycheck. At the centre is a movement to reimagine
            the American Dream and give people the knowledge, relationships, freedom, and
            opportunity to rewrite their own story.
          </p>
        </div>
      </section>

      <section className={`${s.sec} ${s.dark}`}>
        <div className={s.wrap}>
          <div className={s.evt}>
            <div className={s.tag}>Live &middot; October 16, 2027</div>
            <h3>The American Dream Conference</h3>
            <div className={s.meta}>
              Hyatt Regency &middot; Wichita, Kansas<br />
              Keynote: Hannah Hammond<br />
              A live experience built around one idea: the freedom and opportunity to
              rewrite your story.
            </div>
            <a href="https://mortgagepunklive.com" className={`${s.btn} ${s.ghost}`}
               target="_blank" rel="noopener noreferrer">
              Conference details &rarr;
            </a>
          </div>
        </div>
      </section>

      <LeadSection />
      <SiteFooter />
    </>
  );
}
