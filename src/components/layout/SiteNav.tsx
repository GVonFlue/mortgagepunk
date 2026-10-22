"use client";

// Client component: tracks which section is in view and whether the page has
// been scrolled past the hero.

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { APPLY_URL, EXTERNAL } from "@/lib/links";
import MobileNav from "./MobileNav";
import n from "./SiteNav.module.css";

/**
 * One nav, five destinations, one exit.
 *
 * On the homepage every item anchor-scrolls down the same page. Nowhere to get
 * lost, nothing to learn before you can use it — a visitor should never have to
 * understand the site's architecture in order to move through it.
 *
 * Off the homepage the same items point back at `/#section`, so the nav never
 * changes shape and someone on a deep page can still reach anywhere.
 *
 * GET APPROVED is the only item that leaves, straight to the application. If
 * someone clicks a button labelled "get approved", the next screen should begin
 * getting them approved — not explain how.
 */

/**
 * Anchor items scroll the homepage; an `href` item leaves for a real page.
 * Chris has a full About page, so sending the nav to a short teaser section
 * hid the page that actually answers the question.
 */
type NavItem = {
  label: string;
  /** scrolls to this section on the homepage */
  id?: string;
  /** leaves for a real page instead */
  href?: string;
  /** hand-lettered label from the brand artwork */
  art: string;
  artW: number;
  artH: number;
};

/**
 * THE LABELS ARE ARTWORK, NOT TYPE. Each one is hand-lettered with a red
 * offset shadow, and no font reproduces that — it is the same lettering as
 * the section headings, cut from the designer's file.
 *
 * `label` stays on every item and is rendered screen-reader-only, so the nav
 * is still real text for assistive tech and for search. The image carries
 * alt="" because the adjacent text already names the destination; captioning
 * both would make a screen reader read every item twice.
 */
const NAV: NavItem[] = [
  { label: "Ask Mortgage Punk", id: "ask",
    art: "/brand/nav-ask-mortgage-punk.png", artW: 908, artH: 220 },
  { label: "The Game of Money", id: "money",
    art: "/brand/nav-the-game-of-money.png", artW: 801, artH: 225 },
  { label: "The Movement", id: "movement",
    art: "/brand/nav-join-the-movement.png", artW: 833, artH: 204 },
  { label: "Chris", href: "/about",
    art: "/brand/nav-meet-chris.png", artW: 366, artH: 207 },
];

export default function SiteNav() {
  const path = usePathname();
  const onHome = path === "/";
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // which section is in view — drives the underline
  useEffect(() => {
    if (!onHome) return;
    const targets = NAV.filter((i) => i.id)
      .map((i) => document.getElementById(i.id as string))
      .filter(Boolean) as HTMLElement[];
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setActive(best.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [onHome]);

  /**
   * Hide on the way down, return on the way up.
   *
   * Scrolling down means "show me more of the page", so the bar gets out of
   * the way. Scrolling up is the gesture people already make when they want
   * navigation, so it comes straight back rather than waiting for the top.
   *
   * The 6px threshold ignores the sub-pixel jitter of a trackpad, which would
   * otherwise flicker the bar constantly. It never hides within the first
   * 120px, so the nav is always there when the page loads.
   */
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    /* THE FLOOR IS LOWER ON A PHONE. 120px is a small fraction of a desktop
       window and reads as "once you have started moving"; on a 844px phone it
       is a seventh of the screen, so the bar hung around well past the point
       it was in the way. 36px is about one flick. */
    const floor = () => (window.innerWidth <= 760 ? 36 : 120);

    const onScroll = () => {
      if (frame) return;                 // one update per painted frame
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;

        setScrolled(y > 24);
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > floor());
          last = y;
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      className={`${n.nav} ${scrolled ? n.navSolid : ""} ${
        hidden ? n.navHidden : ""
      }`}
    >
      {/* logoHome hides this on the home page at every width, where the
          hero's splat is the mark instead — see SiteNav.module.css. It still
          renders on every other page, where it is the way back home. */}
      <Link
        href="/"
        className={`${n.logo} ${onHome ? n.logoHome : ""}`}
        aria-label="Mortgage Punk, home"
      >
        <Image
          src="/brand/mortgagepunk-logo@3x.png"
          alt="Mortgage Punk"
          width={1209}
          height={825}
          priority
        />
      </Link>

      <ul className={n.links}>
        {NAV.map((i) => (
          <li key={i.label}>
            <Link
              href={i.href ?? (onHome ? `#${i.id}` : `/#${i.id}`)}
              className={i.id && active === i.id ? n.on : undefined}
            >
              <Image
                src={i.art}
                alt=""
                width={i.artW}
                height={i.artH}
                className={n.navArt}
                priority
              />
              <span className={n.srOnly}>{i.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <a href={APPLY_URL} {...EXTERNAL} className={n.cta}>
        <Image
          src="/brand/nav-get-approved.png"
          alt=""
          width={528}
          height={141}
          className={n.ctaArt}
          priority
        />
        <span className={n.srOnly}>Get Approved</span>
      </a>

      <MobileNav />
    </nav>
  );
}
