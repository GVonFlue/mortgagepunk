"use client";

import AskPanel from "./AskPanel";
import CallBooking from "@/components/ui/CallBooking";
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
      {/* Phone only. The comp is a wide two-column collage; on a narrow screen
          its left half stacks above the right instead of shrinking to a band.
          Purely the artwork — every live control is in the half below. See the
          phone Ask block in CompStage.module.css. */}
      <div className={s.askPaneA} aria-hidden="true" />

      <section className={s.stage + " " + s.ask} aria-label="Ask Mortgage Punk">
        <h2 className={s.srOnly}>
          Ask Mortgage Punk. Chris trained this assistant to answer the
          mortgage questions you would normally ask him.
        </h2>

        <AskPanel />

        {/* Each span carries the hover highlight, masked to its card's own
            silhouette. It has to be a child: a mask on the anchor would clip
            the focus ring as well. See CompStage.module.css. */}
        <a
          href={APPLY_URL}
          {...EXTERNAL}
          className={`${s.hot} ${s.askApprove}`}
          aria-label="Get approved. Start your application."
        >
          <span className={s.lift} aria-hidden="true" />
        </a>
        {/* NOT /book. That is the speaking desk — keynotes, podcasts, press —
            and this card says "Real conversation. Real answers." to somebody
            thinking about their mortgage. It opens the call request instead.
            The hotspot renders no text of its own, so the trigger's contents
            are passed as children; see CallBooking. */}
        <CallBooking className={`${s.hot} ${s.askSchedule}`}>
          <span className={s.lift} aria-hidden="true" />
        </CallBooking>
      </section>

      <p className={s.disclosure}>
        Ask Mortgage Punk is an AI assistant, not a loan officer. General
        information only, not a rate quote, a pre-approval, or financial
        advice. Chris Waipa &middot; NMLS #339232.
      </p>

    </>
  );
}
