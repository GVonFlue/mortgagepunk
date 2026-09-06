"use client";

// Client component: live calculation as the sliders and fields move.

import { useState, useMemo } from "react";
import s from "../Site.module.css";

/**
 * The calculators.
 *
 * Two rules govern everything here.
 *
 * 1. NEVER present a rate as a quote. Rate is an input the visitor sets, and
 *    every result is labelled an estimate. A mortgage site that appears to
 *    advertise a rate triggers Regulation Z advertising rules, and this page
 *    has not been through compliance.
 * 2. Be honest about what's excluded. Most lender calculators quietly omit
 *    taxes, insurance and PMI and produce a number that is 30% too low. These
 *    include them and show the breakdown, because "the process is what sucks"
 *    means not lying to people with arithmetic.
 */

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** Standard amortised payment. */
function pAndI(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

function NumField({
  label, value, onChange, prefix, suffix, step = 1, help,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  help?: string;
}) {
  return (
    <label className={s.calcField}>
      <span className={s.calcLabel}>{label}</span>
      <span className={s.calcInputWrap}>
        {prefix && <span className={s.calcAffix}>{prefix}</span>}
        <input
          type="number"
          className={s.calcInput}
          value={Number.isFinite(value) ? value : ""}
          step={step}
          min={0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
        {suffix && <span className={s.calcAffix}>{suffix}</span>}
      </span>
      {help && <span className={s.calcHelp}>{help}</span>}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* 1. What can I afford                                                */
/* ------------------------------------------------------------------ */
export function AffordabilityCalc() {
  const [income, setIncome] = useState(85000);
  const [debts, setDebts] = useState(450);
  const [down, setDown] = useState(20000);
  const [rate, setRate] = useState(6.5);
  const [taxRate, setTaxRate] = useState(1.2);
  const [insurance, setInsurance] = useState(1600);

  const r = useMemo(() => {
    const monthlyIncome = income / 12;

    // 43% back-end DTI is the common conventional ceiling. Real underwriting
    // flexes with credit, reserves and program — hence "estimate", loudly.
    const maxTotal = monthlyIncome * 0.43 - debts;
    if (maxTotal <= 0) return null;

    // Solve for price: monthly housing = P&I + taxes + insurance + PMI.
    // Taxes and insurance scale with price, so iterate rather than guess.
    let price = 250000;
    for (let i = 0; i < 40; i++) {
      const loan = Math.max(price - down, 0);
      const ltv = price > 0 ? loan / price : 0;
      const pmi = ltv > 0.8 ? (loan * 0.006) / 12 : 0;
      const monthlyTax = (price * (taxRate / 100)) / 12;
      const monthlyIns = insurance / 12;
      const budgetForPI = maxTotal - monthlyTax - monthlyIns - pmi;
      if (budgetForPI <= 0) { price = price * 0.9; continue; }

      const mr = rate / 100 / 12;
      const n = 360;
      const supportedLoan =
        mr === 0 ? budgetForPI * n : (budgetForPI * (1 - Math.pow(1 + mr, -n))) / mr;
      const nextPrice = supportedLoan + down;
      if (Math.abs(nextPrice - price) < 250) { price = nextPrice; break; }
      price = (price + nextPrice) / 2;
    }

    const loan = Math.max(price - down, 0);
    const ltv = price > 0 ? loan / price : 0;
    const pmi = ltv > 0.8 ? (loan * 0.006) / 12 : 0;
    const pi = pAndI(loan, rate, 30);
    const tax = (price * (taxRate / 100)) / 12;
    const ins = insurance / 12;

    return {
      price, loan, pi, tax, ins, pmi,
      total: pi + tax + ins + pmi,
      dti: ((pi + tax + ins + pmi + debts) / monthlyIncome) * 100,
      pmiApplies: ltv > 0.8,
    };
  }, [income, debts, down, rate, taxRate, insurance]);

  return (
    <div className={s.calc}>
      <div className={s.calcInputs}>
        <NumField label="Household income (yearly)" value={income} onChange={setIncome}
          prefix="$" step={1000} />
        <NumField label="Monthly debt payments" value={debts} onChange={setDebts}
          prefix="$" step={25}
          help="Car loans, student loans, minimum card payments. Not rent or utilities." />
        <NumField label="Down payment" value={down} onChange={setDown} prefix="$" step={1000} />
        <NumField label="Interest rate" value={rate} onChange={setRate} suffix="%" step={0.125}
          help="Set this to whatever you've been quoted. We're not advertising a rate." />
        <NumField label="Property tax rate" value={taxRate} onChange={setTaxRate}
          suffix="%" step={0.05} help="Kansas averages roughly 1.2–1.4%." />
        <NumField label="Home insurance (yearly)" value={insurance} onChange={setInsurance}
          prefix="$" step={100} />
      </div>

      <div className={s.calcOut}>
        {!r ? (
          <p className={s.calcNote}>
            Your existing monthly debts use up the whole budget at this income.
            That&rsquo;s worth a conversation rather than a calculator.
          </p>
        ) : (
          <>
            <span className={s.calcOutLabel}>Estimated buying power</span>
            <span className={s.calcBig}>{money(r.price)}</span>
            <span className={s.calcSub}>
              about {money(r.total)}/mo all in, {money(r.loan)} borrowed
            </span>

            <dl className={s.calcBreak}>
              <div><dt>Principal &amp; interest</dt><dd>{money(r.pi)}</dd></div>
              <div><dt>Property taxes</dt><dd>{money(r.tax)}</dd></div>
              <div><dt>Insurance</dt><dd>{money(r.ins)}</dd></div>
              {r.pmiApplies && <div><dt>Mortgage insurance</dt><dd>{money(r.pmi)}</dd></div>}
              <div className={s.calcTotal}><dt>Total monthly</dt><dd>{money(r.total)}</dd></div>
            </dl>

            <p className={s.calcNote}>
              An estimate, not a pre-approval. Real underwriting looks at credit,
              reserves, job history and the specific program — which is how
              people often qualify for more than a calculator says.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. What's the payment on a specific house                           */
/* ------------------------------------------------------------------ */
export function PaymentCalc() {
  const [price, setPrice] = useState(300000);
  const [downPct, setDownPct] = useState(10);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.2);
  const [insurance, setInsurance] = useState(1600);
  const [hoa, setHoa] = useState(0);

  const r = useMemo(() => {
    const down = price * (downPct / 100);
    const loan = Math.max(price - down, 0);
    const ltv = price > 0 ? loan / price : 0;
    const pi = pAndI(loan, rate, years);
    const tax = (price * (taxRate / 100)) / 12;
    const ins = insurance / 12;
    const pmi = ltv > 0.8 ? (loan * 0.006) / 12 : 0;
    const total = pi + tax + ins + pmi + hoa;
    const totalInterest = pi * years * 12 - loan;
    return { down, loan, pi, tax, ins, pmi, total, totalInterest, pmiApplies: ltv > 0.8 };
  }, [price, downPct, rate, years, taxRate, insurance, hoa]);

  return (
    <div className={s.calc}>
      <div className={s.calcInputs}>
        <NumField label="Home price" value={price} onChange={setPrice} prefix="$" step={5000} />
        <NumField label="Down payment" value={downPct} onChange={setDownPct} suffix="%" step={1}
          help={`${money(r.down)} at this price`} />
        <NumField label="Interest rate" value={rate} onChange={setRate} suffix="%" step={0.125} />
        <NumField label="Loan term" value={years} onChange={setYears} suffix="yrs" step={5} />
        <NumField label="Property tax rate" value={taxRate} onChange={setTaxRate}
          suffix="%" step={0.05} />
        <NumField label="Home insurance (yearly)" value={insurance} onChange={setInsurance}
          prefix="$" step={100} />
        <NumField label="HOA (monthly)" value={hoa} onChange={setHoa} prefix="$" step={25} />
      </div>

      <div className={s.calcOut}>
        <span className={s.calcOutLabel}>Estimated monthly payment</span>
        <span className={s.calcBig}>{money(r.total)}</span>
        <span className={s.calcSub}>
          {money(r.loan)} borrowed over {years} years
        </span>

        <dl className={s.calcBreak}>
          <div><dt>Principal &amp; interest</dt><dd>{money(r.pi)}</dd></div>
          <div><dt>Property taxes</dt><dd>{money(r.tax)}</dd></div>
          <div><dt>Insurance</dt><dd>{money(r.ins)}</dd></div>
          {r.pmiApplies && <div><dt>Mortgage insurance</dt><dd>{money(r.pmi)}</dd></div>}
          {hoa > 0 && <div><dt>HOA</dt><dd>{money(hoa)}</dd></div>}
          <div className={s.calcTotal}><dt>Total monthly</dt><dd>{money(r.total)}</dd></div>
        </dl>

        <p className={s.calcNote}>
          Interest over the full term: <strong>{money(r.totalInterest)}</strong>.
          {r.pmiApplies && " Mortgage insurance drops off once you reach 20% equity."}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Should I refinance                                               */
/* ------------------------------------------------------------------ */
export function RefiCalc() {
  const [balance, setBalance] = useState(240000);
  const [currentRate, setCurrentRate] = useState(7.25);
  const [yearsLeft, setYearsLeft] = useState(27);
  const [newRate, setNewRate] = useState(6.25);
  const [newYears, setNewYears] = useState(30);
  const [costs, setCosts] = useState(4500);

  const r = useMemo(() => {
    const now = pAndI(balance, currentRate, yearsLeft);
    const then = pAndI(balance + costs, newRate, newYears);
    const saved = now - then;
    const breakEven = saved > 0 ? costs / saved : Infinity;
    const interestNow = now * yearsLeft * 12 - balance;
    const interestThen = then * newYears * 12 - (balance + costs);
    return { now, then, saved, breakEven, interestNow, interestThen };
  }, [balance, currentRate, yearsLeft, newRate, newYears, costs]);

  const worth = r.saved > 0 && r.breakEven <= 48;

  return (
    <div className={s.calc}>
      <div className={s.calcInputs}>
        <NumField label="Current balance" value={balance} onChange={setBalance}
          prefix="$" step={5000} />
        <NumField label="Current rate" value={currentRate} onChange={setCurrentRate}
          suffix="%" step={0.125} />
        <NumField label="Years left" value={yearsLeft} onChange={setYearsLeft}
          suffix="yrs" step={1} />
        <NumField label="New rate" value={newRate} onChange={setNewRate}
          suffix="%" step={0.125} help="Whatever you've been quoted." />
        <NumField label="New term" value={newYears} onChange={setNewYears}
          suffix="yrs" step={5} />
        <NumField label="Closing costs" value={costs} onChange={setCosts}
          prefix="$" step={500} help="Rolled into the new loan in this estimate." />
      </div>

      <div className={s.calcOut}>
        <span className={s.calcOutLabel}>
          {r.saved > 0 ? "You'd save each month" : "You'd pay more each month"}
        </span>
        <span className={s.calcBig}>{money(Math.abs(r.saved))}</span>
        <span className={s.calcSub}>
          {money(r.now)} now vs {money(r.then)} after
        </span>

        <dl className={s.calcBreak}>
          <div><dt>Break-even</dt>
            <dd>{Number.isFinite(r.breakEven) ? `${Math.ceil(r.breakEven)} months` : "never"}</dd></div>
          <div><dt>Interest left on current loan</dt><dd>{money(r.interestNow)}</dd></div>
          <div><dt>Interest on the new loan</dt><dd>{money(r.interestThen)}</dd></div>
          <div className={s.calcTotal}>
            <dt>Lifetime difference</dt>
            <dd>{money(Math.abs(r.interestNow - r.interestThen))}
              {r.interestThen < r.interestNow ? " saved" : " more"}</dd>
          </div>
        </dl>

        <p className={`${s.calcNote} ${worth ? s.calcGood : s.calcWarn}`}>
          {worth ? (
            <>
              This clears its costs in about {Math.ceil(r.breakEven)} months. If you
              plan to stay past that, it&rsquo;s likely worth doing.
            </>
          ) : r.saved <= 0 ? (
            <>
              This costs you more every month. Unless you&rsquo;re doing it to pull
              cash out or drop mortgage insurance, don&rsquo;t.
            </>
          ) : (
            <>
              Break-even is {Math.ceil(r.breakEven)} months out. That&rsquo;s a long
              runway — only worth it if you&rsquo;re certain you&rsquo;re staying put.
            </>
          )}
          {r.interestThen > r.interestNow && r.saved > 0 && (
            <>
              {" "}Note the lifetime figure: a lower payment over a longer term can
              still cost more in total. That trade-off is worth making on purpose.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
