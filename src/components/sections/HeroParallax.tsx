"use client";

// Client component: needs scroll position and rAF. Renders nothing — it only
// writes CSS custom properties that Hero.module.css already consumes.

import { useEffect } from "react";

export default function HeroParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;

    let raf = 0;

    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const h = hero.offsetHeight || 1;
      const t = Math.min(y / h, 1); // 0 at top, 1 once the hero is scrolled past

      // type moves most, Chris less, plate barely — small offsets read as depth
      hero.style.setProperty("--p-type", `${t * -110}px`);
      hero.style.setProperty("--p-chris", `${t * -46}px`);
      hero.style.setProperty("--p-plate", `${t * 26}px`);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
