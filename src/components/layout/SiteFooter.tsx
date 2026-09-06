import Image from "next/image";
import Link from "next/link";
import s from "../Site.module.css";

/**
 * Compliance note: NMLS 339232 is confirmed. The exact legal entity wording,
 * disclosure language and required marks are still pending Andrew Richels at
 * Neighborhood Loans. The TODO block below is deliberately visible so this
 * cannot be forgotten before go-live.
 */
const COLS = [
  {
    head: "Lending",
    links: [
      ["Buy a home", "/lending/buy"],
      ["Refinance", "/lending/refinance"],
      ["Investors", "/lending/investors"],
      ["Get approved", "/get-approved"],
      ["The team", "/team"],
      ["Tools & calculators", "/tools"],
    ],
  },
  {
    head: "The Movement",
    links: [
      ["The Game of Money", "/library"],
      ["The mission", "/movement"],
      ["American Dream Conference", "https://mortgagepunklive.com"],
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
      ["Client stories", "/testimonials"],
      ["Contact", "/contact"],
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
                <li key={href}>
                  {href.startsWith("http") ? (
                    <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
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
        <div className={s.todo}>
          TODO: exact legal entity wording, disclosure language and required
          marks pending Andrew Richels / Neighborhood Loans compliance.
        </div>
      </div>
    </footer>
  );
}
