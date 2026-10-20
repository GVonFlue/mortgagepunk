"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import w from "@/components/ui/Modal.module.css";

/**
 * "Schedule a call with Chris" — about a mortgage, not about a stage.
 *
 * WHAT THIS REPLACED, AND WHY IT WAS WRONG. The card painted into the Ask
 * artwork linked to /book. That page is the speaking desk: keynotes, podcasts,
 * press and sponsorship. So somebody who had just read "Real conversation.
 * Real answers." about their mortgage landed on a form asking which event they
 * were hosting. The two audiences have nothing in common and the booking page
 * cannot serve both, so the lending side gets its own path.
 *
 * IT CAPTURES RATHER THAN BOOKS, on purpose. A live calendar would need
 * Chris's availability wired in, and his real constraint is not an empty slot
 * — it is that he wants to know what the call is about before it starts. So
 * the visitor proposes a day and a window and says what they need, Chris
 * confirms. That also means the lead exists the moment they hit send, even if
 * no time ever gets agreed, which a calendar embed cannot promise.
 *
 * THE TRIGGER IS WHATEVER YOU PASS AS CHILDREN. On the home page this wraps a
 * transparent hotspot sitting over painted artwork, so it must render no text
 * of its own; on the Chris page it is an ordinary button with a label. One
 * component either way — the alternative was two copies of this form.
 *
 * Posts to /api/lead like every other form, tagged source "call-request", so
 * it lands in Backstage and the sheet with everything else.
 *
 * Rendered through a portal into <body>: the Ask section is a stacking
 * context, and a fixed overlay inside one is trapped by it. Same reason the
 * chat panel portals out on phones.
 */

type Status = "idle" | "sending" | "sent" | "error";

/** Windows, not clock times. See the note above about capture vs booking. */
const WINDOWS = [
  "Morning (8–11)",
  "Midday (11–2)",
  "Afternoon (2–5)",
  "After 5",
  "Any time — you pick",
];

const ABOUT = [
  "Buying a home",
  "Refinancing",
  "Accessing my equity",
  "An investment property",
  "Just exploring my options",
];

export default function CallBooking({
  className = "",
  children,
  label,
}: {
  className?: string;
  /** The trigger's contents. Use this for a hotspot with no text of its own. */
  children?: React.ReactNode;
  /** Convenience for an ordinary labelled button. */
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const firstField = useRef<HTMLInputElement>(null);

  const [f, setF] = useState({
    first: "", last: "", email: "", phone: "",
    about: ABOUT[0], day: "", window: WINDOWS[4], note: "",
  });

  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF({ ...f, [k]: e.target.value });

  useEffect(() => setMounted(true), []);

  // Escape closes it, and the page behind stops scrolling while it is open —
  // without the lock a phone scrolls the page under the modal the moment the
  // keyboard pushes the form up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    firstField.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /** Today, so the date field cannot propose a day that has already gone. */
  const today = new Date().toISOString().slice(0, 10);

  async function submit() {
    if (!f.first.trim() || !f.email.trim() || !f.phone.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first: f.first,
          last: f.last,
          email: f.email,
          phone: f.phone,
          intent: `Call request — ${f.about}`,
          notes: [
            `About: ${f.about}`,
            f.day && `Suggested day: ${f.day}`,
            `Window: ${f.window}`,
            f.note.trim() && `Notes: ${f.note.trim()}`,
          ]
            .filter(Boolean)
            .join("\n"),
          source: "call-request",
        }),
      });
      setStatus(r.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const modal = (
    <div
      className={w.scrim}
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className={w.panel} role="dialog" aria-modal="true" aria-labelledby="cb-title">
        <button
          type="button"
          className={w.close}
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {status === "sent" ? (
          <div className={w.done}>
            <h2 id="cb-title" className={w.title}>
              Chris has it.
            </h2>
            <p className={w.lede}>
              He confirms the time himself, usually the same day. If what you
              need turns out to be a two-minute answer rather than a call,
              he&rsquo;ll just tell you that instead.
            </p>
          </div>
        ) : (
          <>
            <span className={w.kick}>Talk it through</span>
            <h2 id="cb-title" className={w.title}>
              Schedule a call
              <em>with Chris.</em>
            </h2>
            <p className={w.lede}>
              No pitch and no credit pull. Tell him what you&rsquo;re working
              out and when suits you, and he&rsquo;ll confirm a time.
            </p>

            <div className={w.grid}>
              <label className={w.field}>
                <span>First name</span>
                <input ref={firstField} value={f.first} onChange={set("first")} autoComplete="given-name" />
              </label>
              <label className={w.field}>
                <span>Last name</span>
                <input value={f.last} onChange={set("last")} autoComplete="family-name" />
              </label>
              <label className={w.field}>
                <span>Email</span>
                <input type="email" value={f.email} onChange={set("email")} autoComplete="email" />
              </label>
              <label className={w.field}>
                <span>Mobile</span>
                <input type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" />
              </label>
              <label className={`${w.field} ${w.wide}`}>
                <span>What&rsquo;s the call about?</span>
                <select value={f.about} onChange={set("about")}>
                  {ABOUT.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className={w.field}>
                <span>A day that works</span>
                <input type="date" min={today} value={f.day} onChange={set("day")} />
              </label>
              <label className={w.field}>
                <span>Time of day</span>
                <select value={f.window} onChange={set("window")}>
                  {WINDOWS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className={`${w.field} ${w.wide}`}>
                <span>Anything Chris should know first?</span>
                <input
                  value={f.note}
                  onChange={set("note")}
                  placeholder="Self-employed, first place, rate I was quoted, a deadline..."
                />
              </label>
            </div>

            <button
              type="button"
              className={w.submit}
              onClick={submit}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Request the call"}{" "}
              <span aria-hidden="true">&rarr;</span>
            </button>

            {status === "error" && (
              <p className={w.err}>
                Name, email and mobile are required. If it still won&rsquo;t go
                through, try again in a minute.
              </p>
            )}
            <p className={w.disc}>
              This is a conversation, not an application. We do not sell your
              information.
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        aria-label={children && !label ? "Schedule a call with Chris" : undefined}
      >
        {children ?? (
          <>
            {label ?? "Schedule a call"} <span aria-hidden="true">&rarr;</span>
          </>
        )}
      </button>
      {mounted && open && createPortal(modal, document.body)}
    </>
  );
}
