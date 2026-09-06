import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import LoudLead from "@/components/sections/LoudLead";
import s from "@/components/Site.module.css";

export const metadata = {
  title: "Free Guides — Mortgage Punk",
  description:
    "Checklists, walkthroughs and worksheets you can keep. No gate on the ones that are genuinely useful.",
};

/**
 * Deliberately ungated.
 *
 * The industry standard is to trade a PDF for an email address, and it works
 * badly: you get a list of people who wanted a PDF. Chris's whole position is
 * give-first. These download outright, and the ask sits at the bottom for
 * people the guides actually helped.
 */
const GUIDES = [
  {
    title: "The document checklist",
    body: "Everything underwriting will ask for, in one list, so you can gather it in an evening instead of over three weeks.",
    meta: "PDF · 2 pages",
    icon: <><path d="M8 3h8l4 4v14H4V3z" /><path d="M8 12h8M8 16h5" /></>,
  },
  {
    title: "First-time buyer walkthrough",
    body: "Contract to keys, in plain words, with the parts nobody warns you about flagged in advance.",
    meta: "PDF · 8 pages",
    icon: <><path d="M3 10.5 12 4l9 6.5V20H3z" /><path d="M9.5 20v-6h5v6" /></>,
  },
  {
    title: "What your payment actually includes",
    body: "The one-pager that explains why the number you were quoted isn't the number you'll pay.",
    meta: "PDF · 1 page",
    icon: <><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" /><path d="M2.5 10h19" /></>,
  },
  {
    title: "Offer strength worksheet",
    body: "What sellers actually weigh besides price, and how to be the offer that gets taken.",
    meta: "PDF · 2 pages",
    icon: <><path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8L6.7 20l1-6L3.4 9.9l6-.9z" /></>,
  },
  {
    title: "Investor deal analyser",
    body: "The spreadsheet Chris uses to decide whether a rental is worth financing.",
    meta: "Spreadsheet",
    icon: <><rect x="3" y="3.5" width="18" height="17" rx="2" /><path d="M3 9h18M9 9v11.5" /></>,
  },
  {
    title: "Refinance break-even sheet",
    body: "Work out whether refinancing pays for itself before anyone tries to sell you one.",
    meta: "Spreadsheet",
    icon: <><path d="M3 12a9 9 0 0 1 15.5-6.2M21 12a9 9 0 0 1-15.5 6.2" /><path d="M18 3v4h-4M6 21v-4h4" /></>,
  },
];

export default function Freebies() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead
        kicker="Free guides"
        title="Take them."
        accent="No email required."
        lede="Everyone else makes you trade an email address for a PDF. These just download. If they help, you know where to find us."
      />

      <section className={`${s.sec} ${s.dark}`} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={s.fGrid}>
            {GUIDES.map((g) => (
              <div key={g.title} className={s.fCard}>
                <svg className={s.fIcon} viewBox="0 0 24 24" aria-hidden="true">
                  {g.icon}
                </svg>
                <h3>{g.title}</h3>
                <p>{g.body}</p>
                <span className={s.fMeta}>{g.meta} &middot; coming soon</span>
              </div>
            ))}
          </div>

          <div className={s.todo} style={{ marginTop: 30 }}>
            TODO: the guides themselves need writing and designing — six PDFs and
            two spreadsheets. The page, the cards and the download wiring are
            done; each card becomes a real download the moment a file lands in
            <code> /public/guides/</code>. Worth deciding with Chris which three
            to build first rather than all six at once.
          </div>
        </div>
      </section>

      <LoudLead
        kicker="Still stuck?"
        title="A guide is good."
        accent="A person is better."
        lede="If you read one of these and still have a question, that's exactly what the team is for."
      />
      <SiteFooter />
    </>
  );
}
