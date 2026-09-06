import s from "../Site.module.css";

/**
 * Standard inner-page masthead.
 *
 * `tone` exists because stacking a dark masthead on top of a dark first
 * section gives you a wall of black with nothing for the eye to catch. Pages
 * whose first section is dark should open light, and vice versa.
 */
export default function PageHead({
  kicker,
  title,
  accent,
  lede,
  tone = "dark",
}: {
  kicker: string;
  title: string;
  accent?: string;
  lede?: string;
  tone?: "dark" | "ink" | "bone";
}) {
  return (
    <section className={`${s.sec} ${s[tone]}`}>
      <div className={s.wrap}>
        <div className={s.kick}>{kicker}</div>
        <h1 className={s.h2}>
          {title}
          {accent && (
            <>
              <br />
              <em>{accent}</em>
            </>
          )}
        </h1>
        {lede && <p className={s.lede}>{lede}</p>}
      </div>
    </section>
  );
}
