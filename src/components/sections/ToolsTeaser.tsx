import Link from "next/link";
import s from "../Site.module.css";

/**
 * Points at /tools from the homepage.
 *
 * This is the middle of the funnel — someone who won't fill in a form today
 * but will happily spend four minutes finding out what they can afford. That
 * is a warmer visitor than one who bounced, and the tools capture at the
 * moment the numbers land rather than at the top of a cold page.
 */
const TOOLS = [
  {
    href: "/tools#afford",
    title: "What can I afford?",
    body: "Income, debts and a down payment in. A real buying-power number out.",
    icon: <><path d="M3 20V10M9 20V4M15 20v-7M21 20v-11" /></>,
  },
  {
    href: "/tools#payment",
    title: "What's the payment?",
    body: "On a specific house, with taxes, insurance and PMI included instead of hidden.",
    icon: <><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" /><path d="M2.5 10h19" /></>,
  },
  {
    href: "/tools#refi",
    title: "Should I refinance?",
    body: "Your break-even in months, and a straight answer when the answer is no.",
    icon: <><path d="M3 12a9 9 0 0 1 15.5-6.2M21 12a9 9 0 0 1-15.5 6.2" /><path d="M18 3v4h-4M6 21v-4h4" /></>,
  },
  {
    href: "/freebies",
    title: "Free guides",
    body: "Checklists and walkthroughs you can keep. No gate on the useful ones.",
    icon: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5" /></>,
  },
];

export default function ToolsTeaser() {
  return (
    <section className={`${s.sec} ${s.ink}`} aria-label="Tools">
      <div className={s.wrap}>
        <div className={s.kick}>Run your own numbers</div>
        <h2 className={s.h2}>
          No form. No call.
          <em>Just the math.</em>
        </h2>
        <p className={s.lede}>
          Most lender calculators quietly leave out taxes, insurance and mortgage
          insurance, then hand you a number that&rsquo;s thousands off. These
          don&rsquo;t. Use them, screenshot them, and talk to us when you&rsquo;re ready.
        </p>

        <div className={s.ttGrid}>
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className={s.ttCard}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{t.icon}</svg>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
