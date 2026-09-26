"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import w from "./Waitlist.module.css";
import { TICKET_PRICE } from "@/lib/event";

/**
 * The American Dream Conference waitlist, as a popup.
 *
 * There is no ticket processor yet. Every "Get tickets" button used to leave
 * for mortgagepunklive.com, which sells nothing, so the visitor left the page
 * and came back with less intent than they had. This keeps them where they
 * are and turns the same click into a captured lead.
 *
 * MORTGAGE PUNK BRANDED ON PURPOSE. /movement is the conference sub-brand and
 * runs light. The popup is black, bone and red, because the promise behind the
 * waitlist is Chris's, not the event's, and because a light modal on a light
 * page barely registers as having opened.
 *
 * WHY IT ASKS SIX THINGS RATHER THAN THREE. This list is the launch audience
 * for a $150 ticket. Seat count sizes the room before a ticket is sold, "how
 * did you hear" tells Chris which channel is actually working, and industry
 * is what makes the list worth anything to a sponsor. Every extra field costs
 * completions, so these three earn their place and nothing else was added.
 *
 * Posts to /api/lead like every other form, tagged source "waitlist".
 *
 * Rendered through a portal into <body>: the hero and the tickets band both
 * establish stacking contexts, and a fixed overlay inside one of those is
 * trapped by it rather than covering the page.
 */

type Status = "idle" | "sending" | "sent" | "error";

export default function WaitlistButton({
  className = "",
  label = "Join the waitlist",
}: {
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const firstField = useRef<HTMLInputElement>(null);

  const [f, setF] = useState({
    first: "", last: "", email: "", phone: "",
    tickets: "Just me", heard: "", industry: "",
  });

  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF({ ...f, [k]: e.target.value });

  useEffect(() => setMounted(true), []);

  // Escape closes it, and the page behind stops scrolling while it is open.
  // Without the scroll lock, a phone scrolls the page under the modal as soon
  // as the keyboard pushes the form up.
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
          intent: "American Dream Conference waitlist",
          notes: [
            `Tickets wanted: ${f.tickets}`,
            f.heard.trim() && `Heard about it: ${f.heard.trim()}`,
            f.industry.trim() && `Industry: ${f.industry.trim()}`,
          ]
            .filter(Boolean)
            .join("\n"),
          source: "waitlist",
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
      <div className={w.panel} role="dialog" aria-modal="true" aria-labelledby="wl-title">
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
            <h2 id="wl-title" className={w.title}>
              You&rsquo;re on the list.
            </h2>
            <p className={w.lede}>
              When tickets open you hear first, before they go public. Nothing
              else lands in your inbox in the meantime.
            </p>
          </div>
        ) : (
          <>
            <span className={w.kick}>Pre-register</span>
            <h2 id="wl-title" className={w.title}>
              Tickets aren&rsquo;t open.
              <em>The list is.</em>
            </h2>
            <p className={w.lede}>
              Two days on the Game of Money. Waitlist gets first access before
              tickets go public, and the price when they do is{" "}
              <strong>{TICKET_PRICE}</strong>.
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
              <label className={w.field}>
                <span>How many tickets?</span>
                <select value={f.tickets} onChange={set("tickets")}>
                  <option>Just me</option>
                  <option>2</option>
                  <option>3 to 5</option>
                  <option>6 to 10</option>
                  <option>More than 10</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label className={w.field}>
                <span>How did you hear about it?</span>
                <select value={f.heard} onChange={set("heard")}>
                  <option value="">Choose one</option>
                  <option>Chris directly</option>
                  <option>Social media</option>
                  <option>From a friend</option>
                  <option>A podcast or show</option>
                  <option>At another event</option>
                  <option>Search</option>
                  <option>Somewhere else</option>
                </select>
              </label>
              <label className={`${w.field} ${w.wide}`}>
                <span>What industry are you in?</span>
                <input
                  value={f.industry}
                  onChange={set("industry")}
                  placeholder="Real estate, trades, healthcare, still figuring it out..."
                />
              </label>
            </div>

            <button
              type="button"
              className={w.submit}
              onClick={submit}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Adding you..." : "Put me on the list"}{" "}
              <span aria-hidden="true">&rarr;</span>
            </button>

            {status === "error" && (
              <p className={w.err}>
                Name, email and mobile are required. If it still won&rsquo;t go
                through, try again in a minute.
              </p>
            )}
            <p className={w.disc}>
              We&rsquo;ll only contact you about this event. We do not sell your
              information.
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label} <span aria-hidden="true">&rarr;</span>
      </button>
      {mounted && open && createPortal(modal, document.body)}
    </>
  );
}
