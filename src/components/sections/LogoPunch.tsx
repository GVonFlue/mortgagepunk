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
export default function LogoPunch({
  targetId,
  className,
}: {
  targetId: string;
  className: string;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      if (sessionStorage.getItem("mp_punched")) return;
      sessionStorage.setItem("mp_punched", "1");
    } catch {
      // private mode can throw on sessionStorage; play once and move on
    }

    const el = document.getElementById(targetId);
    if (!el) return;
    el.classList.add(className);

    // clear it when finished so nothing is left mid-transform
    const t = setTimeout(() => el.classList.remove(className), 1400);
    return () => clearTimeout(t);
  }, [targetId, className]);

  return null;
}
