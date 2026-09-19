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
};

const NAV: NavItem[] = [
  { label: "Ask Mortgage Punk", id: "ask" },
  { label: "The Game of Money", id: "money" },
  { label: "The Movement", id: "movement" },
  { label: "Chris", href: "/about" },
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

    const onScroll = () => {
      if (frame) return;                 // one update per painted frame
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;

        setScrolled(y > 24);
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 120);
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
      <Link href="/" className={n.logo} aria-label="Mortgage Punk, home">
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
              {i.label}
            </Link>
          </li>
        ))}
      </ul>

      <a href={APPLY_URL} {...EXTERNAL} className={n.cta}>
        Get Approved <span aria-hidden="true">&rarr;</span>
      </a>

      <MobileNav />
    </nav>
  );
}
