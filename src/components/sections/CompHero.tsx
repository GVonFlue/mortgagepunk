"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import s from "./CompStage.module.css";

/**
 * The hero, as the approved mockup with working buttons on top — and moving.
 *
 * Replaces the typeset Hero component for now. That one built the headline
 * out of live text, which is better in every way that matters long term —
 * it is real text, it reflows, it is editable from Backstage, and it is
 * sharp at any size. It also does not look like the comp, and the comp is
 * what has to ship.
 *
 * The old Hero is untouched on disk. Restoring it is a one-line swap in
 * page.tsx, which is deliberate: this is a stopgap and should be easy to
 * reverse the moment the real assets exist. See CompStage.module.css for
 * what that costs in the meantime.
 *
 * ---------------------------------------------------------------------------
 * THE MOTION, AND WHY IT IS BUILT THIS WAY
 *
 * The hero is one flat JPEG. Nothing inside it can move independently, so the
 * depth has to come from how the whole plate is handled: it lands with a slow
 * push-out, drifts with the cursor, and pushes in again as the page scrolls.
 *
 * THE TRANSFORM IS ON THE STAGE, NOT ON THE IMAGE. The hotspot over "Have
 * questions? Let's go!" is positioned in percentages of the stage, so moving
 * the stage moves the art and its hotspot together and they cannot drift
 * apart. Transform the background alone and the clickable area stays behind.
 *
 * SCROLL DRIVES SCALE, NOT POSITION. A translate needs somewhere to translate
 * from — overscan — and this plate has very little to spare: the hand-drawn
 * prompt runs to 94.8% of the frame, so cropping much off the bottom clips the
 * arrow. Scaling up only ever crops further into the middle, never reveals an
 * edge, so a slow push-in is both the safer move and the more cinematic one.
 * The small cursor drift is the only translate, and 1.06 of resting scale is
 * enough headroom for it.
 *
 * NOTHING HERE GOES THROUGH setState. A scroll or pointer handler that sets
 * React state re-renders this subtree on every frame. The handlers below
 * write three CSS custom properties straight to the node inside one rAF, so
 * React renders this once and never again.
 *
 * The cursor drift is eased towards its target rather than snapped to it —
 * raw pointer coordinates give a twitchy, mechanical feel, and the lerp is
 * what makes it read as weight.
 */

/* Resting scale. Also the overscan budget: at 1.06 there is 3% of the plate
   outside the frame on each side, which is what the cursor drift moves into. */
const REST = 1.06;
/** How much further the plate pushes in across one screen of scrolling. */
const SCROLL_ZOOM = 0.07;
/** Cursor drift ceiling, px. Kept under the overscan at every breakpoint. */
const DRIFT_X = 11;
const DRIFT_Y = 7;

/* The headline's own travel as the hero scrolls away. Percentages are of the
   headline, not the stage — see .heroHeadline. 55% of its width puts its
   centre on the middle of the page; the downward drift makes it lag the
   scroll so it stays on screen while it grows, which is what reads as coming
   towards you rather than simply leaving. */
const HEAD_X = 55;
const HEAD_Y = 14;
const HEAD_ZOOM = 0.34;

export default function CompHero() {
  const stage = useRef<HTMLElement>(null);
  const headline = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;

    // One switch for everything below. Someone who has asked their system not
    // to animate things gets the plate at rest, not a quieter version of it.
    const still = window.matchMedia("(prefers-reduced-motion:reduce)");
    if (still.matches) return;

    // A touch device has no cursor to follow, and reading pointer events from
    // one makes the plate jump to wherever a finger last landed.
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

    let targetX = 0, targetY = 0;
    let x = 0, y = 0;
    let zoom = REST;
    let frame = 0;
    let running = true;

    function onPointer(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      // -1..1 from the centre of the plate. Negative sign: the art leans away
      // from the cursor, which reads as looking around it rather than dragging
      // it about.
      targetX = -((e.clientX - r.left) / r.width - 0.5) * 2 * DRIFT_X;
      targetY = -((e.clientY - r.top) / r.height - 0.5) * 2 * DRIFT_Y;
    }

    function readScroll() {
      const r = el!.getBoundingClientRect();
      // 0 while the top of the plate is still at the top of the window, 1 once
      // a full window of scrolling has gone by. Clamped, so scrolling far past
      // the hero does not keep winding the zoom up.
      const p = Math.min(1, Math.max(0, -r.top / window.innerHeight));
      zoom = REST + p * SCROLL_ZOOM;

      // The headline rides the same progress, but further and on its own.
      const h = headline.current;
      if (h) {
        h.style.setProperty("--dx", `${(p * HEAD_X).toFixed(2)}%`);
        h.style.setProperty("--dy", `${(p * HEAD_Y).toFixed(2)}%`);
        h.style.setProperty("--dz", (1 + p * HEAD_ZOOM).toFixed(4));
        // Holds full strength through the first half, then dissolves as it
        // crosses Chris — without this it simply sits on top of him.
        const fade = Math.min(1, Math.max(0, (p - 0.5) / 0.42));
        h.style.setProperty("--do", (1 - fade).toFixed(3));
      }
    }

    function tick() {
      if (!running) return;
      // Ease towards the target; 0.075 is slow enough to have weight and fast
      // enough not to lag behind a deliberate movement.
      x += (targetX - x) * 0.075;
      y += (targetY - y) * 0.075;
      el!.style.setProperty("--hx", `${x.toFixed(2)}px`);
      el!.style.setProperty("--hy", `${y.toFixed(2)}px`);
      el!.style.setProperty("--hz", zoom.toFixed(4));
      frame = requestAnimationFrame(tick);
    }

    // Stop the loop entirely when the hero is off screen. Without this it runs
    // for the whole session, on every scroll of every section below.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          frame = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: "120px" }
    );
    io.observe(el);

    readScroll();
    if (fine) window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
    };
  }, []);

  return (
    /* The frame clips. The plate inside is scaled past its own box, so without
       something to crop it the hero would paint over the nav above and the
       Ask section below. */
    <div className={s.heroFrame}>
      <div className={s.heroIntro}>
      <section
        ref={stage}
        className={`${s.stage} ${s.hero} ${s.heroMotion}`}
        aria-label="Reimagining the American Dream"
      >
        {/* Lifted off the plate so they can move. Both are decoration as far
            as assistive tech is concerned — the real h1 is below. */}
        <span className={s.heroHeadline} ref={headline} aria-hidden="true">
          {/* sizes is not optional here. Without it next/image assumes the
              image fills the viewport and serves the 3840px variant — an
              upscale of a 1163px source that took long enough to arrive that
              the headline was still missing a second after load. 60vw covers
              its 45vw resting width plus the 1.34x it reaches on scroll. */}
          <Image
            src="/brand/hero-headline.webp"
            alt=""
            width={1163}
            height={1056}
            sizes="60vw"
            priority
          />
        </span>
        <span className={s.heroSplat} aria-hidden="true">
          <Image
            src="/brand/hero-splat.webp"
            alt=""
            width={460}
            height={332}
            sizes="48vw"
            priority
          />
        </span>
        <span className={s.splatFlash} aria-hidden="true" />

        {/* The headline is inside the image, so the page needs a real h1
            somewhere for screen readers and for search. */}
        <h1 className={s.srOnly}>
          Reimagining the American Dream. Chris Waipa, loan officer, leading a
          movement and building a world-class lending team.
        </h1>

        {/* The v2 design has no buttons in the hero body — Get Approved moved
            into the navigation. What is left is a hand-drawn "Have questions?
            Let's go!" with an arrow pointing down at the Ask section, so that
            prompt is the one thing here worth clicking.

            The span carries the hover bloom. It is masked to the lettering, so
            it has to be a child — a mask on the anchor would clip the focus
            ring too. See CompStage.module.css. */}
        <a
          href="#ask"
          className={`${s.hot} ${s.heroAsk}`}
          aria-label="Have questions? Jump to Ask Mortgage Punk"
        >
          <span className={s.lift} aria-hidden="true" />
          {/* A second masked layer, breathing on its own. The prompt is the
              only instruction in the hero and it is painted flat into a busy
              collage; a slow pulse is what stops it reading as part of the
              wallpaper. It stops on hover, where the bloom above takes over. */}
          <span className={s.pulse} aria-hidden="true" />
        </a>
      </section>
      </div>
    </div>
  );
}
