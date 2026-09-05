import Link from "next/link";
import s from "../Site.module.css";

/** Mission + the American Dream Conference. Chris's own words from onboarding. */
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
              It started by challenging a broken mortgage experience. It grew into
              a lending team, a media platform, a live event, and a community
              built around helping people think bigger than the next transaction.
            </p>
            <div style={{ marginTop: 30 }}>
              <Link href="/movement" className={`${s.btn} ${s.solid}`}>
                Read the mission &rarr;
              </Link>
            </div>
          </div>

          <div className={s.evt}>
            <div className={s.tag}>Live &middot; October 16, 2027</div>
            <h3>
              The American
              <br />
              Dream Conference
            </h3>
            <div className={s.meta}>
              Hyatt Regency &middot; Wichita, Kansas
              <br />
              Keynote: Hannah Hammond
              <br />
              A day on the Game of Money, ownership, and building a life beyond a
              paycheck.
            </div>
            <a
              href="https://mortgagepunklive.com"
              className={`${s.btn} ${s.ghost}`}
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
