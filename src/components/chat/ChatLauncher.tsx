"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import ChatPaper from "./ChatPaper";
import { useChatThread, OPEN_CHAT, CHAT_CLAIMED } from "./useChatThread";
import p from "./ChatPaper.module.css";

/**
 * The floating button, bottom right, on every page.
 *
 * THIS REPLACED THE OLD DARK CHAT STAGE. That launcher opened a black
 * software widget on top of the page, so the same assistant answered in two
 * completely different designs depending on which button you pressed — which
 * is why it had to be suppressed on the home page, where the Ask section
 * already ran the conversation in the artwork. Now both open the same sheet
 * of paper, so the launcher can ride every page, which is what the client
 * asked for: something to click at all times.
 *
 * IT DEFERS TO THE ASK SECTION RATHER THAN COMPETING WITH IT. On the home
 * page the panel belongs inside the artwork, in the column the client drew.
 * AskPanel announces itself on mount; while it is there the launcher only
 * scrolls to it and tells it to open, and renders no panel of its own. Two
 * chat panels on one page, each with its own half of the conversation, is the
 * exact failure the old widget had.
 *
 * NOT IN BACKSTAGE. A customer-facing "ask a question" bubble floating over
 * the admin invites Chris to chat with his own assistant while editing his
 * own site, and it sits exactly where the save buttons are.
 */
export default function ChatLauncher() {
  const pathname = usePathname();
  const inBackstage = pathname?.startsWith("/backstage") ?? false;

  const chat = useChatThread();
  const [claimed, setClaimed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Re-ask on every navigation: the Ask section exists on the home page and
  // nowhere else, so the answer changes as you move around the site.
  useEffect(() => {
    setClaimed(false);
    const onClaim = () => setClaimed(true);
    window.addEventListener(CHAT_CLAIMED, onClaim);
    // One frame is enough for a mounted AskPanel to answer.
    const id = window.setTimeout(
      () => window.dispatchEvent(new CustomEvent("mp:who-owns-chat")),
      0
    );
    return () => {
      window.removeEventListener(CHAT_CLAIMED, onClaim);
      window.clearTimeout(id);
    };
  }, [pathname]);

  // The page behind must not scroll while the sheet is up on a phone.
  useEffect(() => {
    if (!chat.open || claimed) return;
    const narrow = window.matchMedia("(max-width:760px)").matches;
    if (!narrow) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [chat.open, claimed]);

  if (inBackstage) return null;

  function onClick() {
    if (claimed) {
      // The Ask section owns the panel here. Put it on screen, then open it.
      document.getElementById("ask")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.dispatchEvent(new CustomEvent(OPEN_CHAT));
      return;
    }
    chat.setOpen((v) => !v);
  }

  const showPanel = !claimed && chat.open;

  return (
    <>
      <button
        type="button"
        className={`${p.fab} ${showPanel ? p.fabOpen : ""}`}
        onClick={onClick}
        aria-label={showPanel ? "Close the conversation" : "Ask Mortgage Punk a question"}
        aria-expanded={showPanel}
      >
        {showPanel ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20.5l1.5-5.3A8.5 8.5 0 1 1 21 11.5z" />
            <path d="M8.5 11.5h7M8.5 15h4" />
          </svg>
        )}
      </button>
      <span className={p.fabLabel} aria-hidden="true">
        Ask Mortgage Punk
      </span>

      {mounted && showPanel &&
        createPortal(
          <>
            <button
              type="button"
              className={p.scrim}
              onClick={() => chat.setOpen(false)}
              aria-label="Close the conversation"
              tabIndex={-1}
            />
            <ChatPaper
              place={p.dock}
              msgs={chat.msgs}
              busy={chat.busy}
              q={chat.q}
              setQ={chat.setQ}
              onSend={chat.send}
              onClose={() => chat.setOpen(false)}
              listRef={chat.listRef}
              inputRef={chat.inputRef}
            />
          </>,
          document.body
        )}
    </>
  );
}
