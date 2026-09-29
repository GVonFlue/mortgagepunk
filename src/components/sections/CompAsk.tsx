"use client";

import Link from "next/link";
import AskPanel from "./AskPanel";
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
 * THE CONVERSATION HAPPENS IN THE PAPER, NOT OVER IT. Submitting used to
 * open the old dark chat panel on top of the page, which threw the design
 * away the second anyone used it. AskPanel owns both states now: the field
 * sitting in the artwork, and the paper panel that covers the right-hand
 * column once a question is asked.
 *
 * Everything visible here is painted into the image. The input, the send
 * square and the two cards are real elements positioned over their painted
 * counterparts — see CompStage.module.css for how the placement works and
 * what this shortcut costs.
 */
export default function CompAsk() {
  return (
    <>
      <section className={s.stage + " " + s.ask} aria-label="Ask Mortgage Punk">
        <h2 className={s.srOnly}>
          Ask Mortgage Punk. Chris trained this assistant to answer the
          mortgage questions you would normally ask him.
        </h2>

        <AskPanel applyHref={APPLY_URL} scheduleHref="/book" />

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

    </>
  );
}
