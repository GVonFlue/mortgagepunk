import Link from "next/link";
import s from "../Site.module.css";
import GfxNote from "../ui/GfxNote";

/**
 * Mission + the American Dream Conference.
 *
 * Conference details are taken from mortgagepunklive.com and Chris's
 * onboarding: 3 keynotes, 15 breakouts, a live concert, and the home-upgrade
 * giveaways. The next event is Oct 16 2027 per onboarding — the live site is
 * still showing the April 2026 event, which has already happened.
 */
const STATS = [
  ["3", "Keynotes"],
  ["15", "Breakouts"],
  ["1", "Live concert"],
];

const PRIZES = [
  "Full kitchen remodel, given away live",
  "A brand new roof",
  "New HVAC system",
  "Interior and exterior paint job",
  "One month of mortgage payments",
];

export default function MovementBlock() {
  return (
    <section className={`${s.sec} ${s.ink}`} aria-label="The movement">
      <div className={s.wrap}>
        <div className={s.mv}>
          <div>
            <div className={s.kick}>The Movement</div>
            <p className={s.quote}>
              The American Dream isn&rsquo;t a checklist.
              <br />
              <em>It&rsquo;s the freedom and opportunity to rewrite your story.</em>
            </p>
            <div className={s.attrib}>Chris Waipa &middot; Founder, Mortgage Punk</div>
            <p className={s.lede}>
              It started by challenging a broken mortgage experience. It grew
              into a lending team, a media platform, a live event, and a
              community built around helping people think bigger than the next
              transaction.
            </p>
            <div style={{ marginTop: 32 }}>
              <Link href="/movement" className={`${s.btn} ${s.btnSolid}`}>
                Read the mission &rarr;
              </Link>
            </div>
          </div>

          <div className={s.evt}>
            <GfxNote where="evt" />
            <span className={s.tag}>Next &middot; October 16, 2027</span>
            <h3>
              The American
              <br />
              Dream Conference
            </h3>
            <div className={s.meta}>
              <strong>Hyatt Regency &middot; Wichita, Kansas</strong>
              <br />
              Keynote: Hannah Hammond
              <br />
              Not a sit-in-a-chair seminar. Real education, real connections,
              and the volume all the way up.
            </div>

            <div className={s.stats}>
              {STATS.map(([n, label]) => (
                <div key={label} className={s.stat}>
                  <b>{n}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className={s.prizes}>
              {PRIZES.map((p) => (
                <div key={p} className={s.prize}>
                  <i aria-hidden="true" />
                  {p}
                </div>
              ))}
            </div>

            <a
              href="https://mortgagepunklive.com"
              className={`${s.btn} ${s.btnGhost}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conference details &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
