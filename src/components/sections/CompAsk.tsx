"use client";

import { useState } from "react";
import Link from "next/link";
import ChatStage from "@/components/chat/ChatStage";
import s from "./CompStage.module.css";
import { APPLY_URL, EXTERNAL } from "@/lib/links";

/**
 * Ask Mortgage Punk, as the approved mockup with a working input on top.
 *
 * THE THREE INTENT BUTTONS ARE GONE. Buy a New Home, Refinance and Access my
 * Equity are not in the comp and were dropped on purpose. Worth knowing what
 * that trades away: they existed because an empty box asks a visitor to think
 * of a question and a lot of people will not bother. If the ask rate drops
 * after this goes live, that is the first thing to look at.
 *
 * Typing and submitting opens the full conversation over the page, seeded
 * with the question, so the visitor never types the same sentence twice. The
 * big red button with nothing typed opens it empty.
 *
 * Everything visible here is painted into the image. The input, the send
 * square and the two cards are real elements positioned over their painted
 * counterparts — see CompStage.module.css for how the placement works and
 * what this shortcut costs.
 */
export default function CompAsk() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState("");

  function launch() {
    setSeed(q.trim());
    setOpen(true);
  }

  return (
    <>
      <section className={s.stage + " " + s.ask} aria-label="Ask Mortgage Punk">
        <h2 className={s.srOnly}>
          Ask Mortgage Punk. Chris trained this assistant to answer the
          mortgage questions you would normally ask him.
        </h2>

        <input
          className={s.field}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && launch()}
          placeholder="Ask me anything about mortgages..."
          aria-label="Ask a question about mortgages"
        />
        <button
          type="button"
          className={s.send}
          onClick={launch}
          aria-label="Send your question"
        />
        <button
          type="button"
          className={s.askBtn}
          onClick={launch}
          aria-label="Ask Mortgage Punk"
        />

        <a
          href={APPLY_URL}
          {...EXTERNAL}
          className={`${s.hot} ${s.askApprove}`}
          aria-label="Get approved. Start your application."
        />
        <Link
          href="/book"
          className={`${s.hot} ${s.askSchedule}`}
          aria-label="Schedule a call with Chris"
        />
      </section>

      <p className={s.disclosure}>
        Ask Mortgage Punk is an AI assistant, not a loan officer. General
        information only, not a rate quote, a pre-approval, or financial
        advice. Chris Waipa &middot; NMLS #339232.
      </p>

      {open && (
        <div className={s.scrimHost}>
          <ChatStage variant="overlay" seed={seed} onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
