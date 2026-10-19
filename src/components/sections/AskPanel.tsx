"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ChatPaper, { Arrow } from "@/components/chat/ChatPaper";
import { useChatThread, OPEN_CHAT, CHAT_CLAIMED } from "@/components/chat/useChatThread";
import p from "@/components/chat/ChatPaper.module.css";

/**
 * The Ask section's half of the conversation: the field painted into the
 * artwork, and the panel it opens in place.
 *
 * THE PANEL ITSELF LIVES IN ChatPaper, shared with the floating launcher, so
 * the assistant looks the same wherever you meet it. All this component owns
 * is the resting field — the one part that is specific to sitting inside the
 * collage — and the decision to open in the artwork rather than the corner.
 *
 * IT CLAIMS THE CONVERSATION. The launcher rides every page; on this one the
 * panel belongs in the artwork instead of the corner, so this announces
 * itself and the launcher stands down to scrolling here and opening it. Two
 * panels on one page, each holding half the thread, is the failure the old
 * dark widget had and the reason it was suppressed on the home page at all.
 */
export default function AskPanel() {
  const chat = useChatThread();
  const [narrow, setNarrow] = useState(false);

  /* Narrow screens move the panel out of the artwork and onto the page — see
     the media query, and the portal below for why it also has to leave this
     subtree. Starts false and is set on the client; the panel only ever
     renders after a click, so there is nothing to get wrong during hydration. */
  useEffect(() => {
    const mq = window.matchMedia("(max-width:760px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Answer the launcher, both when it asks on navigation and when it is
  // pressed. The handshake is two custom events so neither component needs a
  // reference to the other.
  useEffect(() => {
    const claim = () => window.dispatchEvent(new CustomEvent(CHAT_CLAIMED));
    const open = () => chat.setOpen(true);
    claim();
    window.addEventListener("mp:who-owns-chat", claim);
    window.addEventListener(OPEN_CHAT, open);
    return () => {
      window.removeEventListener("mp:who-owns-chat", claim);
      window.removeEventListener(OPEN_CHAT, open);
    };
  }, [chat]);

  // On a phone the panel covers the page behind a scrim, so the page must not
  // scroll underneath it.
  useEffect(() => {
    if (!chat.open || !narrow) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [chat.open, narrow]);

  /* ---------- resting: the field drawn over the painted one ---------- */
  if (!chat.open) {
    return (
      <>
        {/* PHONES GET A TAP TARGET, NOT A TEXT FIELD. The artwork does not
            reflow, so at 390px the live field below is about 155x20px — the
            placeholder clips and the send button lands on top of the text.
            Nobody types in that. Here the painted field is left showing and
            this covers it, so a tap opens the sheet where there is a properly
            sized input. Which one is live is decided in CSS rather than from
            the `narrow` state, so there is no first-paint swap. */}
        <button
          type="button"
          className={p.fieldTap}
          onClick={() => chat.setOpen(true)}
          aria-label="Ask a question about mortgages"
        />

        <div className={p.fieldBox}>
          <input
            className={p.field}
            value={chat.q}
            onChange={(e) => chat.setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && chat.send(chat.q)}
            placeholder="Ask me anything about mortgages..."
            aria-label="Ask a question about mortgages"
          />
          <button
            type="button"
            className={p.send}
            onClick={() => chat.send(chat.q)}
            aria-label="Send your question"
          >
            <Arrow />
          </button>
        </div>
      </>
    );
  }

  /* ---------- active: the panel, in the artwork ---------- */
  const panel = (
    <>
      {/* Phone only — see the media query. On a laptop the panel sits inside
          the artwork and the rest of the page stays usable behind it. */}
      <button
        type="button"
        className={p.scrim}
        onClick={() => chat.setOpen(false)}
        aria-label="Close the conversation"
        tabIndex={-1}
      />
      <ChatPaper
        place={p.pop}
        msgs={chat.msgs}
        busy={chat.busy}
        q={chat.q}
        setQ={chat.setQ}
        onSend={chat.send}
        onClose={() => chat.setOpen(false)}
        listRef={chat.listRef}
        inputRef={chat.inputRef}
      />
    </>
  );

  /* ON A PHONE THE PANEL HAS TO LEAVE THIS SUBTREE. The section it lives in
     is `position:relative;z-index:1`, which makes it a stacking context — so
     a fixed, z-index:111 panel inside it is still clamped to that one layer,
     and the Game of Money section further down the page painted straight over
     its lower half. z-index cannot win an argument it is not party to; the
     only fix is to render outside the context, which is what the portal does.
     On a laptop the panel is positioned in percentages of the artwork, so
     there it stays exactly where it is. */
  return narrow ? createPortal(panel, document.body) : panel;
}
