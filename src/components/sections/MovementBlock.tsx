import Link from "next/link";
import s from "../Site.module.css";
import GfxNote from "../ui/GfxNote";
import { getConference } from "@/lib/db";

/**
 * Mission + the American Dream Conference.
 *
 * Conference details are taken from mortgagepunklive.com and Chris's
 * onboarding: 3 keynotes, 15 breakouts, a live concert, and the home-upgrade
 * giveaways. The next event is Oct 16 2027 per onboarding — the live site is
 * still showing the April 2026 event, which has already happened.
 */
export default async function MovementBlock() {
  const conf = await getConference();

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
            <span className={s.tag}>Next &middot; {conf.date_label}</span>
            <h3>{conf.headline}</h3>
            <div className={s.meta}>
              <strong>{conf.venue}</strong>
              <br />
              Keynote: {conf.keynote}
              <br />
              {conf.blurb}
            </div>

            <div className={s.stats}>
              {conf.stats.map((st) => (
                <div key={st.label} className={s.stat}>
                  <b>{st.value}</b>
                  <span>{st.label}</span>
                </div>
              ))}
            </div>

            <div className={s.prizes}>
              {conf.prizes.map((p) => (
                <div key={p} className={s.prize}>
                  <i aria-hidden="true" />
                  {p}
                </div>
              ))}
            </div>

            <a
              href={conf.url}
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
