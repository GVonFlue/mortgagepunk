import s from "../Site.module.css";
import LeadForm from "./LeadForm";

/**
 * Lead capture on a full red band.
 *
 * Every other section on the lending pages is dark or bone, so this lands as
 * the loudest thing on the page — which is correct, because it is the only
 * thing on the page we actually want someone to do.
 */
export default function LoudLead({
  kicker = "Start here",
  title = "Let's find the leaks,",
  accent = "then plug them.",
  lede = "Tell us where you are and someone from the team gets back to you. Not a call center, not a drip campaign.",
}: {
  kicker?: string;
  title?: string;
  accent?: string;
  lede?: string;
}) {
  return (
    <section className={s.loud} id="start" aria-label="Get started">
      <div className={s.loudGrid}>
        <div>
          <div className={s.kick} style={{ color: "var(--mp-black)" }}>
            {kicker}
          </div>
          <h2 className={s.h2}>
            {title}
            <br />
            <em>{accent}</em>
          </h2>
          <p className={s.loudLede}>{lede}</p>
        </div>
        <div className={s.loudCard}>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
