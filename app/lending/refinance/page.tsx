import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import DeepPage from "@/components/sections/DeepPage";
import LoudLead from "@/components/sections/LoudLead";

export const metadata = {
  title: "Refinance — Mortgage Punk",
  description:
    "A straight answer on whether refinancing makes sense for you, including the times it doesn't. Rate and term, cash-out, or consolidation.",
};

export default function Refinance() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead
        kicker="Refinance"
        title="Sometimes the answer"
        accent="is don't."
        lede="Plenty of lenders will refinance you into a worse position because the transaction pays them either way. We'll show you the actual math."
      />
      <DeepPage
        kicker="Who this is for"
        forWho="Homeowners sitting on equity, carrying expensive debt, or holding a rate they took when they had no other option."
        blocks={[
          { n: "01", h: "Rate and term", p: "Lower the rate, shorten the term, or drop mortgage insurance you no longer need to be paying." },
          { n: "02", h: "Cash-out", p: "Turn equity into a renovation, a rental down payment, or breathing room. Powerful, and worth doing carefully." },
          { n: "03", h: "Consolidation", p: "Roll high-interest debt into the mortgage. This is the one that needs the most honest math." },
        ]}
        needList={[
          "Your current mortgage statement",
          "Two most recent pay stubs",
          "Last two years of W-2s or 1099s",
          "Last two months of bank statements",
          "Homeowners insurance declaration page",
          "If you have a second mortgage or HELOC: that statement too",
        ]}
        timeline={[
          { when: "Day 1", what: "We run the real break-even. If it doesn't clear, we tell you and you keep your current loan." },
          { when: "Days 1–3", what: "If it makes sense, application and disclosures. Rate locked." },
          { when: "Weeks 1–2", what: "Appraisal ordered if one is needed. Underwriting starts." },
          { when: "Weeks 2–3", what: "Conditions cleared. Title work completed." },
          { when: "Closing", what: "You sign. On a primary residence there's a three-day right of rescission before it funds." },
        ]}
        faqs={[
          { q: "How do I know if refinancing is worth it?", a: "Break-even. Take the total cost of the refinance, divide by what you save each month, and that's how many months until you're ahead. If you're likely to move before then, it isn't worth it. We run that number before you commit to anything, and we'll say so when it doesn't clear." },
          { q: "Is consolidating credit card debt into my mortgage a good idea?", a: "It can be, and it can also be a trap. You're converting unsecured debt into debt secured by your house, and stretching it over thirty years can mean paying more in total even at a lower rate. It works when it's paired with actually changing the spending. It fails when the cards get run back up." },
          { q: "Will I need a new appraisal?", a: "Often, but not always. Some refinances qualify for an appraisal waiver depending on the loan type and how much equity you have. We find out early, because it affects both cost and timeline." },
          { q: "How much equity do I need?", a: "It depends on the loan and what you're doing. Rate-and-term can work with relatively little; cash-out generally needs more left behind. Some streamline options for VA and FHA loans have their own rules entirely." },
          { q: "Does refinancing restart my 30 years?", a: "It does if you take another 30-year term, and that's the part people miss. If you're eight years in, you can refinance into a shorter term and often keep a similar payment while saving years of interest. Worth doing the math on before defaulting to another 30." },
        ]}
      />
      <LoudLead
        kicker="Refinance"
        title="Get the math,"
        accent="not the pitch."
        lede="We'll run your break-even and tell you straight whether it's worth doing."
      />
      <SiteFooter />
    </>
  );
}
