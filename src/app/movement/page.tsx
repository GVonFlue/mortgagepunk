import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import LoudLead from "@/components/sections/LoudLead";
import GfxNote from "@/components/ui/GfxNote";
import s from "@/components/Site.module.css";
import { getConference } from "@/lib/db";

export const metadata = {
  title: "The American Dream Conference — Mortgage Punk",
  description:
    "A live day on the Game of Money, ownership, and building a life beyond a paycheck. Keynotes, breakouts, live music, and real giveaways.",
};

export const revalidate = 300;

/**
 * /movement — rebuilt as a CONFERENCE page.
 *
 * The previous version led with the mission and mentioned the event in a card,
 * which had it backwards: the conference is the thing with a date, a venue and
 * tickets, and it is what mortgagepunklive.com exists to sell. The mission is
 * why it exists, so it now sits underneath rather than in front.
 *
 * Date, venue, keynote, stats and giveaways all come from Backstage →
 * Conference, so Chris updates them once a year without a rebuild.
 *
 * Reference for the running order and giveaways is the live site. Everything
 * marked TODO needs confirming with Ashley before launch — the current live
 * site is still promoting an event that has already happened.
 */

const RUN_ORDER = [
  {
    when: "Morning",
    what: "Doors and the opening keynote",
    body: "It starts loud. No welcome-to-the-conference housekeeping for twenty minutes — the first session is the reason you came.",
  },
  {
    when: "Late morning",
    what: "Breakout sessions",
    body: "Smaller rooms, specific problems. Buying your first place, financing a rental, what to do about debt, keeping more of what you earn.",
  },
  {
    when: "Midday",
    what: "Lunch and the floor",
    body: "The part most people say they got the most out of. A room full of people solving the same problems you are.",
  },
  {
    when: "Afternoon",
    what: "Keynotes two and three",
    body: "The big-picture sessions. What the American Dream looks like now, and what it takes to build one.",
  },
  {
    when: "Late afternoon",
    what: "The giveaways",
    body: "Given away live, on stage, to people in the room. Not a raffle you hear about later.",
  },
  {
    when: "Evening",
    what: "Live music",
    body: "It closes with a concert, because of course it does.",
  },
];

export default async function Movement() {
  const conf = await getConference();

  return (
    <>
      <AnnouncementBar />
      <SiteNav />

      {/* ---------- conference hero ---------- */}
      <section className={s.confHero}>
        <div className={s.confWrap}>
          <span className={s.confDate}>{conf.date_label}</span>
          <h1 className={s.confTitle}>
            The American
            <em>Dream Conference</em>
          </h1>
          <div className={s.confMeta}>
            <span>{conf.venue}</span>
            <span>Keynote: {conf.keynote}</span>
          </div>
          <div className={s.confBtns}>
            <a
              href={conf.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${s.btn} ${s.btnDark}`}
            >
              Get tickets &rarr;
            </a>
            <Link href="#what" className={`${s.btn} ${s.btnOutline}`}>
              What happens &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- what it is ---------- */}
      <section className={`${s.sec} ${s.dark}`} id="what">
        <div className={s.wrap}>
          <div className={s.kick}>What it is</div>
          <h2 className={s.h2}>
            Not a sit-in-a-chair
            <br />
            <em>seminar.</em>
          </h2>
          <p className={s.lede}>{conf.blurb}</p>

          <div className={s.confStats}>
            {conf.stats.map((st) => (
              <div key={st.label} className={s.confStat}>
                <b>{st.value}</b>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- the giveaways ---------- */}
      <section className={`${s.sec} ${s.ink}`}>
        <div className={s.wrap}>
          <div className={s.kick}>Given away live</div>
          <h2 className={s.h2}>
            Somebody in that room
            <br />
            <em>goes home with this.</em>
          </h2>
          <p className={s.lede}>
            On stage, on the day, to people in the seats. Not a raffle you hear
            about in an email a week later.
          </p>

          <div className={s.prizeGrid}>
            {conf.prizes.map((p, i) => (
              <div key={p} className={s.prizeCard}>
                <span className={s.prizeNo}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{p}</h3>
              </div>
            ))}
          </div>

          <div className={s.todo} style={{ marginTop: 26 }}>
            TODO: sponsor logos and prize artwork needed. The current live site
            has images for each of these — worth pulling them across before the
            domain redirect goes in, because they disappear when it does.
          </div>
        </div>
      </section>

      {/* ---------- the day ---------- */}
      <section className={`${s.sec} ${s.dark}`}>
        <div className={s.wrap} style={{ position: "relative" }}>
          <GfxNote where="evt" />
          <div className={s.kick}>The day</div>
          <h2 className={s.h2}>
            How it
            <br />
            <em>actually runs.</em>
          </h2>

          <div className={s.runOrder}>
            {RUN_ORDER.map((r) => (
              <div key={r.when} className={s.runRow}>
                <span className={s.runWhen}>{r.when}</span>
                <div className={s.runWhat}>
                  <h3>{r.what}</h3>
                  <p>{r.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={s.todo} style={{ marginTop: 26 }}>
            TODO: this running order is a reasonable draft, not confirmed. Ashley
            needs to supply the real schedule, the other two keynote speakers,
            and the breakout titles.
          </div>
        </div>
      </section>

      {/* ---------- the mission, now underneath ---------- */}
      <section className={`${s.sec} ${s.bone}`}>
        <div className={s.wrap}>
          <div className={s.kick}>Why it exists</div>
          <h2 className={s.h2}>
            The American Dream
            <br />
            <em>isn&rsquo;t a checklist.</em>
          </h2>
          <p className={s.lede}>
            It&rsquo;s the freedom and the opportunity to rewrite your story.
            That sentence is why the conference exists, and it is the same reason
            Mortgage Punk does.
          </p>
          <p className={s.lede}>
            It started by challenging a broken mortgage experience. It grew into
            a lending team, a media platform, an education community, a live
            event, and a movement built around helping people think bigger than
            the next transaction.
          </p>
          <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/about" className={`${s.btn} ${s.btnSolid}`}>
              Chris&rsquo;s story &rarr;
            </Link>
            <Link href="/library" className={`${s.btn} ${s.btnGhost}`}>
              The Game of Money &rarr;
            </Link>
          </div>
        </div>
      </section>

      <LoudLead
        kicker="The conference"
        title="Be in the room."
        accent="Get on the list."
        lede="Tickets, sponsorship, or just tell us to shout when the next date lands."
      />
      <SiteFooter />
    </>
  );
}
