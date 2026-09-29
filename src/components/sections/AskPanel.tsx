"use client";

import { useState, useRef, useEffect } from "react";
import a from "./AskPanel.module.css";

/**
 * The conversation, inside the paper panel it was started from.
 *
 * WHY THIS REPLACED THE OVERLAY. Asking a question used to open the old dark
 * chat panel on top of the page. It worked, but it threw away the design the
 * moment anyone used it: the visitor pressed a button on a hand-drawn paper
 * collage and got a black software widget in the middle of the screen. The
 * conversation now happens in the same paper panel, in the same place, so the
 * section never stops looking like itself.
 *
 * ONE COMPONENT OWNS BOTH STATES. Resting, it is the field and the send
 * button sitting in the artwork. Active, it is a torn paper panel holding the
 * transcript above the same field. Splitting those across two components
 * meant two sets of coordinates for the same box, and they drift.
 *
 * NO HEADER. The panel opens BELOW the painted "WHAT CAN I HELP YOU WITH?"
 * and its marker underline, so the artwork titles the conversation. The first
 * version reproduced that headline in Anton inside the panel, which put two
 * competing titles on screen and made the panel look like a widget parked on
 * the collage rather than another scrap of paper in it.
 *
 * IT DOES NOT COVER THE CARDS. Get Approved and Talk to Chris are painted
 * into the collage below, already themed in its own hand, and they keep
 * working while a conversation is open. An earlier version ran the panel down
 * over them and rebuilt them as small text links in its footer — two of the
 * best-looking buttons on the page swapped for the plainest thing on it.
 */

type Msg = { role: "user" | "assistant"; content: string };

/**
 * Shown when the panel is opened from the big red button rather than by
 * typing. Pressing a button labelled "Ask Mortgage Punk" and landing in an
 * empty box is a dead end; this gives the visitor something to answer.
 */
const GREETING =
  "What are you trying to do — buy, refinance, or pull equity out? " +
  "Ask me anything and I'll give it to you straight.";

export default function AskPanel() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const panelInput = useRef<HTMLInputElement>(null);

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

  /* ---------- resting: the field drawn into the artwork ---------- */
  if (!open) {
    return (
      <>
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
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.4 20.4 22 12 2.4 3.6 2.4 10.2 16 12 2.4 13.8z" />
          </svg>
        </button>
        </div>

        {/* The big red button is painted into the artwork. This sits over it
            and opens the panel, so the loudest element in the design is not
            the one thing that does nothing. */}
        <button
          type="button"
          className={a.bigBtn}
          onClick={() => {
            setMsgs([{ role: "assistant", content: GREETING }]);
            setOpen(true);
          }}
          aria-label="Ask Mortgage Punk"
        />
      </>
    );
  }

  /* ---------- active: the panel, in the same paper ---------- */
  return (
    <div className={a.panel} role="dialog" aria-label="Ask Mortgage Punk">
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

      <div className={a.sheet}>
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
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.4 20.4 22 12 2.4 3.6 2.4 10.2 16 12 2.4 13.8z" />
          </svg>
        </button>
        </div>
      </div>
    </div>
  );
}
