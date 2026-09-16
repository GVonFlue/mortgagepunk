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

const NAV = [
  { label: "Lending", id: "lending" },
  { label: "Tools", id: "tools" },
  { label: "The Game of Money", id: "money" },
  { label: "The Movement", id: "movement" },
  { label: "Chris", id: "chris" },
] as const;

export default function SiteNav() {
  const path = usePathname();
  const onHome = path === "/";
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  // which section is in view — drives the underline
  useEffect(() => {
    if (!onHome) return;
    const targets = NAV.map((i) => document.getElementById(i.id)).filter(
      Boolean
    ) as HTMLElement[];
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

  // the bar only earns a background once it is over content
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${n.nav} ${scrolled ? n.navSolid : ""}`}>
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
          <li key={i.id}>
            <Link
              href={onHome ? `#${i.id}` : `/#${i.id}`}
              className={active === i.id ? n.on : undefined}
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
