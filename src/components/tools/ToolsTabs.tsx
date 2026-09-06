"use client";

// Client component: tab state, and it honours a #hash so the homepage cards
// can deep-link straight to the right calculator.

import { useState, useEffect } from "react";
import s from "../Site.module.css";
import { AffordabilityCalc, PaymentCalc, RefiCalc } from "./Calculators";

const TABS = [
  { id: "afford", label: "What can I afford", el: <AffordabilityCalc /> },
  { id: "payment", label: "Monthly payment", el: <PaymentCalc /> },
  { id: "refi", label: "Should I refinance", el: <RefiCalc /> },
];

export default function ToolsTabs() {
  const [active, setActive] = useState("afford");

  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (TABS.some((t) => t.id === h)) setActive(h);
  }, []);

  return (
    <>
      <div className={s.toolTabs} role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            className={`${s.toolTab} ${active === t.id ? s.toolTabOn : ""}`}
            onClick={() => {
              setActive(t.id);
              history.replaceState(null, "", `#${t.id}`);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {TABS.find((t) => t.id === active)?.el}
    </>
  );
}
