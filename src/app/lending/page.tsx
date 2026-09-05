import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import LeadSection from "@/components/sections/LeadSection";
import s from "@/components/Site.module.css";

export const metadata = {
  title: "Lending — Mortgage Punk",
  description:
    "Buy a home, refinance, or finance an investment property with a lending team that answers the phone.",
};

const BLOCKS = [
  {
    id: "buy", n: "01", h: "Buy a home",
    p: "First home or fifth. A pre-approval that actually means something, a straight timeline, and a team you can reach.",
    points: [
      "Pre-approval that holds up with sellers",
      "Down payment options explained in plain terms",
      "First-time buyer programs, if they fit you",
      "A real person on your file, start to close",
    ],
  },
  {
    id: "refi", n: "02", h: "Refinance",
    p: "An honest answer on whether refinancing makes sense for you, including the times it does not.",
    points: [
      "Rate and term, cash-out, or consolidation",
      "The actual break-even math, shown to you",
      "No pressure when the answer is wait",
    ],
  },
  {
    id: "invest", n: "03", h: "Investors",
    p: "Financing built for people buying their second, fifth, or twentieth property.",
    points: [
      "Conventional and portfolio options",
      "Cash-flow based approaches",
      "Someone who understands the math you are running",
    ],
  },
];

export default function Lending() {
  return (
    <>
      <SiteNav />
      <PageHead
        kicker="The Lending Team"
        title="No runaround."
        accent="No fine print. No BS."
        lede="Mortgage Punk is loud on purpose, and the lending underneath it is a serious operation. Here is what we actually do."
      />
      {BLOCKS.map((b, i) => (
        <section key={b.id} id={b.id} className={`${s.sec} ${i % 2 === 0 ? s.ink : s.dark}`}>
          <div className={s.wrap}>
            <div className={s.mv}>
              <div>
                <div className={s.kick}>{b.n}</div>
                <h2 className={s.h2}>{b.h}</h2>
                <p className={s.lede}>{b.p}</p>
              </div>
              <div className={s.evt}>
                <div className={s.tag}>What that looks like</div>
                <ul style={{ listStyle: "none", display: "grid", gap: 12 }}>
                  {b.points.map((pt) => (
                    <li key={pt} style={{ fontSize: 15, lineHeight: 1.6, color: "#A8A8A8" }}>
                      <span style={{ color: "var(--mp-red)", fontWeight: 700 }}>&rsaquo;</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}
      <LeadSection />
      <SiteFooter />
    </>
  );
}
