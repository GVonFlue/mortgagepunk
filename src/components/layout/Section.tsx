import Link from "next/link";
import Image from "next/image";
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
 *
 * TITLE ARTWORK. A section can swap its typeset heading for a drawn wordmark
 * with `titleArt`. `title` stays required alongside it and is rendered
 * screen-reader-only, so the heading is still a real h2 with real words in it
 * for search engines and assistive tech — the artwork is decorative and
 * carries alt="". No font will ever match the hand-drawn logo, which is why
 * these are images rather than a webfont.
 */

export type Tone = "dark" | "ink" | "bone" | "red";

/**
 * How the section sits on the fixed ground.
 *   float  glass panel, the ground reads through
 *   solid  near-opaque, for dense copy or a form
 *   open   no panel, content sits straight on the ground
 */
export type Sit = "float" | "solid" | "open";

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
  sit,
  center = false,
  full = false,
  titleArt,
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
  /** Omit for a classic full-bleed section; set to float over the ground. */
  sit?: Sit;
  /** Centre the head and content. For sections that are a statement rather
   *  than a block of information to be read left to right. */
  center?: boolean;
  /** Content runs the full width of the screen rather than the 1184px column. */
  full?: boolean;
  /**
   * Drawn wordmark in place of the typeset heading. `width`/`height` are the
   * asset's own pixels and only set the aspect ratio, so the space is reserved
   * before it loads. `cap` is how wide it is allowed to get on a big screen —
   * set per mark so three wordmarks of different proportions land at roughly
   * the same visual height rather than the same width.
   */
  titleArt?: { src: string; width: number; height: number; cap: number };
}) {
  const hasHead = Boolean(kicker || title || lede);

  const floating = Boolean(sit);
  const panel = floating
    ? `${s.panel} ${s[sit as Sit]} ${tone === "red" ? s.redPanel : ""}`
    : "";

  return (
    <section
      id={id}
      className={`${s.sec} ${floating ? s.onGround : s[tone]} ${
        full ? s.secFull : ""
      }`}
    >
      <div
        className={`${s.wrap} ${panel} ${center ? s.center : ""}`}
      >
        {hasHead && (
          <header className={s.head}>
            {kicker && <span className={s.kicker}>{kicker}</span>}
            {title &&
              (titleArt ? (
                <h2 className={s.title}>
                  <span className={s.srOnly}>
                    {title}
                    {accent ? ` ${accent}` : ""}
                  </span>
                  <span className={s.titleArt} style={{ maxWidth: titleArt.cap }}>
                    {titleArt.src.endsWith(".svg") ? (
                      // An SVG gains nothing from the image optimiser and
                      // serving one through it needs SVG explicitly allowed in
                      // next.config, which is a security setting this does not
                      // need to touch. Straight tag.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={titleArt.src}
                        alt=""
                        width={titleArt.width}
                        height={titleArt.height}
                      />
                    ) : (
                      <Image
                        src={titleArt.src}
                        alt=""
                        width={titleArt.width}
                        height={titleArt.height}
                        sizes={`(max-width: 760px) 92vw, ${titleArt.cap}px`}
                      />
                    )}
                  </span>
                </h2>
              ) : (
                <h2 className={s.title}>
                  {title}
                  {accent && (
                    <>
                      <br />
                      <em>{accent}</em>
                    </>
                  )}
                </h2>
              ))}
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
