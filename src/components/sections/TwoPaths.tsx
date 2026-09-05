import Link from "next/link";
import s from "../Site.module.css";
import GfxNote from "../ui/GfxNote";

/**
 * Two equally weighted paths. Chris was explicit in onboarding that the
 * flagship needs two equally obvious routes — lending and the movement — so
 * neither of these is allowed to become a subordinate secondary link.
 */
export default function TwoPaths() {
  return (
    <section className={s.paths} aria-label="Choose your path">
      <Link href="/get-approved" className={`${s.path} ${s.red}`}>
        <span className={s.ghost} aria-hidden="true">01</span>
        <GfxNote />
        <div>
          <div className={s.num}>Path 01</div>
          <h3>Get approved<br />the right way</h3>
          <p>
            A real lending team behind a real process. No runaround, no fine
            print, and a straight answer on where you actually stand.
          </p>
        </div>
        <span className={s.go}>Start your approval <span aria-hidden="true">&rarr;</span></span>
      </Link>

      <Link href="/movement" className={`${s.path} ${s.dk}`}>
        <span className={s.ghost} aria-hidden="true">02</span>
        <GfxNote />
        <div>
          <div className={s.num}>Path 02</div>
          <h3>Follow the<br />movement</h3>
          <p>
            The Game of Money, explained by someone with no reason to keep it
            complicated. Free, always, and built to be shared.
          </p>
        </div>
        <span className={s.go}>Join the movement <span aria-hidden="true">&rarr;</span></span>
      </Link>
    </section>
  );
}
