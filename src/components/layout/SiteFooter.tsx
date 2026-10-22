import Image from "next/image";
import Link from "next/link";
import s from "../Site.module.css";
import CallBooking from "@/components/ui/CallBooking";
import { APPLY_URL, CALENDLY_PREAPPROVAL_URL, EXTERNAL } from "@/lib/links";

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
/** Chris's own national site, standing in for pages not built out yet. */
const NATIONAL = "https://chriswaipanational.com";

/**
 * A footer entry is a page link, an off-site link, or the booking modal.
 *
 * WHY THE THREE LENDING LINKS OPEN THE CALENDAR RATHER THAN A PAGE. The brief
 * was that Buy a home, Refinance and Investors should "lead to the contact
 * page for Chris". The literal reading is /contact — but /contact was retired
 * and 308s to /book, and /book is the speaking desk: keynotes, podcasts,
 * press, sponsorship. That page carries its own "Looking for a mortgage
 * instead?" escape link, which is the page telling you it is the wrong place
 * for these three.
 *
 * Sending somebody who clicked "Refinance" to a form asking which event they
 * are hosting is the exact bug already fixed on the Ask artwork's card. So
 * these three open the same call booking as the rest of the site, which IS
 * contacting Chris — about a mortgage, which is what they asked about.
 *
 * Speaking, Press and Book Chris do go to /book, because for those three it
 * is the right desk.
 */
type Entry = { label: string; href?: string; call?: boolean };

const COLS: { head: string; links: Entry[] }[] = [
  {
    head: "Lending",
    links: [
      { label: "Buy a home", call: true },
      { label: "Refinance", call: true },
      { label: "Investors", call: true },
      { label: "Get approved", href: APPLY_URL },
      /* Until the real team page has real people on it. The two placeholder
         "Team member" entries are why this points off-site for now. */
      { label: "The team", href: NATIONAL },
      /* Tools & calculators and Free guides are hidden for now, not deleted —
         /tools and /freebies still exist and stay indexed. */
    ],
  },
  {
    head: "The Movement",
    links: [
      { label: "The Game of Money", href: "/movement" },
      { label: "The mission", href: "/movement" },
      { label: "American Dream Conference", href: "/movement" },
      /* Merch keeps its own page — the only one in this column that does. */
      { label: "Merch", href: "/merch" },
    ],
  },
  {
    head: "Chris",
    links: [
      { label: "About Chris", href: NATIONAL },
      { label: "Speaking", href: "/book" },
      { label: "Press", href: "/book?type=press" },
      { label: "Client stories", href: NATIONAL },
      { label: "Book Chris", href: "/book" },
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

          {/* THE PRE-APPROVAL EVENT, NOT THE PHONE CALL. Somebody who has
              read the whole page and reached the footer is further along
              than somebody who clicked the card in the artwork — they are
              looking for what they can actually borrow, which is the longer
              appointment with its own intake questions. Same modal, same
              branded frame; only the event and the words change. */}
          <CallBooking
            className={s.ftCta}
            url={CALENDLY_PREAPPROVAL_URL}
            label="Book your FREE Loan Consultation"
            kicker="No cost, no obligation"
            title="Book your free"
            accent="loan consultation."
            lede="Find out what you can actually borrow. Chris takes this one himself — no credit pull to get started, and no obligation at the end of it."
            source="calendly-preapproval"
          />
        </div>
        {COLS.map((c) => (
          <div key={c.head}>
            <h5>{c.head}</h5>
            <ul>
              {c.links.map((l) => (
                /* Keyed on the label, not the href. Three entries in The
                   Movement share /movement, and duplicate keys make React
                   drop all but one item from the column. */
                <li key={l.label}>
                  {l.call ? (
                    /* Styled as a link, behaves as the booking modal.

                       BOTH children AND label, deliberately. Children render
                       the bare word — `label` alone appends an arrow, which
                       is right for a button and wrong in a list of links.
                       Passing label as well is what suppresses CallBooking's
                       "Schedule a call with Chris" aria-label, which would
                       otherwise announce something different from the visible
                       word and break label-in-name. */
                    <CallBooking className={s.ftLink} label={l.label}>
                      {l.label}
                    </CallBooking>
                  ) : l.href!.startsWith("http") ? (
                    /* An off-site destination gets a real anchor with the
                       external props. next/link would render it, but without
                       target and rel it takes the visitor off Mortgage Punk in
                       the same tab and hands the destination a handle on this
                       window. */
                    <a href={l.href} {...EXTERNAL}>
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href!}>{l.label}</Link>
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
