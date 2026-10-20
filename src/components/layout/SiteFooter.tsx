import Image from "next/image";
import Link from "next/link";
import s from "../Site.module.css";
import { APPLY_URL, EXTERNAL } from "@/lib/links";

/**
 * Compliance note: NMLS 339232 is confirmed. The exact legal entity wording,
 * disclosure language and required marks are still pending Andrew Richels at
 * Neighborhood Loans. The TODO block below is deliberately visible so this
 * cannot be forgotten before go-live.
 *
 * THE LINKS WERE PARKED AT THE HOME PAGE AND ARE NOW RESTORED.
 *
 * They were pointed at "/" while the pages behind them were in varying states
 * of finish, on the reasoning that the footer is where people click when they
 * are already unsure. Every one of those pages now returns real content and
 * handles its own empty state in its own words — /merch says the store is
 * being built, /testimonials says stories are being collected — so a visitor
 * who clicks gets an answer rather than a bounce back to where they started.
 *
 * "Get approved" carries APPLY_URL, which has Chris's referrer ID on it and is
 * how a loan gets attributed to him. It is the one link here that must never
 * be changed casually.
 *
 * "Client stories" is deliberately off-site while the testimonials page has
 * nothing in it.
 */
const COLS = [
  {
    head: "Lending",
    links: [
      ["Buy a home", "/lending/buy"],
      ["Refinance", "/lending/refinance"],
      ["Investors", "/lending/investors"],
      ["Get approved", APPLY_URL],
      ["The team", "/team"],
      ["Tools & calculators", "/tools"],
    ],
  },
  {
    head: "The Movement",
    links: [
      ["The Game of Money", "/library"],
      ["The mission", "/movement"],
      ["American Dream Conference", "/movement"],
      ["Merch", "/merch"],
      ["Free guides", "/freebies"],
    ],
  },
  {
    head: "Chris",
    links: [
      ["About Chris", "/about"],
      ["Speaking", "/about#speaking"],
      ["Press", "/about#press"],
      /* Not parked and not /testimonials. Client stories live on Chris's
         national site for now, so this is the one footer link that leaves —
         see the external handling in the markup below. */
      ["Client stories", "https://chriswaipanational.com"],
      ["Book Chris", "/book"],
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className={s.ft}>
      <div className={s.ftgrid}>
        <div>
          <Image
            src="/brand/mortgagepunk-logo@3x.png"
            alt="Mortgage Punk"
            width={1209}
            height={825}
            className={s.logo}
          />
          <p className={s.blurb}>
            Reimagining the American Dream. A world-class lending team and a
            movement to change the Game of Money.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.head}>
            <h5>{c.head}</h5>
            <ul>
              {c.links.map(([label, href]) => (
                /* Keyed on the label, not the href. Every href is "/" while
                   the links are parked, and duplicate keys make React drop all
                   but one item from each column. */
                /* An off-site destination gets a real anchor with the external
                   props. next/link would render it, but without target and
                   rel it takes the visitor off Mortgage Punk in the same tab
                   and hands the destination a handle on this window. */
                <li key={label}>
                  {href.startsWith("http") ? (
                    <a href={href} {...EXTERNAL}>
                      {label}
                    </a>
                  ) : (
                    <Link href={href}>{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={s.legal}>
        <div className={s.marks}>
          <span>Equal Housing Opportunity</span>
          <span>NMLS Consumer Access</span>
        </div>
        Chris Waipa &middot; NMLS #339232. Mortgage Punk is a brand. Lending is
        conducted through Neighborhood Loans.
        <br />
        &copy; {new Date().getFullYear()} Mortgage Punk. Site by ProyTech.
      </div>
    </footer>
  );
}
