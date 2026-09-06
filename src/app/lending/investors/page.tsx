import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import DeepPage from "@/components/sections/DeepPage";
import LoudLead from "@/components/sections/LoudLead";

export const metadata = {
  title: "Investor Financing — Mortgage Punk",
  description:
    "Financing for your second, fifth, or twentieth property. Conventional, portfolio, and cash-flow based options from someone who runs the same math you do.",
};

export default function Investors() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead
        kicker="Investors"
        title="Debt is the tool."
        accent="Use it properly."
        lede="A mortgage on the right asset is the most accessible leverage most people will ever get. Here's how to finance the next one."
      />
      <DeepPage
        kicker="Who this is for"
        forWho="People buying property to hold, whether it's the first rental or the twentieth door, and who are tired of explaining their strategy to someone who doesn't have one."
        blocks={[
          { n: "01", h: "First rental", p: "Your first non-owner-occupied purchase. Different down payment, different reserves, different underwriting." },
          { n: "02", h: "Conventional & portfolio", p: "Conventional financing until you hit the limits, then portfolio options that keep you buying." },
          { n: "03", h: "Cash-flow based", p: "Qualifying on the property's income rather than your tax returns. Powerful when your returns don't tell the real story." },
        ]}
        needList={[
          "Two years of tax returns, all schedules",
          "Last two months of bank and asset statements",
          "Current lease agreements on properties you already own",
          "A schedule of real estate owned",
          "Entity documents if you're buying in an LLC",
          "For cash-flow based loans: the projected rent or a market rent analysis",
        ]}
        timeline={[
          { when: "Day 1", what: "We look at the deal and your position, and tell you which financing route actually fits." },
          { when: "Days 1–3", what: "Application, disclosures, rate lock. Property-level documentation starts." },
          { when: "Weeks 1–2", what: "Appraisal, often with a rent schedule attached. Underwriting begins." },
          { when: "Weeks 2–4", what: "Conditions worked. Entity and title items handled in parallel rather than in sequence." },
          { when: "Closing", what: "Funded. Then we talk about what the next one looks like." },
        ]}
        faqs={[
          { q: "How much down do I need on an investment property?", a: "More than on a primary residence — typically starting around 15–25% depending on the loan type and the property. Cash-flow based loans often sit at the higher end of that. Reserves matter too: lenders want to see months of payments in the bank, and that requirement grows with the number of properties you hold." },
          { q: "What is a DSCR loan?", a: "Debt Service Coverage Ratio. Instead of qualifying on your personal income, the property qualifies on its own rent relative to its payment. It's how a lot of investors keep buying once their tax returns stop reflecting their actual buying power. Chris has been public about how hard these can be to execute badly, and about getting them right." },
          { q: "Can I buy in an LLC?", a: "Yes, with the right loan. Conventional financing generally wants the property in your personal name, while portfolio and cash-flow based loans usually permit an entity. Decide this before you're under contract — moving it afterwards is avoidable pain." },
          { q: "How many properties can I finance?", a: "Conventional has limits on financed properties. Once you reach them, portfolio and cash-flow based products take over and the constraint becomes the deal itself rather than a counter. Worth planning several purchases ahead rather than discovering the wall." },
          { q: "Does rental income help me qualify?", a: "Usually, though lenders discount it — often around 75% — to account for vacancy and maintenance. Existing leases help. On a new purchase, an appraiser's market rent schedule can be used. How much it helps depends on the loan." },
        ]}
      />
      <LoudLead
        kicker="Investors"
        title="Finance the"
        accent="next one."
        lede="Tell us about the deal and we'll tell you which route actually fits it."
      />
      <SiteFooter />
    </>
  );
}
