import Image from "next/image";
import Link from "next/link";
import s from "../Site.module.css";
import { EXTERNAL } from "@/lib/links";

/**
 * Compliance note: NMLS 339232 is confirmed. The exact legal entity wording,
 * disclosure language and required marks are still pending Andrew Richels at
 * Neighborhood Loans. The TODO block below is deliberately visible so this
 * cannot be forgotten before go-live.
 *
 * EVERY LINK HERE POINTS AT THE HOME PAGE FOR NOW.
 *
 * The labels stay, so the footer still reads as a real site map and still
 * tells a visitor what the site covers. Only the destinations are parked,
 * because the pages behind them are in varying states of finish and the
 * footer is where people click when they are already unsure.
 *
 * Restoring one is editing its line in this list and nothing else — the
 * markup below takes whatever href it is given. The real paths are kept in
 * the trailing comment on each line so nobody has to go and find them again.
 *
 * ONE THING TO KNOW BEFORE RESTORING: "Get approved" normally carries
 * APPLY_URL, which has Chris's referrer ID on it and is how a loan gets
 * attributed to him. That link still exists in the top nav, in the hero, and
 * on the Ask section card, so parking the footer copy costs nothing today. If
 * any of those three ever move, put this one back first.
 */
const HOME = "/";

const COLS = [
  {
    head: "Lending",
    links: [
      ["Buy a home", HOME], // /lending/buy
      ["Refinance", HOME], // /lending/refinance
      ["Investors", HOME], // /lending/investors
      ["Get approved", HOME], // APPLY_URL from @/lib/links
      ["The team", HOME], // /team
      ["Tools & calculators", HOME], // /tools
    ],
  },
  {
    head: "The Movement",
    links: [
      ["The Game of Money", HOME], // /library
      ["The mission", HOME], // /movement
      ["American Dream Conference", HOME], // https://mortgagepunklive.com
      ["Merch", HOME], // /merch
      ["Free guides", HOME], // /freebies
    ],
  },
  {
    head: "Chris",
    links: [
      ["About Chris", HOME], // /about
      ["Speaking", HOME], // /about#speaking
      ["Press", HOME], // /about#press
      /* Not parked and not /testimonials. Client stories live on Chris's
         national site for now, so this is the one footer link that leaves —
         see the external handling in the markup below. */
      ["Client stories", "https://chriswaipanational.com"],
      ["Book Chris", HOME], // /book
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
