"use client";
// Scroll-driven parallax needs the live scroll offset, which exists only in the
// browser. This is the one client component in the hero: it renders no markup
// and owns no visuals, it just writes three CSS custom properties onto the hero
// element. Every layer that actually paints stays a server component.

import { useEffect } from "react";

/** Peak drift in px at the bottom of the hero. Type moves most, plate barely. */
const DRIFT = { type: 68, chris: 26, plate: 10 } as const;

export default function HeroParallax({ targetId }: { targetId: string }) {
  useEffect(() => {
    const hero = document.getElementById(targetId);
    if (!hero) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      const progress = Math.min(
        Math.max(window.scrollY / (hero.offsetHeight || 1), 0),
        1,
      );
      hero.style.setProperty("--mp-p-type", `${progress * DRIFT.type}px`);
      hero.style.setProperty("--mp-p-chris", `${progress * DRIFT.chris}px`);
      hero.style.setProperty("--mp-p-plate", `${progress * DRIFT.plate}px`);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // Falls back to the stylesheet's 0px defaults, so reduced motion leaves the
    // composition at its designed resting position rather than mid-drift.
    const clear = () => {
      hero.style.removeProperty("--mp-p-type");
      hero.style.removeProperty("--mp-p-chris");
      hero.style.removeProperty("--mp-p-plate");
    };

    const sync = () => {
      if (reduce.matches) {
        window.removeEventListener("scroll", onScroll);
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        clear();
        return;
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      apply();
    };

    sync();
    reduce.addEventListener("change", sync);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      reduce.removeEventListener("change", sync);
    };
  }, [targetId]);

  return null;
}
