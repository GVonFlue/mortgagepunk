"use client";

import { useEffect, useRef } from "react";

/**
 * The Movement wall's grid, and the scroll animation that runs on it.
 *
 * WHY THIS IS SCRIPT AND NOT CSS. The first version was pure CSS scroll
 * timelines (animation-timeline: view()). Chrome on a laptop ran it exactly
 * as designed; an iPhone showed nothing. Every browser on an iPhone — Chrome
 * included — is Safari's engine underneath, and scroll timelines there depend
 * on the iOS version and on how that engine handles a multi-column layout,
 * which is what this wall is. Neither could be tested from here. A scroll
 * listener runs on everything, so the wall now computes its own progress and
 * hands CSS two numbers per tile (see SocialWall.module.css):
 *
 *   --e  0..1  how far the tile has landed
 *   --g  0..1  how grey it is (0 colour, 1 the wall's resting black and white)
 *
 * plus the --dir it arrives from. The CSS defaults are the resting state, so
 * without this script the wall is simply the wall.
 *
 * THE CHOREOGRAPHY, unchanged from the version you saw on desktop:
 *
 *   Desktop — the snake. Each visual row sweeps in from one side, the first
 *   left to right, the next right to left. A tile lands over 40% of its own
 *   height of scrolling, starting later the further along the sweep it is
 *   (up to 60% of its height), so every tile has landed by the time it is
 *   fully on screen. It arrives in colour and greys out by the time it is
 *   half way up the screen.
 *
 *   Phone — a zigzag. Left column from the left, right column from the right
 *   and a beat later. Measured over the tile's whole pass up the screen: it
 *   lands in the first 22%, holds colour to 45%, is grey by 65%.
 *
 * WHERE EACH TILE IS, AND WHY IT IS MEASURED AT REST. In a column masonry DOM
 * order says nothing about which tiles sit side by side, so positions come
 * from the finished layout. They are read with every tile's variables
 * cleared — at rest, no transform — because a tile mid-entrance is slid 70px
 * sideways and shrunk, and measuring it then put a six-column wall at
 * eighteen columns. Measured once, then again on resize; scrolling only does
 * arithmetic on the cached numbers, never asks the layout anything, so it
 * cannot force a reflow per frame.
 */

type Spot = {
  el: HTMLElement;
  top: number; // document position at rest
  h: number;
  lag: number; // 0..1, how late in the sweep
  e: number; // last written values, to skip redundant writes
  g: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function SnakeGrid({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    let spots: Spot[] = [];
    let cols = 1;
    let frame = 0;

    function measure() {
      const tiles = Array.from(el!.children) as HTMLElement[];
      // Back to rest before reading anything — see the note above.
      for (const t of tiles) {
        t.style.removeProperty("--e");
        t.style.removeProperty("--g");
      }
      const y = window.scrollY;
      const rects = tiles.map((t) => t.getBoundingClientRect());
      const lefts = Array.from(new Set(rects.map((r) => Math.round(r.left)))).sort(
        (a, b) => a - b
      );
      cols = lefts.length;
      const colW = rects[0]?.width || 1;
      const band = colW * 1.45;
      const top0 = Math.min(...rects.map((r) => r.top));

      spots = tiles.map((t, i) => {
        const r = rects[i];
        const col = lefts.indexOf(Math.round(r.left));
        let lag = 0;
        let dir = -1;
        if (cols <= 2) {
          dir = col === 0 ? -1 : 1;
          lag = col === 0 ? 0 : 0.35;
        } else {
          const row = Math.floor((r.top - top0 + r.height / 2) / band);
          const ltr = row % 2 === 0;
          const pos = cols > 1 ? col / (cols - 1) : 0;
          lag = ltr ? pos : 1 - pos;
          dir = ltr ? -1 : 1;
        }
        t.style.setProperty("--dir", String(dir));
        return { el: t, top: r.top + y, h: r.height, lag, e: -1, g: -1 };
      });
    }

    function paint() {
      frame = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const phone = cols <= 2;
      for (const s of spots) {
        // Scroll travelled since the tile's top crossed the bottom of the screen.
        const d = y + vh - s.top;
        let e: number;
        let g: number;
        if (phone) {
          const c = d / (vh + s.h); // 0..1 across the tile's whole pass
          e = clamp01((c - s.lag * 0.06) / 0.22);
          g = clamp01((c / 0.65 - 0.45) / 0.55);
        } else {
          const start = s.lag * 0.6 * s.h;
          e = clamp01((d - start) / (0.4 * s.h));
          const inkEnd = 0.5 * (vh + s.h);
          const k = clamp01((d - start) / Math.max(1, inkEnd - start));
          g = clamp01((k - 0.4) / 0.6);
        }
        // Ease the landing out: fast as it arrives, gentle as it settles.
        e = 1 - (1 - e) * (1 - e);
        // Only touch the style when it actually changed — thirty-six tiles
        // rewritten every frame would be pointless work for the ones far
        // off screen, which sit at 0 or 1.
        if (Math.abs(e - s.e) > 0.002) {
          s.el.style.setProperty("--e", e.toFixed(3));
          s.e = e;
        }
        if (Math.abs(g - s.g) > 0.002) {
          s.el.style.setProperty("--g", g.toFixed(3));
          s.g = g;
        }
      }
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const remeasure = () => {
      measure();
      paint();
    };

    remeasure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    // Positions above the wall can still be settling when this first runs —
    // fonts, the hero image, a video poster — so measure again on load.
    window.addEventListener("load", remeasure, { once: true });

    // And whenever the page changes height for any other reason. The cached
    // tops are document positions, so anything above the wall growing — a
    // video swapping its poster for a player, a late image — would leave
    // every tile animating against where it used to be. One remeasure per
    // frame at most.
    let pending = 0;
    let lastH = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (h === lastH || pending) return;
      lastH = h;
      pending = requestAnimationFrame(() => {
        pending = 0;
        remeasure();
      });
    });
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(pending);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
      for (const s of spots) {
        s.el.style.removeProperty("--e");
        s.el.style.removeProperty("--g");
        s.el.style.removeProperty("--dir");
      }
    };
  }, []);

  return (
    <div className={className} ref={grid}>
      {children}
    </div>
  );
}
