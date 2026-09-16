"use client";

// Client component: IntersectionObserver drives which step is active.

import { useEffect, useRef, useState } from "react";
import s from "../Site.module.css";

/**
 * THE PROCESS — a scroll-driven walkthrough of getting a mortgage.
 *
 * Written in Chris's frame, not the industry's. Every step names where the
 * process normally goes wrong ("where this usually sucks") and then what the
 * team does about it, because "the mortgage process is what sucks" is the
 * whole origin of the brand. A generic 6-step timeline would say nothing that
 * every other lender's site already says.
 *
 * Mechanics: a sticky panel holds the current step at poster scale while the
 * detail scrolls past. IntersectionObserver sets the active index — no scroll
 * maths and nothing that fights the browser. With JS off or reduced-motion on,
 * every card is simply present and readable.
 */

type Step = {
  no: string;
  title: string;
  when: string;
  body: string;
  suck: string;
  does: string[];
};

const STEPS: Step[] = [
  {
    no: "01",
    title: "Get the real number",
    when: "Day one",
    body:
      "Before you look at a single listing, you find out what you can actually borrow — and just as importantly, what you should. A pre-approval is a bank-backed budget, not a guess off a calculator.",
    suck:
      "Most people get a soft pre-qual that means nothing, then find out what's real after they've fallen in love with a house.",
    does: [
      "A full pre-approval, underwritten up front",
      "A straight answer on what would change it",
      "The monthly payment, all in, not just principal and interest",
    ],
  },
  {
    no: "02",
    title: "Go shopping for real",
    when: "Weeks 1–8",
    body:
      "Now you look, with a pre-approval that holds up when you make an offer. Sellers can tell the difference between a real approval and a printout, and so can their agent.",
    suck:
      "Weak pre-approvals lose bidding wars to buyers who did the work up front. You never find out why you didn't get the house.",
    does: [
      "A pre-approval letter that stands up to scrutiny",
      "We talk to the listing agent if it helps your offer",
      "Payment scenarios on any specific house, same day",
    ],
  },
  {
    no: "03",
    title: "Offer accepted. Lock it in",
    when: "Day of contract",
    body:
      "Your offer lands. Now the rate gets locked, the file opens for real, and the clock starts on every date in your contract.",
    suck:
      "This is where files go quiet. People sign a contract and hear nothing for two weeks while a deadline they didn't know about creeps up.",
    does: [
      "Rate locked and confirmed in writing",
      "Every contract date mapped out so nothing sneaks up",
      "One number to text when you have a question",
    ],
  },
  {
    no: "04",
    title: "The paperwork gauntlet",
    when: "Weeks 2–4",
    body:
      "Underwriting. This is the part everyone complains about, and honestly the part that most deserves it. It's also the part a good team makes almost invisible.",
    suck:
      "The dreaded drip-feed of document requests. One email asking for a bank statement, then another three days later asking for the next page of the same statement.",
    does: [
      "We ask for everything we need at once, up front",
      "Conditions worked the day they come in, not the week after",
      "You hear from us before you have to ask",
    ],
  },
  {
    no: "05",
    title: "Clear to close",
    when: "Days before closing",
    body:
      "Underwriting signs off. The file is done, the numbers are final, and the closing disclosure goes out so you can see every dollar before you sit down at the table.",
    suck:
      "Numbers that move at the last minute. Nobody should learn what they owe on the morning they're supposed to bring it.",
    does: [
      "Final numbers reviewed with you, not emailed at you",
      "Wire instructions verified so you don't get scammed",
      "Anything that changed is explained before you sign",
    ],
  },
  {
    no: "06",
    title: "Keys in your hand",
    when: "Closing day",
    body:
      "You sign, it funds, and the house is yours. That mortgage is now the tool doing the work — the asset builds while you live in it.",
    suck:
      "Most lenders disappear the second it funds. The relationship ends exactly when the questions start.",
    does: [
      "We check in when rates move, not when we need something",
      "Annual review of whether your loan still makes sense",
      "Same number to text. Forever.",
    ],
  },
];

export default function ProcessScroll() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick whichever step is most centred in the viewport
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const i = nodes.indexOf(best.target as HTMLDivElement);
        if (i >= 0) setActive(i);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const step = STEPS[active];
  const pct = ((active + 1) / STEPS.length) * 100;

  return (
    <section className={s.proc} aria-label="How the mortgage process works">
      <div className={s.procWrap}>
        <div className={s.procHead}>
          <div className={s.kick}>The Process</div>
          <h2 className={s.h2}>
            Six steps.
            <br />
            <em>No surprises.</em>
          </h2>
          <p className={s.lede}>
            Here is the whole thing, start to finish, including the parts that
            normally go wrong. Scroll it.
          </p>
        </div>

        <div className={s.procGrid}>
          {/* sticky: where you are */}
          <div className={s.procSticky}>
            <span className={s.procNum}>{step.no}</span>
            <span className={s.procNowTitle}>{step.title}</span>

            <div className={s.procRail} aria-hidden="true">
              <span className={s.procRailFill} style={{ width: `${pct}%` }} />
            </div>
            <div className={s.procCount}>
              Step {active + 1} of {STEPS.length}
            </div>

            <div className={s.procDots}>
              {STEPS.map((st, i) => (
                <button
                  key={st.no}
                  type="button"
                  className={`${s.procDot} ${i === active ? s.procDotOn : ""}`}
                  aria-label={`Jump to step ${st.no}: ${st.title}`}
                  onClick={() =>
                    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }
                >
                  {st.no}
                </button>
              ))}
            </div>
          </div>

          {/* scrolling: the detail */}
          <div className={s.procSteps}>
            {STEPS.map((st, i) => (
              <div
                key={st.no}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={`${s.procStep} ${i === active ? s.procStepOn : ""}`}
              >
                <div className={s.procStepTop}>
                  <span className={s.procStepNo}>{st.no}</span>
                  <h3 className={s.procStepTitle}>{st.title}</h3>
                  <span className={s.procWhen}>{st.when}</span>
                </div>

                <p className={s.procBody}>{st.body}</p>

                <div className={s.procSuck}>
                  <div>
                    <span className={s.procSuckLabel}>Where this usually sucks</span>
                    <p>{st.suck}</p>
                  </div>
                </div>

                <ul className={s.procDo}>
                  {st.does.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
