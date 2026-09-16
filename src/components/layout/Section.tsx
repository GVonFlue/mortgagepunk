import Link from "next/link";
import s from "./Section.module.css";

/**
 * THE SECTION SYSTEM.
 *
 * Every homepage section is built from this, which is the whole reason the
 * page reads as one continuous experience rather than a stack of separately
 * designed blocks.
 *
 * Three rules, and they exist for reasons rather than taste:
 *
 * 1. ONE FOCAL POINT. A kicker, one headline, at most one supporting line,
 *    the content, and at most one call to action. Every extra competing
 *    element costs the visitor a decision, and decisions are what make a site
 *    feel like work. This is why `cta` is a single object and not an array —
 *    the component makes a second button impossible rather than discouraged.
 *
 * 2. A HARD LINE BETWEEN SECTIONS. Not a gradient, not an overlapping rounded
 *    panel. A 1px rule reads as "that thought ended, a new one starts" with no
 *    ambiguity, and it is what gives a long scroll its rhythm.
 *
 * 3. THE SAME VERTICAL RHYTHM EVERYWHERE. Identical padding and identical
 *    spacing between kicker, headline and content, so the eye learns the
 *    pattern in the first section and coasts through the remaining seven.
 *
 * Anchor targets live here too: `id` plus a scroll-margin so a section never
 * lands underneath the sticky nav.
 */

export type Tone = "dark" | "ink" | "bone" | "red";

export default function Section({
  id,
  tone = "dark",
  kicker,
  title,
  accent,
  lede,
  cta,
  children,
  bleed = false,
}: {
  id?: string;
  tone?: Tone;
  kicker?: string;
  title?: string;
  /** The second line, set larger and in red. The section's one loud moment. */
  accent?: string;
  /** One supporting line. Deliberately not a paragraph. */
  lede?: string;
  /** At most one. A section with two asks has no ask. */
  cta?: { label: string; href: string; external?: boolean };
  children?: React.ReactNode;
  /** Content runs full width instead of inside the text column. */
  bleed?: boolean;
}) {
  const hasHead = Boolean(kicker || title || lede);

  return (
    <section id={id} className={`${s.sec} ${s[tone]}`}>
      <div className={s.wrap}>
        {hasHead && (
          <header className={s.head}>
            {kicker && <span className={s.kicker}>{kicker}</span>}
            {title && (
              <h2 className={s.title}>
                {title}
                {accent && (
                  <>
                    <br />
                    <em>{accent}</em>
                  </>
                )}
              </h2>
            )}
            {lede && <p className={s.lede}>{lede}</p>}
          </header>
        )}

        {children && <div className={bleed ? s.bleed : s.body}>{children}</div>}

        {cta &&
          (cta.external ? (
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={s.cta}
            >
              {cta.label} <span aria-hidden="true">&rarr;</span>
            </a>
          ) : (
            <Link href={cta.href} className={s.cta}>
              {cta.label} <span aria-hidden="true">&rarr;</span>
            </Link>
          ))}
      </div>
    </section>
  );
}
