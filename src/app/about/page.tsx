import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import LeadSection from "@/components/sections/LeadSection";
import s from "@/components/Site.module.css";

export const metadata = {
  title: "About Chris Waipa — Mortgage Punk",
  description:
    "Founder of Mortgage Punk, loan officer, speaker, and creator of the American Dream Conference.",
};

/* Speaking topics are Chris's own, verbatim from onboarding. */
const TOPICS = [
  ["Reimagining the American Dream", "Why the American Dream isn't dead, and why today's generation needs the tools and freedom to redefine it."],
  ["The Game of Money", "The rules around money, homeownership, investing, taxes, income and wealth that most people were never taught."],
  ["Living Beyond a Paycheck", "Moving past simply earning income toward ownership, assets, opportunity and freedom."],
  ["Building the Impossible", "Chris's story, Mortgage Punk, and challenging people to rethink what they believe is possible."],
  ["Disrupting a Commodity Business", "How personality, community, education and culture turn a commodity service into something people belong to."],
];

export default function About() {
  return (
    <>
      <SiteNav />
      <PageHead
        kicker="About Chris"
        title="Loan officer."
        accent="Leading a movement."
        lede="Chris Waipa is the founder of Mortgage Punk, a nationally recognized mortgage professional, speaker, and creator of the American Dream Conference."
      />

      <section className={`${s.sec} ${s.ink}`}>
        <div className={s.wrap}>
          <div className={s.kick}>The story</div>
          <p className={s.lede}>
            Before Chris Waipa ever imagined Mortgage Punk, he was chasing a different
            dream. More than two decades ago he and his wife were seriously pursuing
            music, with aspirations of taking their band to the next level. Music meant
            creativity, connection, and the chance to impact people.
          </p>
          <p className={s.lede}>
            Life took him into mortgage lending, where he built a successful career but
            grew frustrated by an experience that left consumers feeling more like
            transactions than people. Then two incompatible words changed everything.
          </p>
          <p className={s.lede}>
            Today Chris is simultaneously building a world-class lending team and a
            growing ecosystem connecting homeownership, real estate investing, taxes,
            entrepreneurship, wealth-building and living beyond a paycheck. The stage
            changed from the music days. The desire to use creativity and connection to
            impact people's lives never did.
          </p>
        </div>
      </section>

      <section id="speaking" className={`${s.sec} ${s.bone}`}>
        <div className={s.wrap}>
          <div className={s.kick}>Speaking</div>
          <h2 className={s.h2}>Book Chris<br /><em>for your stage.</em></h2>
          <div className={s.lend} style={{ marginTop: 44 }}>
            {TOPICS.slice(0, 3).map((t, i) => (
              <div key={t[0]} className={s.c}>
                <div className={s.n}>{String(i + 1).padStart(2, "0")}</div>
                <h3>{t[0]}</h3>
                <p>{t[1]}</p>
              </div>
            ))}
          </div>
          <div className={s.lend} style={{ marginTop: 2 }}>
            {TOPICS.slice(3).map((t, i) => (
              <div key={t[0]} className={s.c}>
                <div className={s.n}>{String(i + 4).padStart(2, "0")}</div>
                <h3>{t[0]}</h3>
                <p>{t[1]}</p>
              </div>
            ))}
            <div className={s.c}>
              <div className={s.n}>&rarr;</div>
              <h3>Booking</h3>
              <p>Speaking and press inquiries are handled by Ashley Thill.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="press" className={`${s.sec} ${s.dark}`}>
        <div className={s.wrap}>
          <div className={s.kick}>Press &amp; Appearances</div>
          <h2 className={s.h2}>In the wild.</h2>
          <div className={s.todo}>
            TODO: only documented, verified appearances get published. Wichita Real
            Producers, Scotsman Guide Top Originator, and KSN are confirmed. The Wall
            Street Journal appearance must be verified and linked before it goes live.
          </div>
        </div>
      </section>

      <LeadSection />
      <SiteFooter />
    </>
  );
}
