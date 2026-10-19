"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import a from "./AskPanel.module.css";
import { APPLY_URL, EXTERNAL } from "@/lib/links";

/**
 * The conversation, as a popup cut from the collage's own paper.
 *
 * WHY THIS REPLACED THE OVERLAY, ORIGINALLY. Asking a question used to open
 * the old dark chat panel on top of the page. It worked, but it threw away
 * the design the moment anyone used it: the visitor pressed a button on a
 * hand-drawn paper collage and got a black software widget in the middle of
 * the screen.
 *
 * WHY IT IS NOW A POPUP AGAIN, AND WHAT IS DIFFERENT. The fix for that went
 * too far the other way: the conversation was squeezed into the gap between
 * the painted headline and the painted cards, which left a box nested inside
 * a box and about one and a half messages of reading space. The client's
 * note was that it "sucks when you start typing in it", with the area it
 * should occupy drawn over a screenshot — the whole right-hand column.
 *
 * So it pops, but it pops in the artwork's own material: the paper is the
 * painted panel keyed out of the mockup and used as a 9-slice frame, and the
 * title is the mockup's own lettering. It is a popup you could not lift out
 * of this page and use anywhere else, which is the test the old dark widget
 * failed. See AskPanel.module.css for how each piece was cut.
 *
 * ONE COMPONENT OWNS BOTH STATES. Resting, it is the field and the send
 * button sitting in the artwork. Active, it is the popup. Splitting those
 * across two components meant two sets of coordinates for the same box, and
 * they drift.
 *
 * IT COVERS THE CARDS, SO IT CARRIES THEM. Get Approved and Schedule a Call
 * are painted into the collage below and the popup lands on top of them, so
 * they are rebuilt along its bottom edge — as the same two cards, not as the
 * text links an earlier attempt demoted them to. Both go to the same places
 * the painted hotspots do; if one of those destinations changes, it changes
 * in two files, here and CompAsk.tsx.
 */

type Msg = { role: "user" | "assistant"; content: string };

/** Thin arrow, matching the one drawn inside the painted send square. */
function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 5.8 19.2 12 13 18.2" />
    </svg>
  );
}

export default function AskPanel() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const panelInput = useRef<HTMLInputElement>(null);

  /* Narrow screens move the popup out of the artwork and onto the page — see
     the media query, and the portal at the bottom of this file for why it
     also has to leave this subtree. Starts false and is set on the client;
     the popup only ever renders after a click, so there is nothing for this
     to get wrong during hydration. */
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width:760px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // On a phone the popup covers the page behind a scrim, so the page must not
  // scroll underneath it.
  useEffect(() => {
    if (!open || !narrow) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, narrow]);

  // Pin to the newest message. scrollTop on the list rather than
  // scrollIntoView: the latter walks up the tree and drags the whole page,
  // which here would yank the visitor away from the section mid-answer.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy]);

  useEffect(() => {
    if (open) panelInput.current?.focus();
  }, [open]);

  // Escape closes it. On a phone the popup covers the page behind a scrim,
  // so without this there is a state with no visible way back on a keyboard.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: clean }];
    setMsgs(next);
    setQ("");
    setOpen(true);
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const j = await r.json();
      setMsgs([
        ...next,
        { role: "assistant", content: j.reply || "I didn't catch that. Try another way?" },
      ]);
    } catch {
      setMsgs([
        ...next,
        {
          role: "assistant",
          content:
            "Something went wrong on my end. Use Get Approved or book a call with Chris below and a real person picks it up.",
        },
      ]);
    }
    setBusy(false);
  }

  /* ---------- resting: the field drawn over the painted one ---------- */
  if (!open) {
    return (
      <div className={a.fieldBox}>
        <input
          className={a.field}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(q)}
          placeholder="Ask me anything about mortgages..."
          aria-label="Ask a question about mortgages"
        />
        <button
          type="button"
          className={a.send}
          onClick={() => send(q)}
          aria-label="Send your question"
        >
          <Arrow />
        </button>
      </div>
    );
  }

  /* ---------- active: the popup ---------- */
  const panel = (
    <>
      {/* Phone only — see the media query. On a laptop the popup sits inside
          the artwork and the rest of the page stays usable behind it. */}
      <button
        type="button"
        className={a.scrim}
        onClick={() => setOpen(false)}
        aria-label="Close the conversation"
        tabIndex={-1}
      />

      <div className={a.pop} role="dialog" aria-label="Ask Mortgage Punk">
        <div className={a.popHead}>
          {/* The mockup's own lettering, lifted off the painted panel with
              its alpha intact, because the popup covers the painted one. */}
          <Image
            src="/brand/ask-headline.png"
            alt="What can I help you with?"
            width={1103}
            height={76}
            className={a.headline}
            priority
          />
          <button
            type="button"
            className={a.close}
            onClick={() => setOpen(false)}
            aria-label="Close the conversation"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className={a.list} ref={listRef}>
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? a.me : a.bot}>
              {m.content
                .split("\n")
                .filter(Boolean)
                .map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
            </div>
          ))}
          {busy && (
            <div className={a.bot}>
              <span className={a.dots}>
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
        </div>

        <div className={a.fieldRow}>
          <input
            ref={panelInput}
            className={a.field}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(q)}
            placeholder="Ask another..."
            aria-label="Ask another question"
          />
          <button
            type="button"
            className={a.send}
            onClick={() => send(q)}
            disabled={busy || !q.trim()}
            aria-label="Send"
          >
            <Arrow />
          </button>
        </div>

        {/* The painted cards, rebuilt because the popup is standing on them. */}
        <div className={a.popCards}>
          <a href={APPLY_URL} {...EXTERNAL} className={a.cardRed}>
            <span className={a.cardMain}>Get Approved</span>
            <span className={a.cardSub}>Start your application. Fast. Simple. No BS.</span>
            <svg viewBox="0 0 24 24" className={a.cardIcon} aria-hidden="true">
              <path d="M3 12h16M13 5.8 19.2 12 13 18.2" />
            </svg>
          </a>
          <Link href="/book" className={a.cardWhite}>
            <span className={a.cardMain}>Schedule a call with Chris</span>
            <span className={a.cardSub}>Real conversation. Real answers.</span>
            <svg viewBox="0 0 24 24" className={a.cardIcon} aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );

  /* ON A PHONE THE POPUP HAS TO LEAVE THIS SUBTREE. The section it lives in
     is `position:relative;z-index:1`, which makes it a stacking context —
     so a fixed, z-index:60 popup inside it is still clamped to that one
     layer, and the Game of Money section further down the page painted
     straight over its lower half. z-index cannot win an argument it is not
     party to; the only fix is to render outside the context, which is what
     the portal does. On a laptop the popup is positioned in percentages of
     the artwork, so there it stays exactly where it is. */
  return narrow ? createPortal(panel, document.body) : panel;
}
