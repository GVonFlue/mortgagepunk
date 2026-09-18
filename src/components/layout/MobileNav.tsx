"use client";

// Client component: open state, focus handling, and the escape key.

import { useState, useEffect } from "react";
import Link from "next/link";
import { APPLY_URL, EXTERNAL } from "@/lib/links";
import m from "./MobileNav.module.css";

/**
 * Mobile navigation.
 *
 * Both navs hid `.links` below their breakpoint and put nothing in their
 * place, so a phone had no way to reach any page but the one it landed on.
 * This is the replacement, shared by the hero nav and the inner-page nav so
 * there is one menu to maintain rather than two that drift.
 *
 * A full-screen sheet rather than a dropdown: the links are set in display
 * type at a size worth tapping, and on a small screen a panel that covers
 * everything is easier to use than one competing with the page behind it.
 */

const LINKS = [
  { label: "Ask Mortgage Punk", href: "/#ask" },
  { label: "The Game of Money", href: "/#money" },
  { label: "The Movement", href: "/#movement" },
  { label: "Chris", href: "/about" },
  // still reachable, just no longer on the homepage
  { label: "Lending", href: "/lending" },
  { label: "Tools", href: "/tools" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  // Esc closes, and the page behind must not scroll while the sheet is up
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={m.burger}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className={m.sheet} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={m.sheetTop}>
            <span className={m.sheetLabel}>Menu</span>
            <button
              type="button"
              className={m.close}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className={m.list}>
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${60 + i * 45}ms` }}
              >
                <span className={m.num}>{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className={m.sheetFoot}>
            <a href={APPLY_URL} {...EXTERNAL} className={m.apply}>
              Get approved <span aria-hidden="true">&rarr;</span>
            </a>
            <Link href="/contact" className={m.secondary} onClick={() => setOpen(false)}>
              Talk to a person
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
