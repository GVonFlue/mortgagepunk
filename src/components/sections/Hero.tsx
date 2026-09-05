import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";
import HeroParallax from "./HeroParallax";

/**
 * Hero — mortgagepunk.com
 *
 * Three stacked layers, and the z-order is the whole point:
 *   1. hero-plate.jpg        the concrete
 *   2. the display type      REIMAGINING / THE AMERICAN / DREAM.
 *   2.5 contact shadows      fall ACROSS the type, sit UNDER Chris
 *   3. chris-hero-bwred.png  the cutout, on top
 *
 * The type passes BEHIND Chris. His hat interrupts the N of AMERICAN and his
 * shoes land on top of DREAM. If it ever reads as "text next to a photo,"
 * something has broken.
 *
 * Every number in Hero.module.css was tuned visually against Chris's own
 * reference render at 1920x1080, 1512x900 and 390x844. They are not guesses —
 * change them only after looking at all three widths again.
 *
 * Server component. The only client code is the parallax hook, which paints
 * nothing and only writes CSS custom properties.
 */

// Swap to "chris-hero-color.png" if Chris picks the full-colour treatment.
const PORTRAIT = "/brand/chris-hero-bwred.png";

const NAV = [
  { label: "Lending", href: "/lending" },
  { label: "The Game of Money", href: "/library" },
  { label: "The Movement", href: "/movement" },
  { label: "About Chris", href: "/about" },
];

export default function Hero() {
  return (
    <section
      className={styles.hero}
      data-hero
      aria-label="Reimagining the American Dream"
    >
      <HeroParallax />
      {/* L1 — plate */}
      <div className={styles.plate} data-parallax="plate">
        <Image
          src="/brand/hero-plate.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.plateImg}
        />
      </div>

      {/* L2 — display type */}
      <h1 className={styles.type} data-parallax="type">
        <span className={styles.reimagining}>Reimagining</span>
        <span className={styles.strike} aria-hidden="true" />
        <span className={styles.the}>The</span>
        <span className={styles.american}>American</span>
        <span className={styles.dream}>Dream</span>
      </h1>

      {/* L2.5 — shadows: across the type, under Chris */}
      <div className={styles.shadowWall} aria-hidden="true" data-parallax="chris" />
      <div className={styles.shadowGround} aria-hidden="true" data-parallax="chris" />

      {/* L3 — Chris */}
      <div className={styles.chris} data-parallax="chris">
        <Image
          src={PORTRAIT}
          alt="Chris Waipa, founder of Mortgage Punk"
          width={879}
          height={1116}
          priority
          sizes="(max-width: 820px) 70vw, 40vw"
          className={styles.chrisImg}
        />
      </div>

      {/* right rail */}
      <div className={styles.rail}>
        <p>Loan Officer.</p>
        <p className={styles.railHit}>Leading a Movement.</p>
        <p>
          Building a World-Class
          <br />
          Lending Team.
        </p>
      </div>

      {/* CTAs — equal weight, per Chris's "two equally obvious paths" */}
      <div className={styles.ctas}>
        <Link href="/get-approved" className={`${styles.btn} ${styles.btnSolid}`}>
          <span>Get Approved the Right Way</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link href="/movement" className={`${styles.btn} ${styles.btnGhost}`}>
          <span>Follow the Movement</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* nav */}
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

      <div className={styles.grain} aria-hidden="true" />
    </section>
  );
}
