import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

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
  { label: "The Game of Money", href: "/library" },
  { label: "The Movement", href: "/movement" },
  { label: "About Chris", href: "/about" },
];

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Reimagining the American Dream">
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
        {/* outer span masks for the reveal, inner span is what animates */}
        <h1 className={styles.type}>
          <span className={styles.reimagining}>
            <span>Reimagining</span>
          </span>
          <span className={styles.strike} aria-hidden="true" />
          <span className={styles.the}>
            <span>The</span>
          </span>
          <span className={styles.american}>
            <span>American</span>
          </span>
          <span className={styles.dream}>
            <span data-text="Dream">Dream</span>
          </span>
        </h1>

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
          Loan Officer.
          <br />
          <span className={styles.railHit}>Leading a Movement.</span>
          <br />
          Building a World-Class
          <br />
          Lending Team.
        </div>


        {/* equal weight — Chris asked for two equally obvious paths */}
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

      <div className={styles.grain} aria-hidden="true" />
    </section>
  );
}
