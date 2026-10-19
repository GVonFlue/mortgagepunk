"use client";

import Image from "next/image";
import Link from "next/link";
import p from "./ChatPaper.module.css";
import { APPLY_URL, EXTERNAL } from "@/lib/links";
import type { Msg } from "./useChatThread";

/**
 * The conversation, as a sheet of the collage's own paper.
 *
 * ONE PANEL, TWO PLACEMENTS. In the home page's Ask section it sits inside
 * the artwork, in the column the client drew over a screenshot. Everywhere
 * else the floating launcher docks it in the corner. Those are the same
 * component with a different `place` class — the material, the title, the
 * bubbles and the two cards do not change, because the whole point is that
 * the assistant looks like one thing wherever you meet it.
 *
 * Everything about why it is built from the artwork rather than styled to
 * resemble it is in ChatPaper.module.css.
 */

/** Thin arrow, matching the one drawn inside the painted send square. */
export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M13 5.8 19.2 12 13 18.2" />
    </svg>
  );
}

export default function ChatPaper({
  place,
  msgs,
  busy,
  q,
  setQ,
  onSend,
  onClose,
  listRef,
  inputRef,
}: {
  /** Which placement class to wear — p.pop in the artwork, p.dock in the corner. */
  place: string;
  msgs: Msg[];
  busy: boolean;
  q: string;
  setQ: (v: string) => void;
  onSend: (text: string) => void;
  onClose: () => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className={place} role="dialog" aria-label="Ask Mortgage Punk">
      <div className={p.popHead}>
        {/* The mockup's own lettering, lifted off the painted panel with its
            alpha intact, because the panel covers the painted one. */}
        <Image
          src="/brand/ask-headline.png"
          alt="What can I help you with?"
          width={1103}
          height={76}
          className={p.headline}
        />
        <button
          type="button"
          className={p.close}
          onClick={onClose}
          aria-label="Close the conversation"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className={p.list} ref={listRef}>
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? p.me : p.bot}>
            {m.content
              .split("\n")
              .filter(Boolean)
              .map((line, j) => (
                <p key={j}>{line}</p>
              ))}
          </div>
        ))}
        {busy && (
          <div className={p.bot}>
            <span className={p.dots}>
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
      </div>

      <div className={p.fieldRow}>
        <input
          ref={inputRef}
          className={p.field}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend(q)}
          placeholder={msgs.length ? "Ask another..." : "Ask me anything about mortgages..."}
          aria-label={msgs.length ? "Ask another question" : "Ask a question about mortgages"}
        />
        <button
          type="button"
          className={p.send}
          onClick={() => onSend(q)}
          disabled={busy || !q.trim()}
          aria-label="Send"
        >
          <Arrow />
        </button>
      </div>

      {/* The painted cards, rebuilt — in the artwork because the panel is
          standing on them, and in the dock because they are the two things
          the conversation is ultimately for. */}
      <div className={p.popCards}>
        <a href={APPLY_URL} {...EXTERNAL} className={p.cardRed}>
          <span className={p.cardMain}>Get Approved</span>
          <span className={p.cardSub}>Start your application. Fast. Simple. No BS.</span>
          <svg viewBox="0 0 24 24" className={p.cardIcon} aria-hidden="true">
            <path d="M3 12h16M13 5.8 19.2 12 13 18.2" />
          </svg>
        </a>
        <Link href="/book" className={p.cardWhite}>
          <span className={p.cardMain}>Schedule a call with Chris</span>
          <span className={p.cardSub}>Real conversation. Real answers.</span>
          <svg viewBox="0 0 24 24" className={p.cardIcon} aria-hidden="true">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
