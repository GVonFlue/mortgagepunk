import Image from "next/image";
import Link from "next/link";
import s from "../Site.module.css";
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
    <div className={s.mv}>
      <div className={s.evt}>
        <div className={s.evtShot} aria-hidden="true">
          <Image
            src="/brand/adc-stageset.jpg"
            alt=""
            width={1800}
            height={1200}
            sizes="(max-width: 900px) 92vw, 44vw"
          />
        </div>
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
      </div>
    </div>
  );
}
