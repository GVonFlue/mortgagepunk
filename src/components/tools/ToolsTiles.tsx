"use client";

// Client component: which tile is open, and the deep-link hash.

import { useState, useEffect } from "react";
import Link from "next/link";
import s from "../Site.module.css";
import { AffordabilityCalc, PaymentCalc, RefiCalc } from "./Calculators";
import { APPLY_URL, EXTERNAL } from "@/lib/links";

/**
 * Tiles first, tool second.
 *
 * The previous version put all three calculators on the page behind a tab
 * strip, which meant arriving at a wall of input fields before knowing what
 * any of them were for. Choosing is its own step now: four tiles, each saying
 * plainly what question it answers, and the tool only appears once you've
 * picked one.
 *
 * Graphics are inline SVG rather than photographs — these are diagrams of an
 * idea, and a diagram scales, recolours, and weighs nothing.
 */

type Tool = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  art: React.ReactNode;
  el?: React.ReactNode;
  href?: string;
};

/* --- tile artwork. One idea each, drawn in the brand red. --- */
const ArtAfford = (
  <svg viewBox="0 0 200 120" aria-hidden="true">
    <rect x="14" y="74" width="26" height="34" rx="3" />
    <rect x="50" y="56" width="26" height="52" rx="3" />
    <rect x="86" y="34" width="26" height="74" rx="3" className="fillRed" />
    <rect x="122" y="52" width="26" height="56" rx="3" />
    <rect x="158" y="66" width="26" height="42" rx="3" />
    <path d="M14 30 L60 30" className="rule" />
    <circle cx="99" cy="20" r="9" className="fillRed" />
    <path d="M99 15v10M95.5 18.5h7M95.5 22h7" className="knock" />
  </svg>
);

const ArtPayment = (
  <svg viewBox="0 0 200 120" aria-hidden="true">
    <rect x="24" y="26" width="152" height="70" rx="8" />
    <path d="M24 48h152" />
    <rect x="40" y="62" width="44" height="8" rx="4" className="fillRed" />
    <rect x="40" y="76" width="26" height="6" rx="3" />
    <circle cx="150" cy="74" r="12" className="fillRed" />
    <circle cx="134" cy="74" r="12" opacity=".45" />
  </svg>
);

const ArtRefi = (
  <svg viewBox="0 0 200 120" aria-hidden="true">
    <path d="M40 60a40 40 0 0 1 68-28" />
    <path d="M160 60a40 40 0 0 1-68 28" />
    <path d="M108 18v16h-16" className="fillRed" />
    <path d="M92 102V86h16" className="fillRed" />
    <path d="M70 60h60" className="rule" />
  </svg>
);

const ArtGuides = (
  <svg viewBox="0 0 200 120" aria-hidden="true">
    <path d="M34 24h58a14 14 0 0 1 14 14v58H48a14 14 0 0 1-14-14z" />
    <path d="M106 38a14 14 0 0 1 14-14h46v58a14 14 0 0 1-14 14h-46z" className="fillRed" />
    <path d="M52 46h34M52 60h26" className="rule" />
    <path d="M124 46h30M124 60h22" className="knock" />
  </svg>
);

const TOOLS: Tool[] = [
  {
    id: "afford",
    eyebrow: "Before you look",
    title: "What can I afford?",
    body: "Income, debts and a down payment in. A real buying-power number out, with taxes and insurance counted.",
    cta: "Run the numbers",
    art: ArtAfford,
    el: <AffordabilityCalc />,
  },
  {
    id: "payment",
    eyebrow: "On a specific house",
    title: "What's the payment?",
    body: "The whole payment, not just principal and interest. Taxes, insurance and mortgage insurance included instead of hidden.",
    cta: "Work it out",
    art: ArtPayment,
    el: <PaymentCalc />,
  },
  {
    id: "refi",
    eyebrow: "Already own",
    title: "Should I refinance?",
    body: "Your break-even in months, and a straight answer on the times the answer is no.",
    cta: "Check the math",
    art: ArtRefi,
    el: <RefiCalc />,
  },
  {
    id: "guides",
    eyebrow: "Take it with you",
    title: "Free guides",
    body: "Checklists and walkthroughs you can keep. No email required on the ones that are genuinely useful.",
    cta: "Browse the guides",
    art: ArtGuides,
    href: "/freebies",
  },
];

export default function ToolsTiles() {
  const [open, setOpen] = useState<string | null>(null);

  // deep links from the homepage cards land straight on a tool
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (TOOLS.some((t) => t.id === h && t.el)) setOpen(h);
  }, []);

  function pick(id: string) {
    setOpen(id);
    history.replaceState(null, "", `#${id}`);
    // the tool renders above where the tile was, so bring it into view
    requestAnimationFrame(() =>
      document.getElementById("tool-open")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    );
  }

  function close() {
    setOpen(null);
    history.replaceState(null, "", window.location.pathname);
  }

  const active = TOOLS.find((t) => t.id === open);

  if (active?.el) {
    return (
      <div id="tool-open">
        <div className={s.toolBar}>
          <button type="button" className={s.toolBack} onClick={close}>
            <span aria-hidden="true">&larr;</span> All tools
          </button>
          <div>
            <span className={s.toolBarEyebrow}>{active.eyebrow}</span>
            <h3 className={s.toolBarTitle}>{active.title}</h3>
          </div>
        </div>
        {active.el}
        <div className={s.toolFoot}>
          <p>
            An estimate, not a pre-approval. Underwriting looks at credit,
            reserves and job history — which is how people often qualify for
            more than a calculator says.
          </p>
          <a href={APPLY_URL} {...EXTERNAL} className={`${s.btn} ${s.btnSolid}`}>
            Get the real number &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={s.tiles}>
      {TOOLS.map((t) =>
        t.href ? (
          <Link key={t.id} href={t.href} className={s.tile}>
            <span className={s.tileArt}>{t.art}</span>
            <span className={s.tileEyebrow}>{t.eyebrow}</span>
            <h3>{t.title}</h3>
            <p>{t.body}</p>
            <span className={s.tileGo}>
              {t.cta} <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        ) : (
          <button key={t.id} type="button" className={s.tile} onClick={() => pick(t.id)}>
            <span className={s.tileArt}>{t.art}</span>
            <span className={s.tileEyebrow}>{t.eyebrow}</span>
            <h3>{t.title}</h3>
            <p>{t.body}</p>
            <span className={s.tileGo}>
              {t.cta} <span aria-hidden="true">&rarr;</span>
            </span>
          </button>
        )
      )}
    </div>
  );
}
