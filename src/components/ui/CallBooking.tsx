"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import w from "@/components/ui/Modal.module.css";
import { CALENDLY_URL, EXTERNAL } from "@/lib/links";

/**
 * "Schedule a call with Chris" — his real Calendly, inside our own frame.
 *
 * WHAT THIS REPLACED, TWICE OVER.
 *
 * First the card painted into the Ask artwork linked to /book. That page is
 * the speaking desk: keynotes, podcasts, press, sponsorship. Somebody who had
 * just read "Real conversation. Real answers." about their mortgage landed on
 * a form asking which event they were hosting.
 *
 * Then this component captured a name, a suggested day and a time window, and
 * Chris confirmed by hand. That existed only because there was no live
 * calendar to point at. There is one now, so the visitor picks a real slot and
 * it is booked — no second message, nothing for Chris to chase, and no gap
 * between wanting the call and having it in the diary.
 *
 * WHY AN IFRAME AND NOT CALENDLY'S POPUP SCRIPT. Their widget.js opens
 * Calendly's own overlay, which is a white box with Calendly's chrome on it —
 * the visitor is visibly handed off to somebody else's product halfway through
 * the page. Embedding the scheduler inside our own modal keeps the frame, the
 * heading, the close button and the scrim ours, and gives Calendly only the
 * grid it needs. It is also one fewer third-party script on every page that
 * carries this button.
 *
 * NOTHING LEAVES THE SITE. That is the whole requirement here — no new tab, no
 * redirect. The one exception is the escape hatch at the foot of the panel,
 * which only matters if the embed cannot load at all; see `failed` below.
 *
 * embed_domain MUST BE THE LIVE HOSTNAME. Calendly checks it before it will
 * render in a frame, and it is what lets the booking post back to us — so it
 * is read from the browser rather than hard-coded, which also means it is
 * correct on a preview deployment without anyone remembering to change it.
 *
 * THE BOOKING STILL REACHES OUR PIPELINE. Calendly emails Chris and writes it
 * to his own calendar, but on its own the lead would exist only in Calendly.
 * The listener below catches `calendly.event_scheduled` and posts it to
 * /api/lead like every other form, so it lands in Backstage and the sheet with
 * the rest. Calendly does not put the invitee's name or email in that message
 * — only the URIs of the event and the invitee — so the record is a pointer,
 * not a contact. Resolving it to a name needs a Calendly API token; see the
 * note on the fetch.
 *
 * Rendered through a portal into <body>: the Ask section is a stacking
 * context, and a fixed overlay inside one is trapped by it. Same reason the
 * chat panel portals out on phones.
 */

/** Calendly's own origin, so a message from anywhere else is ignored. */
const CALENDLY_ORIGIN = "https://calendly.com";

type Phase = "booking" | "booked";

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
  /* NO `mounted` FLAG GUARDING THE PORTAL, which is the usual shape of this.
     The portal is only reached when `open` is true, and `open` can only
     become true from a click — so it cannot run during server rendering and
     there is nothing for the flag to protect against. Dropping it also drops
     a render pass on every mount of every button on the page. */
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("booking");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [src, setSrc] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  /**
   * The embed URL, built on open rather than at module scope.
   *
   * It depends on window.location, so computing it during render would split
   * the server and the client and produce a hydration mismatch. It is also
   * cheap enough to rebuild each time the modal opens, which keeps it correct
   * if the page was navigated between hostnames.
   */
  const build = useCallback(() => {
    const q = new URLSearchParams({
      embed_domain: window.location.hostname,
      embed_type: "Inline",
      /* Calendly's cookie notice is its own banner inside our modal, on a site
         that already carries its policy in the footer. */
      hide_gdpr_banner: "1",
      /* The profile photo, the name and the blurb are already the page the
         visitor is standing on. Without this the first thing inside the frame
         is a second, worse introduction to Chris. */
      hide_landing_page_details: "1",
      /* Brand colours. These are a PAID CALENDLY FEATURE — on a free plan they
         are ignored and the grid renders in Calendly's default blue on white,
         which still sits correctly inside the dark frame, just without the
         red. Nothing breaks either way, so they are sent unconditionally. */
      primary_color: "EB2933",
      text_color: "17110E",
      background_color: "FBFBFB",
    });
    return `${CALENDLY_URL}?${q.toString()}`;
  }, []);

  /* Opening is the one place all of this state is set, and it belongs in the
     handler rather than in an effect watching `open`. An effect would be a
     second render pass every time the modal appears — and React now flags it,
     correctly, as a cascading render. */
  function show() {
    setSrc(build());
    setReady(false);
    setFailed(false);
    setPhase("booking");
    setOpen(true);
  }

  /* Escape closes it, focus moves into the panel, and the page behind stops
     scrolling — without the lock a phone scrolls the page under the modal the
     moment the embed's own scrolling reaches its end. Focus returns to the
     button that opened it, or a keyboard user is dropped at the top of the
     document. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    /* Captured now, not read in the cleanup. By the time cleanup runs the ref
       may point somewhere else entirely, and the focus would land on whatever
       took its place. */
    const opener = trigger.current;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panel.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  /* Calendly talks to the page it is embedded in. The only message that
     matters is the one saying a slot was taken. */
  useEffect(() => {
    if (!open) return;

    function onMessage(e: MessageEvent) {
      // An iframe on any origin can post to this window, so the origin is
      // checked before the payload is read, let alone trusted.
      if (e.origin !== CALENDLY_ORIGIN) return;
      const data = e.data as { event?: string; payload?: unknown };
      if (typeof data?.event !== "string") return;
      if (!data.event.startsWith("calendly.")) return;

      /* ANY message from Calendly is the readiness signal, and the iframe's
         own `load` event is NOT — which is the bug this replaced. An iframe
         fires `load` just as happily for a blocked request or an error page
         as for the real thing, so keying the spinner off it meant that in the
         one case the spinner exists for, it vanished and left a blank white
         rectangle with no explanation and no way out. Calendly only speaks
         once it has actually rendered. */
      setReady(true);

      if (data.event === "calendly.event_scheduled") {
        setPhase("booked");

        /* Fire and forget. The booking is already real in Calendly at this
           point — Chris has the invite and the visitor has the confirmation —
           so a failure here must never surface as an error in front of
           somebody who has just successfully booked a call. It is bookkeeping.

           WHAT GOES IN AND WHAT DOES NOT. Calendly's message carries URIs for
           the event and the invitee and nothing else; the name, email and
           phone the visitor typed stay inside Calendly. So this writes a
           pointer. Turning it into a contact record needs a Calendly personal
           access token and a call to /scheduled_events/{uuid}/invitees from
           the server — worth doing when the CRM webhook goes in, and the URIs
           below are exactly what that call needs. */
        const p = data.payload as
          | { event?: { uri?: string }; invitee?: { uri?: string } }
          | undefined;
        void fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            intent: "Call booked — Calendly",
            notes: [
              "Booked directly through the Calendly embed on the home page.",
              "Name, email and phone are on the Calendly invite.",
              p?.event?.uri && `Event: ${p.event.uri}`,
              p?.invitee?.uri && `Invitee: ${p.invitee.uri}`,
            ]
              .filter(Boolean)
              .join("\n"),
            source: "calendly-booking",
          }),
        }).catch(() => {});
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open]);

  /* The escape hatch appears on a timer rather than on an event, because the
     failure mode here is silence: a privacy extension or a locked-down
     corporate browser blocks the frame and nothing fires at all. Seven
     seconds is long enough that a slow connection does not get told the site
     is broken, and short enough that nobody is left staring at a spinner. */
  useEffect(() => {
    if (!open || ready) return;
    const t = setTimeout(() => setFailed(true), 7000);
    return () => clearTimeout(t);
  }, [open, ready]);

  const modal = (
    <div
      className={w.scrim}
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div
        ref={panel}
        tabIndex={-1}
        className={`${w.panel} ${w.bookPanel}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cb-title"
      >
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

        {phase === "booked" ? (
          <div className={w.done}>
            <span className={w.kick}>Locked in</span>
            <h2 id="cb-title" className={w.title}>
              You&rsquo;re on
              <em>his calendar.</em>
            </h2>
            <p className={w.lede}>
              The invite is in your inbox with the number to call. Bring
              whatever you&rsquo;ve got — a rate someone quoted you, a
              pre-approval that fell over, or nothing at all.
            </p>
            <button
              type="button"
              className={w.submit}
              onClick={() => setOpen(false)}
            >
              Back to the site <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        ) : (
          <>
            <div className={w.bookHead}>
              <span className={w.kick}>Talk it through</span>
              <h2 id="cb-title" className={w.title}>
                Schedule a call
                <em>with Chris.</em>
              </h2>
              <p className={w.lede}>
                No pitch and no credit pull. Pick a time that suits you and
                he&rsquo;ll call.
              </p>
            </div>

            <div className={w.embedWrap}>
              {!ready && (
                <div className={w.embedLoad} aria-live="polite">
                  <span className={w.spinner} aria-hidden="true" />
                  <p>Loading Chris&rsquo;s calendar…</p>
                  {failed && (
                    <p className={w.fallback}>
                      Still nothing? Some browsers block embedded calendars.{" "}
                      <a href={CALENDLY_URL} {...EXTERNAL}>
                        Open it in a new tab instead
                      </a>
                      .
                    </p>
                  )}
                </div>
              )}
              {src && (
                <iframe
                  className={w.embed}
                  src={src}
                  title="Schedule a call with Chris Waipa"
                  /* The scheduler needs its own storage for the timezone and
                     the in-progress booking, and its own scripts and forms to
                     run at all. It gets nothing beyond that — no top-level
                     navigation, so it cannot move the page out from under the
                     visitor, which is the one thing this must never do. */
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              )}
            </div>

            <p className={w.disc}>
              Scheduling runs on Calendly. Chris Waipa &middot; NMLS #339232.
              This is a conversation, not an application.
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={className}
        onClick={show}
        aria-label={children && !label ? "Schedule a call with Chris" : undefined}
      >
        {children ?? (
          <>
            {label ?? "Schedule a call"} <span aria-hidden="true">&rarr;</span>
          </>
        )}
      </button>
      {open && createPortal(modal, document.body)}
    </>
  );
}
