"use client";

import { useEffect, useRef } from "react";

/**
 * The Opening Act's entrance: it flies out of the viewer, from the middle of
 * the screen, slams into its place on the page and lights up on impact.
 *
 * TRIGGERED, NOT SCRUBBED. Everything else on the wall is tied to the scroll
 * position. A slam can't be: scrubbed, an impact plays at whatever speed the
 * reader happens to scroll, which on a slow trackpad reads as a gentle
 * shrink. So this watches for the set to come into view and then plays the
 * whole thing in under a second, on the clock, the same every time.
 *
 * Three states, on data-entrance, read by MoneyWall.module.css:
 *   (none)   resting — the set as it always was. The server renders this,
 *            so without JavaScript, or with reduced motion, nothing hides.
 *   wait     below the screen, not yet seen: invisible, waiting.
 *   fly      playing. Ends back at (none) on animationend.
 *
 * It re-arms when the set drops entirely below the screen again — scrolled
 * back up past it — so it plays again on the way down. Useful for rehearsal,
 * and right for a reader who goes back up to the hero.
 *
 * When it fires, and why there are two ways, is explained in the effect.
 *
 * --fromY is set at the moment it plays: the distance from the set's centre
 * to the middle of the screen, so it starts out of the middle of the screen
 * rather than out of wherever the set happens to sit as it scrolls in.
 */
export default function Entrance({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    /* TWO WAYS TO FIRE.

       1. The set's top edge rises past 45% of the screen. On a laptop the set
          is nearly as tall as the window, so it can only be seen whole when
          its top is near the top of the screen; firing at first sight landed
          the slam with 53-61% of it showing. From 45%, with the half second
          of flight still to go while the page keeps moving, most of it is in
          view at impact. On a phone the set is small and lands whole either
          way.

       2. Scrolling stops with at least a quarter of the set on screen. This
          is what makes the late line safe: clicking "The Game of Money" in
          the nav stops the page with the set's top at about 61% of a laptop
          screen — short of the line — and without this it would wait there
          invisible for a scroll that never comes. It also covers anyone who
          simply stops part-way.

       ON SCREEN AT ALL WHEN THE PAGE LOADS — a link straight to #money, a
       refresh there — and it stays resting: playing it then would show the
       finished set from the server's HTML, snap it away and slam it back. */
    const LINE = 0.45;
    const r0 = el.getBoundingClientRect();
    const onScreenAtLoad = r0.top < window.innerHeight && r0.bottom > 0;
    if (!onScreenAtLoad && r0.top > 0) el.dataset.entrance = "wait";

    function play() {
      const r = el!.getBoundingClientRect();
      const fromY = window.innerHeight / 2 - (r.top + r.height / 2);
      el!.style.setProperty("--fromY", `${Math.round(fromY)}px`);
      el!.dataset.entrance = "fly";
    }

    // 1. Fires as the set's top crosses the line.
    const trigger = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && el.dataset.entrance === "wait") play();
      },
      { rootMargin: `0px 0px -${Math.round((1 - LINE) * 100)}% 0px`, threshold: 0 }
    );
    // 2. Fires when scrolling settles with enough of the set showing. A
    // debounce rather than the scrollend event, which Safari only recently
    // gained.
    let settle = 0;
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (el.dataset.entrance !== "wait") return;
        const r = el.getBoundingClientRect();
        const shown = Math.min(window.innerHeight, r.bottom) - Math.max(0, r.top);
        if (shown >= r.height * 0.25) play();
      }, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Re-arms only once the set is ENTIRELY below the screen — scrolled back
    // up past it. Re-arming at the line instead would make a set you can
    // still see vanish as you scroll up.
    const rearm = new IntersectionObserver(
      ([e]) => {
        if (!el.dataset.entrance && !e.isIntersecting && e.boundingClientRect.top > 0) {
          el.dataset.entrance = "wait";
        }
      },
      { threshold: 0 }
    );

    // Only this element's own animation ends the entrance. The glow inside it
    // breathes forever and the badge and covers have animations of their own,
    // and animationend bubbles from all of them.
    const onEnd = (ev: AnimationEvent) => {
      if (ev.target === el && el.dataset.entrance === "fly") {
        delete el.dataset.entrance;
      }
    };

    el.addEventListener("animationend", onEnd);
    trigger.observe(el);
    rearm.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settle);
      trigger.disconnect();
      rearm.disconnect();
      el.removeEventListener("animationend", onEnd);
      delete el.dataset.entrance;
    };
  }, []);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}
