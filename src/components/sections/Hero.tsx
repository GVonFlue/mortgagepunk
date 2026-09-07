import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";
import LogoPunch from "./LogoPunch";
import { getHero } from "@/lib/db";
import { HERO_FIT } from "@/lib/content";

/**
 * Hero — mortgagepunk.com
 *
 * Matched to the client's approved reference render:
 *   REIMAGINING            medium black, letterspaced
 *   [red brush strike]
 *   AMERICAN               massive black, runs behind Chris
 *   THE  DREAM.            THE small at left, DREAM. massive and red
 *
 * Light concrete plate, black screen-print type, no outline. The type passes
 * BEHIND Chris — his cap interrupts the N of AMERICAN.
 *
 * Geometry is authored at 1512x900 and scaled as one unit. Read the note at
 * the top of Hero.module.css before touching any number.
 */

// One-line switch if Chris picks the full-colour treatment.
const PORTRAIT = "/brand/chris-hero-bwred.png";

const NAV = [
  { label: "Lending", href: "/lending" },
  { label: "Tools", href: "/tools" },
  { label: "The Game of Money", href: "/library" },
  { label: "The Movement", href: "/movement" },
  { label: "About Chris", href: "/about" },
];

/**
 * Auto-fit.
 *
 * The stage is fixed at 1512x900 with white-space:nowrap, so a longer word
 * does not wrap — it runs off the edge. Rather than trap Chris inside a
 * character limit, each line scales down once it passes the reference length.
 * "AMERICAN" is 8 characters and fills the width by design; a 12-character
 * word renders at two thirds the size and still lands inside the composition.
 *
 * This is why the copy can be editable at all. Without it, one long word from
 * a designer breaks the hero on every screen.
 */
function fit(text: string, base: number, reference: number): number {
  const len = text.trim().length || 1;
  if (len <= reference) return base;
  return Math.round(base * (reference / len) * 10) / 10;
}

export default async function Hero() {
  const h = await getHero();

  const art = h.art_url ? { url: h.art_url, w: h.art_w, h: h.art_h } : null;

  // one unit variable per line, consumed by the CSS as calc(N * var(--u))
  const sizes = {
    "--fit-eyebrow": fit(h.eyebrow, 58, HERO_FIT.eyebrow),
    "--fit-small": fit(h.line_small, 106, HERO_FIT.line_small),
    "--fit-big": fit(h.line_big, 246, HERO_FIT.line_big),
    "--fit-accent": fit(h.line_accent, 246, HERO_FIT.line_accent),
    // artwork sizing, in stage units so it scales with everything else
    "--art-w": h.art_width_units ?? 1030,
    "--art-top": h.art_top_units ?? 96,
    // hold the aspect ratio so the art never stretches
    "--art-ratio":
      art?.w && art?.h ? `${art.w} / ${art.h}` : "auto",
    "--art-ratio-m":
      h.art_mobile_w && h.art_mobile_h
        ? `${h.art_mobile_w} / ${h.art_mobile_h}`
        : "auto",
  } as React.CSSProperties;

  return (
    <section
      id="mp-hero"
      className={styles.hero}
      aria-label={`${h.eyebrow} ${h.line_small} ${h.line_big} ${h.line_accent}`}
      style={sizes}
    >
      <div className={styles.plate}>
        <Image
          src="/brand/hero-plate.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.plateImg}
        />
      </div>

      <div className={styles.stage}>
        {/* THE HEADLINE.
            When Chris has uploaded artwork it renders instead of the type
            lines — same slot in the stage, same z-index, so it still sits
            BEHIND Chris. The layering is code; only the artwork swaps.

            The <h1> stays in the DOM either way, visually hidden when art is
            showing. An image headline with no text would leave the page with
            no H1 for search engines and nothing for a screen reader to read. */}
        {art ? (
          <>
            <h1 className={styles.srOnly}>
              {`${h.eyebrow} ${h.line_small} ${h.line_big} ${h.line_accent}`}
            </h1>
            <div className={styles.artWrap} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.artDesktop} src={art.url} alt="" />
              {h.art_mobile_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.artMobile} src={h.art_mobile_url} alt="" />
              )}
            </div>
          </>
        ) : (
          <h1 className={styles.type}>
            <span className={styles.reimagining}>
              <span>{h.eyebrow}</span>
            </span>
            <span className={styles.strike} aria-hidden="true" />
            <span className={styles.the}>
              <span>{h.line_small}</span>
            </span>
            <span className={styles.american}>
              <span>{h.line_big}</span>
            </span>
            <span className={styles.dream}>
              {/* data-text drives the gradient overlay — it must match the
                  visible text or the fill and the outline drift apart */}
              <span data-text={h.line_accent}>{h.line_accent}</span>
            </span>
          </h1>
        )}

        <div className={styles.shadowWall} aria-hidden="true" />
        <div className={styles.shadowGround} aria-hidden="true" />

        <div className={styles.chris}>
          <Image
            src={PORTRAIT}
            alt="Chris Waipa, founder of Mortgage Punk"
            width={879}
            height={1116}
            priority
            sizes="(max-width: 820px) 85vw, 34vw"
            className={styles.chrisImg}
          />
        </div>

        <div className={styles.rail}>
          {h.rail_top}
          <br />
          <span className={styles.railHit}>{h.rail_hit}</span>
          <br />
          {h.rail_bottom}
        </div>


        {/* equal weight — Chris asked for two equally obvious paths */}
        <div className={styles.ctas}>
          <Link href="/get-approved" className={`${styles.btn} ${styles.btnSolid}`}>
<span>Get Approved the Right Way</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link href={h.cta2_href} className={`${styles.btn} ${styles.btnGhost}`}>
            <span>{h.cta2_label}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Primary">
        <Link href="/" className={styles.logo}>
          <Image
            src="/brand/mortgagepunk-logo@3x.png"
            alt="Mortgage Punk"
            width={1209}
            height={825}
            priority
          />
        </Link>
        <ul className={styles.links}>
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href}>{n.label}</Link>
            </li>
          ))}
        </ul>
        <Link href="/get-approved" className={styles.navCta}>
Get Approved <span aria-hidden="true">&rarr;</span>
        </Link>
      </nav>

      {/* fires on impact, gone in a blink */}
      <div className={styles.punchFlash} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      {/* arms the entrance; renders nothing */}
      <LogoPunch targetId="mp-hero" className={styles.punching} />
    </section>
  );
}
