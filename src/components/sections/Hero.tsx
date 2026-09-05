import Image from "next/image";
import Link from "next/link";

import ArrowRight from "@/components/ui/ArrowRight";
import HeroParallax from "./HeroParallax";
import HandStrike from "@/components/ui/HandStrike";
import { HERO_PLATE, HERO_PORTRAIT, HERO_PORTRAIT_SIZE } from "@/lib/brand";

import styles from "./Hero.module.css";

/* The composition is three stacked layers and the z-order is the design:
 *
 *   1. hero-plate.jpg   full-bleed background
 *   2. the display type REIMAGINING / THE AMERICAN / DREAM.
 *   3. chris-hero cutout, ON TOP of the type
 *
 * Layer 3 sitting above layer 2 is the whole point — his shoulder interrupts
 * THE AMERICAN and his shins land on DREAM. If this ever reads as "text next
 * to a photo", it is wrong. See the header comment in Hero.module.css.
 *
 * This is a server component. The only client code in the hero is
 * HeroParallax, which paints nothing.
 */

const HERO_ID = "mp-hero";

export default function Hero() {
  return (
    <section id={HERO_ID} className={styles.hero} aria-labelledby="mp-hero-headline">
      {/* Layer 1 --------------------------------------------------------- */}
      <div className={styles.plateLayer}>
        <div className={styles.plateEnter}>
          <Image
            src={HERO_PLATE}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.plateImg}
          />
        </div>
        <div className={styles.plateWash} />
      </div>

      {/* Layer 2 --------------------------------------------------------- */}
      <div className={styles.typeLayer}>
        <h1 id="mp-hero-headline" className={`mp-display ${styles.headline}`}>
          <span className={styles.eyebrowBlock}>
            <span className={styles.mask}>
              <span className={`${styles.maskInner} ${styles.eyebrowText}`}>
                Reimagining
              </span>
            </span>
            <HandStrike className={styles.strike} />
          </span>

          <span className={styles.mask}>
            <span className={`${styles.maskInner} ${styles.line} ${styles.lineOne}`}>
              The American
            </span>
          </span>

          <span className={styles.mask}>
            <span className={`${styles.maskInner} ${styles.line} ${styles.lineTwo}`}>
              Dream.
            </span>
          </span>
        </h1>
      </div>

      {/* Layer 3 — above the type, deliberately --------------------------- */}
      <div className={styles.chrisLayer}>
        <div className={styles.chrisEnter}>
          <Image
            src={HERO_PORTRAIT}
            alt="Chris Waipa sitting cross-legged, hands clasped, in a red Mortgage Punk cap, red glasses and red high-tops."
            width={HERO_PORTRAIT_SIZE.width}
            height={HERO_PORTRAIT_SIZE.height}
            priority
            sizes="(max-width: 640px) 96vw, (max-width: 1024px) 62vw, 46vw"
            className={styles.chrisImg}
          />
        </div>
      </div>

      {/* Copy ------------------------------------------------------------- */}
      <p className={styles.meta}>
        <span className={styles.metaLine}>Loan Officer.</span>
        <span className={`${styles.metaLine} ${styles.metaAccent}`}>
          Leading a movement.
          <HandStrike className={styles.metaStrike} />
        </span>
        <span className={styles.metaLine}>Building a world-class</span>
        <span className={styles.metaLine}>lending team.</span>
      </p>

      {/* Two equally obvious paths. Neither is a subordinate ghost button. */}
      <div className={styles.ctas}>
        <Link href="/get-approved" className={`${styles.cta} ${styles.ctaSolid}`}>
          Get approved for a mortgage the right way
          <ArrowRight className={styles.ctaArrow} />
        </Link>
        <Link href="/movement" className={`${styles.cta} ${styles.ctaOutline}`}>
          Follow the movement
          <ArrowRight className={styles.ctaArrow} />
        </Link>
      </div>

      <div className={styles.grain} aria-hidden="true" />

      {/* Renders nothing; writes the parallax offsets onto this section. */}
      <HeroParallax targetId={HERO_ID} />
    </section>
  );
}
