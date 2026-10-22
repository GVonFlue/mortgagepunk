import Image from "next/image";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import WaitlistButton from "@/components/sections/WaitlistButton";
import { TICKET_PRICE } from "@/lib/event";
import c from "@/components/sections/Conference.module.css";
import { getConference, getImages } from "@/lib/db";
import { pickImage } from "@/lib/images";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "The American Dream Conference",
  description:
    "A live day on the Game of Money, ownership, and building a life beyond a paycheck. Keynotes, breakouts, live music, and real giveaways.",
  path: "/movement",
});

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
 * them: what is this, is it for me, how do I get in.
 *
 * CUT BACK TO A WAITLIST PAGE. This used to run on through a two-day
 * schedule, the giveaway list, the venue details and a closing mission
 * statement. None of that is settled — the schedule was still a draft pending
 * Ashley — and a page selling a date that might move does more harm than a
 * page that says what the event is and takes a name. So it now stops after
 * "Who it's for" and closes on the waitlist.
 *
 * Everything cut is in git, not rewritten: restoring a section is a revert of
 * this commit, not a rebuild. The CSS for all of it is untouched in
 * Conference.module.css for the same reason.
 *
 * Date, venue and stats still come from Backstage → Conference. The prizes
 * and keynote fields there are no longer rendered anywhere on this page;
 * leave them filled in, because they come straight back with the sections.
 *
 * SECTION TITLES. Each content section carries one centred title and nothing
 * else — no second headline underneath. The old pattern was a small label,
 * then a two-line headline, then sometimes a paragraph, which put three
 * layers of heading in front of every section. The label was the part people
 * actually navigate by, so it became the title (.secTitle) and the rest went.
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


function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default async function Movement() {
  const [conf, images] = await Promise.all([getConference(), getImages()]);

  // The "Last year" row is swappable from Backstage → Photos. Captions stay
  // in code: they describe a specific photograph, so letting them drift from
  // the picture would be worse than not editing them at all.
  const shots = [
    { ...pickImage(images, "movement-shot-1"), cap: "Keynote, room full" },
    { ...pickImage(images, "movement-shot-2"), cap: "Panel sessions" },
    { ...pickImage(images, "movement-shot-3"), cap: "Everybody filming it" },
  ];

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
            {/* Tickets are not on sale, so the button collects the lead
                instead of sending people to a page that cannot sell them
                anything. See WaitlistButton. */}
            {/* One action, not two. The second button here anchored to the
                schedule section, which came off the page — and with the page
                this short there is nothing left worth jumping to. */}
            <WaitlistButton className={`${c.btn} ${c.btnRed}`} />
          </div>
        </div>
      </section>

      {/* ---------- what it is ---------- */}
      <section className={`${c.sec} ${c.secWhite}`}>
        <div className={c.wrap}>
          <h2 className={c.secTitle}>What it is</h2>
          {/* The line under the title is Backstage → Conference → "One line
              on what it is". Kept editable rather than typed in here, because
              the homepage Movement block reads the same field. */}
          <p className={`${c.lede} ${c.ledeCenter}`}>{conf.blurb}</p>

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

      {/* ---------- what it actually looked like ---------- */}
      <section className={`${c.sec} ${c.secInk} ${c.wash} ${c.washStage}`}>
        <div className={c.wrap}>
          <h2 className={c.secTitle}>Last year</h2>
          <div className={c.shots}>
            {shots.map((shot) => (
              /* Keyed on the caption, not the src: two slots could legitimately
                 hold the same photo, and duplicate keys drop list items. */
              <figure key={shot.cap} className={c.shot}>
                <Image src={shot.src} alt="" width={shot.width} height={shot.height}
                  sizes="(max-width: 700px) 92vw, 32vw" />
                <figcaption className={c.shotCap}>{shot.cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- who it's for ---------- */}
      <section className={`${c.sec} ${c.secPaper}`}>
        <div className={c.wrap}>
          <h2 className={c.secTitle}>Who it&rsquo;s for</h2>

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
          Tickets open soon at {TICKET_PRICE}. Get on the waitlist for first
          access, or sponsor the event and get in front of the whole room.
        </p>
        <div className={c.heroBtns}>
          <WaitlistButton className={`${c.btn} ${c.btnInk}`} />
          <Link href="/book?type=sponsorship" className={`${c.btn} ${c.btnLine}`}>
            Sponsor the event &rarr;
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
