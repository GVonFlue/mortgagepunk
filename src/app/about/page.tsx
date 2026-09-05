import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PhotoSlot from "@/components/ui/PhotoSlot";
import a from "@/components/sections/About.module.css";

export const metadata = {
  title: "About Chris Waipa — Mortgage Punk",
  description:
    "Founder of Mortgage Punk, loan officer, speaker, and creator of the American Dream Conference. Reimagining the American Dream.",
};

/**
 * /about — built as an ARTIST SITE, not a corporate bio page.
 *
 * Chris's onboarding was explicit: the Avril reference is about the
 * experience, not the brand. "It feels like entering the world of an artist,
 * not navigating a traditional corporate website." So: full-bleed photography,
 * poster-scale type, a marquee ticker, and speaking topics laid out the way an
 * artist site lists tour dates.
 *
 * Copy is Chris's own, from onboarding. Do not rewrite it without asking.
 */

const TALKS = [
  ["01", "Reimagining the American Dream",
   "Why the American Dream isn't dead, and why today's generation needs the tools and the freedom to redefine it."],
  ["02", "The Game of Money",
   "The rules around money, homeownership, investing, taxes, income and wealth that most people were never taught."],
  ["03", "Living Beyond a Paycheck",
   "Moving past simply earning income toward ownership, assets, opportunity and freedom."],
  ["04", "Building the Impossible",
   "Chris's story, Mortgage Punk, and challenging people to rethink what they believe is possible."],
  ["05", "Disrupting a Commodity Business",
   "How personality, community, education and culture turn a commodity service into something people actually want to belong to."],
];

const MARQUEE = [
  "Reimagining the American Dream",
  "The Game of Money",
  "Living Beyond a Paycheck",
];

/** `pending` items render dimmed and must not publish until verified. */
const PRESS = [
  { kind: "Feature", outlet: "Wichita Real Producers",
    note: "Feature story on Chris Waipa and the rise of Mortgage Punk." },
  { kind: "Recognition", outlet: "Scotsman Guide",
    note: "Top Originator recognition." },
  { kind: "Broadcast", outlet: "KSN",
    note: "Coverage of Mortgage Punk and the American Dream Conference." },
  { kind: "Pending", outlet: "The Wall Street Journal",
    note: "Held back until the appearance is verified and linked.", pending: true },
];

export default function About() {
  return (
    <>
      <SiteNav />

      {/* 1 — full-bleed hero */}
      <section className={a.hero}>
        <div className={a.heroImg}>
          <Image
            src="/brand/chris-red.jpg"
            alt="Chris Waipa"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "58% 28%" }}
          />
        </div>
        <div className={a.heroInner}>
          <div className={a.eyebrow}>Founder &middot; Speaker &middot; Movement Leader</div>
          <h1 className={a.name}>
            Chris
            <br />
            <span className={a.nameSub}>Waipa</span>
          </h1>
          <div className={a.heroMeta}>
            <span>Loan Officer</span>
            <span>Founder, Mortgage Punk</span>
            <span>Creator, The American Dream Conference</span>
          </div>
        </div>
      </section>

      {/* 2 — marquee. Duplicated once so the -50% loop is seamless. */}
      <div className={a.marquee}>
        <div className={a.marqueeTrack}>
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>
              {t}
              <span aria-hidden="true"> &#9670; </span>
            </span>
          ))}
        </div>
      </div>

      {/* 3 — the story */}
      <section className={a.story}>
        <div className={a.storyGrid}>
          <div>
            <p className={a.pull}>
              Two words that were
              <br />
              <em>
                never supposed to
                <br />
                go together.
              </em>
            </p>
            <div className={a.body}>
              <p>
                More than two decades ago, Chris and his wife were seriously
                chasing music. Creativity, connection, and the chance to affect
                people were a real part of who he was.
              </p>
              <p>
                Life took him into mortgage lending instead, where he built a
                successful career and grew steadily more frustrated by an
                industry that left people confused, stressed, and treated like
                transactions rather than people.
              </p>
              <p>
                Then, during a branding conversation, a young designer described
                an idea as looking like <strong>&ldquo;mortgage punk.&rdquo;</strong>{" "}
                The two words were not supposed to fit together. That was exactly
                why they worked.
              </p>
              <p>
                What began as an unconventional approach to a very conventional
                industry has grown into a lending team, a media platform, an
                education community, a live event, and a movement.
              </p>
              <p>
                Today Chris is building a world-class lending team and a growing
                ecosystem connecting homeownership, real-estate investing, taxes,
                entrepreneurship, wealth-building and living beyond a paycheck.{" "}
                <strong>
                  The stage changed from the music days. The desire to use
                  creativity and connection to impact people&rsquo;s lives never
                  did.
                </strong>
              </p>
            </div>
          </div>
          <div className={a.portrait}>
            <Image
              src="/brand/chris-suit.png"
              alt="Chris Waipa"
              width={630}
              height={954}
              sizes="(max-width: 900px) 80vw, 34vw"
            />
            <span className={a.portraitTag}>Wichita, Kansas</span>
          </div>
        </div>
      </section>

      {/* 4 — speaking topics as a tour-date list */}
      <section className={a.dates} id="speaking">
        <div className={a.datesHead}>
          <div className={a.kick}>On Stage</div>
          <h2 className={a.h2}>
            Book Chris
            <br />
            <em>for your stage.</em>
          </h2>
          <p className={a.lede}>
            Five talks, built from twenty years of watching people get talked
            down to about their own money. Pick the one your room needs.
          </p>
        </div>
        <div className={a.dateList}>
          {TALKS.map(([n, title, blurb]) => (
            <Link key={n} href="/contact" className={a.dateRow}>
              <span className={a.dateNo}>{n}</span>
              <div>
                <h3 className={a.dateTitle}>{title}</h3>
                <p className={a.dateBlurb}>{blurb}</p>
              </div>
              <span className={a.dateGo}>
                Enquire <i>&rarr;</i>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5 — press */}
      <section className={a.press} id="press">
        <div className={a.pressInner}>
          <div className={a.pressLead}>
            <div>
              <div className={a.kick}>Press &amp; Appearances</div>
              <h2 className={a.h2} style={{ color: "var(--mp-bone)" }}>
                In the wild.
              </h2>
            </div>
            <p className={a.lede} style={{ color: "#8E8E8E", margin: 0, maxWidth: "44ch" }}>
              Features, recognition, and coverage. Only verified appearances get
              published here.
            </p>
          </div>

          <div className={a.pressCards}>
            {PRESS.map((p) => (
              <article
                key={p.outlet}
                className={`${a.pressCard} ${p.pending ? a.pressPending : ""}`}
              >
                <PhotoSlot
                  className={a.pressCover}
                  label="Cover image"
                  hint="Screenshot or photo"
                />
                <div className={a.pressMeta}>
                  <span className={a.pressOutlet}>{p.kind}</span>
                  <h3 className={a.pressTitle}>{p.outlet}</h3>
                  <p className={a.pressNote}>{p.note}</p>
                </div>
              </article>
            ))}
          </div>

          <div className={a.todo}>
            TODO: cover images needed for each item, and the Wall Street Journal
            appearance must be verified before it publishes.
          </div>
        </div>
      </section>

      {/* 6 — booking */}
      <section className={a.book}>
        <div className={a.bookInner}>
          <div className={a.bookGrid}>
            <div>
              <div className={a.kick} style={{ color: "var(--mp-black)" }}>
                Booking
              </div>
              <h2 className={a.h2}>
                Get Chris
                <br />
                <em>in the room.</em>
              </h2>
              <p className={a.lede}>
                Speaking, press, podcasts, and partnerships. Tell us the room and
                the date and someone comes back to you.
              </p>
              <div className={a.bookBtns}>
                <Link href="/contact" className={`${a.btn} ${a.btnDark}`}>
                  Book Chris to speak &rarr;
                </Link>
                <Link href="/contact" className={`${a.btn} ${a.btnOutline}`}>
                  Press enquiries &rarr;
                </Link>
              </div>
            </div>
            <PhotoSlot
              className={a.bookSlot}
              label="Chris on stage"
              hint="Photo needed from Mortgage Punk"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
