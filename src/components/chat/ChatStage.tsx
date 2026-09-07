"use client";

// Client component: conversation state, the request, and lead capture.

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import s from "./Chat.module.css";

/**
 * The assistant, as a full stage rather than a corner bubble.
 *
 * Modelled on the Ask Chris demo in the GetProyTech repo: Chris large and
 * grayscale at the right, the conversation running down the left, and a
 * standing compliance note. That demo was a static mockup; this is the same
 * shape wired to a live model.
 *
 * One component, two shells. `variant="overlay"` is what the floating button
 * opens; `variant="inline"` is the homepage section. Splitting them would mean
 * two copies of the conversation logic and two places for a bug to live.
 *
 * LEAD CAPTURE is explicit, not scraped. After a few exchanges a card appears
 * offering a follow-up. Harvesting an email out of free text works sometimes
 * and misses often — asking plainly converts better and is honest about what
 * happens next.
 */

type Msg = { role: "user" | "assistant"; content: string };

const OPENERS = [
  "What do I actually need to get pre-approved?",
  "What's the difference between pre-qualified and pre-approved?",
  "How much should I have saved?",
  "What is the American Dream Conference?",
];

const GREETING =
  "Hey. Ask me anything about how mortgages actually work, what the process looks like, or what Mortgage Punk is about. I can't quote rates or tell you what you'd qualify for — but I can explain almost everything else, and I'll get you to a person the moment that's more useful.";

export default function ChatStage({
  variant = "inline",
  onClose,
}: {
  variant?: "inline" | "overlay";
  onClose?: () => void;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [lead, setLead] = useState({ first: "", email: "", phone: "" });
  const [leadErr, setLeadErr] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const exchanges = msgs.filter((m) => m.role === "user").length;

  /**
   * Keep the conversation pinned to the newest message.
   *
   * Deliberately NOT scrollIntoView: that walks up the tree and scrolls every
   * scrollable ancestor, including the window. Since this component is
   * embedded mid-homepage, calling it on mount dragged the whole page down to
   * the chat — which looked exactly like a broken scroll position on reload.
   *
   * Setting scrollTop on the list itself cannot affect the page. The first
   * render is skipped so nothing moves at all until there's a real message.
   */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, showCapture]);

  // offer the follow-up once there's a real conversation, not on message one
  useEffect(() => {
    if (exchanges >= 2 && !captured) setShowCapture(true);
  }, [exchanges, captured]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: clean }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
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
            "Something went wrong on my end. The team is reachable through the form on this page and they answer fast.",
        },
      ]);
    }
    setBusy(false);
  }

  async function submitLead() {
    if (!lead.first.trim() || !lead.email.trim() || !lead.phone.trim()) {
      return setLeadErr("Name, email and mobile — then we'll stop asking.");
    }
    setLeadErr("");
    setBusy(true);
    try {
      const transcript = msgs
        .slice(1)
        .map((m) => `${m.role === "user" ? "Them" : "Assistant"}: ${m.content}`)
        .join("\n\n");
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          last: "",
          intent: "Asked the assistant",
          notes: transcript,
          source: "chat",
        }),
      });
      if (!r.ok) throw new Error();
      setCaptured(true);
      setShowCapture(false);
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: `Got it, ${lead.first.trim()}. Someone from the team will reach out — a real person, not a drip campaign. Keep asking in the meantime.`,
        },
      ]);
    } catch {
      setLeadErr("That didn't send. Try again, or use the form on this page.");
    }
    setBusy(false);
  }

  return (
    <div className={`${s.stage} ${variant === "overlay" ? s.stageOverlay : ""}`}>
      {/* Chris, big and grayscale at the right — straight from the demo */}
      <div className={s.stagePhoto} aria-hidden="true">
        <Image
          src="/brand/askchris.png"
          alt=""
          width={900}
          height={1255}
          sizes="(max-width: 900px) 0px, 40vw"
        />
      </div>

      <div className={s.stageInner}>
        <div className={s.stageTop}>
          <div>
            <span className={s.stageLabel}>Ask Mortgage Punk</span>
            <span className={s.stageStatus}>
              <i />
              AI assistant &middot; not a loan officer
            </span>
          </div>
          {onClose && (
            <button type="button" className={s.stageClose} onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>

        <div className={s.msgs} ref={listRef}>
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? s.msgMe : s.msgBot}>
              {m.content.split("\n").filter(Boolean).map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          ))}

          {msgs.length === 1 && (
            <div className={s.openers}>
              {OPENERS.map((q) => (
                <button key={q} type="button" onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {busy && (
            <div className={s.msgBot}>
              <span className={s.dots}>
                <i /><i /><i />
              </span>
            </div>
          )}

          {showCapture && (
            <div className={s.capture}>
              <strong>Want a person to pick this up?</strong>
              <p>
                Leave these and someone from the team follows up. No obligation,
                and you can keep asking either way.
              </p>
              <div className={s.captureRow}>
                <input
                  placeholder="First name"
                  value={lead.first}
                  onChange={(e) => setLead({ ...lead, first: e.target.value })}
                  aria-label="First name"
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                  aria-label="Email"
                />
                <input
                  placeholder="Mobile"
                  type="tel"
                  value={lead.phone}
                  onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                  aria-label="Mobile"
                />
              </div>
              {leadErr && <p className={s.captureErr}>{leadErr}</p>}
              <div className={s.captureBtns}>
                <button type="button" className={s.captureGo} onClick={submitLead} disabled={busy}>
                  Have someone reach out
                </button>
                <button
                  type="button"
                  className={s.captureSkip}
                  onClick={() => setShowCapture(false)}
                >
                  Not yet
                </button>
              </div>
            </div>
          )}

        </div>

        <div className={s.inrow}>
          <input
            value={input}
            placeholder="Ask anything about the process..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            aria-label="Your question"
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={busy || !input.trim()}
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <p className={s.stageNote}>
          General information only. Not a rate quote, a pre-approval, or
          financial advice. Chris Waipa &middot; NMLS #339232.
        </p>
      </div>
    </div>
  );
}
