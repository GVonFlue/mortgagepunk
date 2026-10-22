"use client";

import { useEffect, useRef } from "react";

/**
 * The Movement wall's grid, plus the one thing CSS cannot work out for itself:
 * where each tile actually landed.
 *
 * The wall is a column masonry. Tiles flow down the first column, then the
 * second, so DOM order says nothing about which tiles sit side by side — and
 * the snake (one row sweeping in left to right, the next right to left) is
 * entirely about which tiles sit side by side. So this measures the finished
 * layout and hands each tile two numbers:
 *
 *   --lag  0..1, how late in the sweep it arrives. The first tile of a row
 *          is 0, the last is 1.
 *   --dir  -1 or 1, which side it arrives from — the side the sweep is
 *          coming from, so a row reads as one motion travelling across.
 *
 * "Rows" in a masonry are bands, not lines: a tile belongs to the band its
 * centre falls in, with the band height taken from the column width so it
 * tracks the average tile. Even bands sweep left to right, odd bands right to
 * left — the snake.
 *
 * On two columns (phones) it is a zigzag instead: the left column arrives
 * from the left, the right column from the right and a beat later, so as you
 * scroll the tiles land left, right, left, right.
 *
 * Nothing here animates. It writes two custom properties and stops; the
 * motion is scroll-driven CSS in SocialWall.module.css. Without this script
 * the properties fall back to "no lag, from the left" — every tile still
 * arrives, just without the sweep.
 */
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

    function order() {
      const tiles = Array.from(el!.children) as HTMLElement[];
      if (!tiles.length) return;

      /* LAYOUT POSITIONS, NOT getBoundingClientRect. The rect includes
         transforms, and every tile that has not arrived yet is sitting in
         its entrance pose — slid 70px sideways and scaled down. Read off
         the rect, a six-column wall measured as eighteen columns. offsetLeft
         and offsetTop are where the tile is laid out, which is the thing
         being asked. Rounded, because sub-pixel column widths put tiles in
         the same column a fraction of a pixel apart. */
      const lefts = Array.from(
        new Set(tiles.map((t) => Math.round(t.offsetLeft)))
      ).sort((a, b) => a - b);
      const cols = lefts.length;
      const colW = tiles[0].offsetWidth || 1;
      const band = colW * 1.45;
      const top0 = Math.min(...tiles.map((t) => t.offsetTop));

      for (const t of tiles) {
        const r = { top: t.offsetTop - top0, height: t.offsetHeight };
        const col = lefts.indexOf(Math.round(t.offsetLeft));
        let lag = 0;
        let dir = -1;
        if (cols <= 2) {
          // zigzag
          dir = col === 0 ? -1 : 1;
          lag = col === 0 ? 0 : 0.35;
        } else {
          const row = Math.floor((r.top + r.height / 2) / band);
          const ltr = row % 2 === 0;
          const pos = cols > 1 ? col / (cols - 1) : 0;
          lag = ltr ? pos : 1 - pos;
          dir = ltr ? -1 : 1;
        }
        t.style.setProperty("--lag", lag.toFixed(3));
        t.style.setProperty("--dir", String(dir));
      }
    }

    order();
    // The column count changes at four breakpoints and every tile moves when
    // it does, so the order has to be worked out again on resize.
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(order);
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", order, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", order);
    };
  }, []);

  return (
    <div className={className} ref={grid}>
      {children}
    </div>
  );
}
