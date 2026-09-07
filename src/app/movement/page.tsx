import Image from "next/image";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import GfxNote from "@/components/ui/GfxNote";
import c from "@/components/sections/Conference.module.css";
import { getConference } from "@/lib/db";

export const metadata = {
  title: "The American Dream Conference — Mortgage Punk",
  description:
    "A live day on the Game of Money, ownership, and building a life beyond a paycheck. Keynotes, breakouts, live music, and real giveaways.",
};

export const revalidate = 300;

/**
 * /movement — the American Dream Conference.
 *
 * Rebuilt LIGHT and rebuilt around its own logo.
 *
 * Two decisions drive the whole page. First, this is a sibling brand, not
 * Mortgage Punk: it sells tickets to people who may never take a mortgage from
 * Chris, so it has to be approachable and easy to scan rather than another
 * wall of black. The logo already carries the punk energy — the page does not
 * need to shout on top of it.
 *
 * Second, the order answers questions in the order somebody actually asks
 * them: what is this, is it for me, what happens, what could I win, where and
 * when, how do I get in.
 *
 * Date, venue, keynote, stats and prizes all come from Backstage → Conference.
 */

const WHO = [
  {
    h: "First-time buyers",
    p: "You have never done this and everyone talks to you in acronyms. Start here and leave knowing how it actually works.",
  },
  {
    h: "Homeowners",
    p: "You already own. The question now is what that asset is supposed to be doing for you, and whether it is doing it.",
  },
  {
    h: "Investors",
    p: "Second door or twentieth. Financing, taxes, and the maths behind buying the next one.",
  },
  {
    h: "Anyone tired of guessing",
    p: "Nobody taught most of us the rules around money. A day of straight answers, no upsell at the end.",
  },
];

/**
 * Two days, not one. The event runs the 16th and 17th.
 *
 * Split into named days rather than one long list, because a visitor deciding
 * whether to take two days off work needs to see what each day is FOR before
 * they see the running order. Still a draft until Ashley confirms.
 */
const SCHEDULE = [
  {
    day: "Day one",
    date: "Friday",
    theme: "The Game of Money",
    rows: [
      {
        when: "Morning",
        what: "Doors and the opening keynote",
        p: "It starts loud. No twenty minutes of housekeeping — the first session is the reason you came.",
      },
      {
        when: "Late morning",
        what: "Breakout sessions",
        p: "Smaller rooms, specific problems. Buying your first place, financing a rental, dealing with debt, keeping more of what you earn.",
      },
      {
        when: "Midday",
        what: "Lunch and the floor",
        p: "The part most people say they got the most from. A room full of people solving the same problems you are.",
      },
      {
        when: "Afternoon",
        what: "Keynote two",
        p: "What the American Dream actually looks like now, and what it takes to build one.",
      },
      {
        when: "Evening",
        what: "Live music",
        p: "Day one closes with a concert, because of course it does.",
      },
    ],
  },
  {
    day: "Day two",
    date: "Saturday",
    theme: "Putting it to work",
    rows: [
      {
        when: "Morning",
        what: "Keynote three",
        p: "The big-picture session. Ownership, leverage, and building a life that does not depend on the next paycheck.",
      },
      {
        when: "Late morning",
        what: "Workshops",
        p: "Hands on rather than sit and listen. Bring your actual numbers and work them with someone who does this for a living.",
      },
      {
        when: "Midday",
        what: "Lunch and the floor",
        p: "Second day, warmer room. This is where most of the connections actually get made.",
      },
      {
        when: "Late afternoon",
        what: "The giveaways",
        p: "Given away live, on stage, to people in the room. Not a raffle you hear about in an email a week later.",
      },
      {
        when: "Close",
        what: "Where you go from here",
        p: "You leave with a plan you wrote, not a folder of notes you never open again.",
      },
    ],
  },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default async function Movement() {
  const conf = await getConference();

  return (
    <div className={c.page}>
      <AnnouncementBar />
      <SiteNav />

      {/* ---------- hero ---------- */}
      <section className={c.hero}>
        <div className={c.heroWrap}>
          <Image
            src="/brand/adc-logo.png"
            alt="American Dream! Conference"
            width={1400}
            height={718}
            className={c.logo}
            priority
          />

          <div className={c.when}>
            <span className={c.whenItem}>
              <Icon d="M3 5.5h18v15H3zM3 10h18M8 3v4M16 3v4" />
              {conf.date_label}
            </span>
            <span className={c.whenItem}>
              <Icon d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
              {conf.venue}
            </span>
          </div>

          <p className={c.tagline}>
            Two days. <em>Everything they never taught you</em> about money.
          </p>

          <div className={c.heroBtns}>
            <a
              href={conf.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${c.btn} ${c.btnRed}`}
            >
              Get tickets &rarr;
            </a>
            <Link href="#day" className={`${c.btn} ${c.btnLine}`}>
              See the day &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- what it is ---------- */}
      <section className={`${c.sec} ${c.secWhite}`}>
        <div className={c.wrap}>
          <span className={c.kick}>What it is</span>
          <h2 className={c.h2}>
            Not a sit-in-a-chair
            <em>seminar.</em>
          </h2>
          <p className={c.lede}>{conf.blurb}</p>

          <div className={c.stats}>
            {conf.stats.map((s) => (
              <div key={s.label} className={c.stat}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- who it's for ---------- */}
      <section className={`${c.sec} ${c.secPaper}`}>
        <div className={c.wrap}>
          <span className={c.kick}>Who it&rsquo;s for</span>
          <h2 className={c.h2}>
            You don&rsquo;t need to know
            <em>anything yet.</em>
          </h2>
          <p className={c.lede}>
            There is no prerequisite and no assumed knowledge. Come with the
            questions you have been too embarrassed to ask.
          </p>

          <div className={c.who}>
            {WHO.map((w) => (
              <div key={w.h} className={c.whoCard}>
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- the day ---------- */}
      <section className={`${c.sec} ${c.secWhite}`} id="day">
        <div className={c.wrap} style={{ position: "relative" }}>
          <GfxNote where="evt" />
          <span className={c.kick}>The day</span>
          <h2 className={c.h2}>
            How it
            <em>actually runs.</em>
          </h2>

          {SCHEDULE.map((d) => (
            <div key={d.day} className={c.dayBlock}>
              <div className={c.dayHead}>
                <span className={c.dayNo}>{d.day}</span>
                <span className={c.dayDate}>{d.date}</span>
                <span className={c.dayTheme}>{d.theme}</span>
              </div>
              <div className={c.day}>
                {d.rows.map((r) => (
                  <div key={r.when} className={c.dayRow}>
                    <span className={c.dayWhen}>{r.when}</span>
                    <div className={c.dayWhat}>
                      <h3>{r.what}</h3>
                      <p>{r.p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className={c.todo}>
            TODO: this two-day running order is a reasonable draft, not
            confirmed. Ashley needs to supply the real schedule for both days,
            the other two keynote speakers, and the breakout and workshop
            titles.
          </div>
        </div>
      </section>

      {/* ---------- giveaways, the one dark band ---------- */}
      <section className={`${c.sec} ${c.secInk}`}>
        <div className={c.wrap}>
          <span className={c.kick}>Given away live</span>
          <h2 className={c.h2} style={{ color: "var(--mp-bone)" }}>
            Somebody in that room
            <em>goes home with this.</em>
          </h2>
          <p className={c.lede}>
            On stage, on the day, to people in the seats. Not a raffle you hear
            about in an email a week later.
          </p>

          <div className={c.prizes}>
            {conf.prizes.map((p, i) => (
              <div key={p} className={c.prize}>
                <span className={c.prizeNo}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{p}</h3>
              </div>
            ))}
          </div>

          <div className={c.todo}>
            TODO: sponsor logos and prize artwork needed. The current live site
            has images for each of these — pull them across before the domain
            redirect goes in, because they disappear when it does.
          </div>
        </div>
      </section>

      {/* ---------- venue ---------- */}
      <section className={`${c.sec} ${c.secPaper}`}>
        <div className={c.wrap}>
          <div className={c.venue}>
            <div>
              <span className={c.kick}>Where and when</span>
              <h2 className={c.h2}>
                Wichita.
                <em>Two days.</em>
              </h2>
              <p className={c.lede}>
                Both days happen in one building, so there is no running between
                venues and nothing missed because you were in the wrong room.
              </p>
            </div>

            <dl className={c.venueFacts}>
              <div className={c.venueFact}>
                <dt>Date</dt>
                <dd>{conf.date_label}</dd>
              </div>
              <div className={c.venueFact}>
                <dt>Venue</dt>
                <dd>{conf.venue}</dd>
              </div>
              <div className={c.venueFact}>
                <dt>Keynote</dt>
                <dd>{conf.keynote}</dd>
              </div>
              <div className={c.venueFact}>
                <dt>Host</dt>
                <dd>Chris Waipa</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- tickets ---------- */}
      <section className={c.tickets}>
        <Image
          src="/brand/adc-logo.png"
          alt=""
          width={1400}
          height={718}
          className={c.ticketsLogo}
        />
        <h2>Be in the room.</h2>
        <p>
          Tickets, sponsorship, or tell us to shout when the next date lands.
          Either way you hear from a person.
        </p>
        <div className={c.heroBtns}>
          <a
            href={conf.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${c.btn} ${c.btnInk}`}
          >
            Get tickets &rarr;
          </a>
          <Link href="/contact" className={`${c.btn} ${c.btnLine}`}>
            Sponsor the event &rarr;
          </Link>
        </div>
      </section>

      {/* ---------- the mission, underneath ---------- */}
      <section className={`${c.sec} ${c.secWhite}`}>
        <div className={c.wrap}>
          <span className={c.kick}>Why it exists</span>
          <h2 className={c.h2}>
            The American Dream
            <em>isn&rsquo;t a checklist.</em>
          </h2>
          <p className={c.lede}>
            It is the freedom and the opportunity to rewrite your story. That
            sentence is why the conference exists, and it is the same reason
            Mortgage Punk does. It started by challenging a broken mortgage
            experience and grew into a lending team, a media platform, an
            education community, a live event, and a movement built around
            helping people think bigger than the next transaction.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/about" className={`${c.btn} ${c.btnInk}`}>
              Chris&rsquo;s story &rarr;
            </Link>
            <Link href="/library" className={`${c.btn} ${c.btnLine}`}>
              The Game of Money &rarr;
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
