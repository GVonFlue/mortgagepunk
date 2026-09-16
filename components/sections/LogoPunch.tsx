"use client";

// Client component: decides whether the entrance animation should run.

import { useEffect } from "react";

/**
 * Arms the logo punch on the hero.
 *
 * Runs ONCE PER SESSION, not per page load. An entrance that replays every
 * time someone navigates back to the homepage stops being a statement and
 * starts being an obstacle — the difference between a title sequence and a
 * loading screen.
 *
 * Takes the class name as a prop because Hero.module.css is a CSS Module and
 * the name is hashed at build time. Adding the literal string "punching" here
 * would match nothing and fail silently.
 *
 * Adds a class rather than rendering anything, so the hero stays fully server
 * rendered. If JS never runs the page is simply static — nothing sits hidden
 * waiting for a script.
 */
/**
 * REVIEW MODE.
 *
 * true  -> the entrance replays on every page load, for watching it closely.
 * false -> once per browser session, which is what should ship. A title
 *          sequence you cannot skip stops being a statement by the third view.
 *
 * Flip this to false before launch.
 */
const REPLAY_EVERY_LOAD = true;

export default function LogoPunch({
  targetId,
  className,
  readyClass,
}: {
  targetId: string;
  className: string;
  readyClass: string;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!REPLAY_EVERY_LOAD) {
      try {
        if (sessionStorage.getItem("mp_punched")) return;
        sessionStorage.setItem("mp_punched", "1");
      } catch {
        // private mode can throw on sessionStorage; play once and move on
      }
    }

    const el = document.getElementById(targetId);
    if (!el) return;

    /**
     * Two phases, and the gap between them matters.
     *
     * `punchReady` only sets will-change and a null transform. That tells the
     * browser to promote the logo and the stage to their own compositing
     * layers. Giving it a frame to do that work BEFORE the animation starts
     * removed a 210ms hitch on the opening frame — otherwise it rasterises a
     * large image while it is already trying to animate.
     */
    el.classList.add(readyClass);

    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => el.classList.add(className))
    );

    // clear both when finished so nothing is left promoted or mid-transform
    const t = setTimeout(() => {
      el.classList.remove(className);
      el.classList.remove(readyClass);
    }, 2600);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [targetId, className, readyClass]);

  return null;
}
