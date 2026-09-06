"use client";

// Client component: launcher state and the overlay shell.

import { useState, useEffect } from "react";
import ChatStage from "./ChatStage";
import s from "./Chat.module.css";

/**
 * The floating launcher, and the full stage it opens.
 *
 * The stage is deliberately not a corner bubble. A corner bubble reads as
 * support; this reads as talking to the brand, which is what Chris's demo was
 * reaching for and what makes someone stay in it long enough to convert.
 *
 * Mounted in the root layout so it rides every page — a question usually
 * arrives mid-read, and a section would mean scrolling back to ask.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  // Esc closes it, and the page behind must not scroll while it's up
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
      {!open && (
        <button
          type="button"
          className={s.fab}
          onClick={() => setOpen(true)}
          aria-label="Ask a question"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.3-.6L3 21l1.8-4.6A8.3 8.3 0 0 1 3.6 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 8.4 8.4z" />
          </svg>
          <span>Ask a question</span>
        </button>
      )}

      {open && (
        <div
          className={s.scrim}
          role="dialog"
          aria-modal="true"
          aria-label="Ask Mortgage Punk"
          // clicking the backdrop closes; clicking the stage must not
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <ChatStage variant="overlay" onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
