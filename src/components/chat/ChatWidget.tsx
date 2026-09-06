"use client";

// Client component: conversation state, streaming-free request/response.

import { useState, useRef, useEffect } from "react";
import s from "../Site.module.css";

/**
 * The assistant, as a floating launcher rather than a homepage section.
 *
 * It rides every page because the question someone has usually arrives while
 * they're reading something else — halfway through the process walkthrough, or
 * on the investors page. Pinning it to one section would mean they have to
 * scroll back to ask.
 *
 * The "AI assistant" line under the header stays. People are entitled to know
 * what they're talking to, and on a regulated financial site that isn't
 * optional.
 */

type Msg = { role: "user" | "assistant"; content: string };

const OPENERS = [
  "What do I actually need to get pre-approved?",
  "What's the difference between pre-qualified and pre-approved?",
  "How much should I have saved?",
  "What is the American Dream Conference?",
];

const GREETING =
  "Hey. I'm the assistant on Chris's site — ask me anything about how mortgages actually work, what the process looks like, or what Mortgage Punk is about. I can't quote rates or tell you what you'd qualify for, but I can explain almost anything else, and I'll get you to a human the moment that's more useful.";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

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
        // drop the canned greeting — it isn't part of the real conversation
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const j = await r.json();
      setMsgs([
        ...next,
        {
          role: "assistant",
          content: j.reply || "I didn't catch that. Try asking another way?",
        },
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

  return (
    <>
      <button
        type="button"
        className={s.chatFab}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close the assistant" : "Ask a question"}
        aria-expanded={open}
      >
        {open ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.3-.6L3 21l1.8-4.6A8.3 8.3 0 0 1 3.6 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 8.4 8.4z" />
            </svg>
            <span>Ask a question</span>
          </>
        )}
      </button>

      {open && (
        <div className={s.chatPanel} role="dialog" aria-label="Mortgage Punk assistant">
          <div className={s.chatHead}>
            <div>
              <strong>Ask Mortgage Punk</strong>
              <span>AI assistant &middot; not a loan officer</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className={s.chatBody}>
            {msgs.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? s.chatMine : s.chatTheirs}
              >
                {m.content.split("\n").filter(Boolean).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            ))}

            {msgs.length === 1 && (
              <div className={s.chatChips}>
                {OPENERS.map((q) => (
                  <button key={q} type="button" onClick={() => send(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {busy && (
              <div className={s.chatTheirs}>
                <p className={s.chatDots}>
                  <span /><span /><span />
                </p>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className={s.chatFoot}>
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
          <p className={s.chatLegal}>
            General information only. Not a rate quote, a pre-approval, or
            financial advice.
          </p>
        </div>
      )}
    </>
  );
}
