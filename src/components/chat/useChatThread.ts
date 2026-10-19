"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * One conversation with the assistant: the messages, the in-flight state, and
 * the plumbing every surface that shows it needs.
 *
 * WHY THIS IS A HOOK AND NOT A CONTEXT. There is never more than one chat
 * panel on screen: the home page shows it inside the artwork, every other page
 * shows it docked in the corner, and the launcher defers to the Ask section
 * when one is present. A provider would be ceremony around a thing that is
 * already single by construction — see ChatLauncher for how that is enforced.
 */

export type Msg = { role: "user" | "assistant"; content: string };

export function useChatThread() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pin to the newest message. scrollTop on the list rather than
  // scrollIntoView: the latter walks up the tree and drags the whole page,
  // which would yank the reader away from wherever they were mid-answer.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy, open]);

  // preventScroll is load-bearing. The field sits near the foot of the panel,
  // and a plain focus() makes the browser scroll the page to reveal it —
  // which on the home page dragged the in-artwork panel 70px off the top of
  // the window immediately after the launcher had just scrolled it into
  // place. The panel is positioned deliberately; focus must not move it.
  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Escape closes. On a phone the panel covers the page behind a scrim, so
  // without this there is a state with no visible way back on a keyboard.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
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
          {
            role: "assistant",
            content: j.reply || "I didn't catch that. Try another way?",
          },
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
    },
    [busy, msgs]
  );

  return { open, setOpen, q, setQ, busy, msgs, send, listRef, inputRef };
}

/**
 * The home page's Ask section owns the panel when it is mounted, so the
 * launcher has to hand off to it rather than opening a second one. These two
 * are that handoff: one custom event, so neither component has to know the
 * other exists.
 */
export const OPEN_CHAT = "mp:open-chat";
export const CHAT_CLAIMED = "mp:chat-claimed";
