import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import DeepPage from "@/components/sections/DeepPage";
import LoudLead from "@/components/sections/LoudLead";

export const metadata = {
  title: "Buy a Home — Mortgage Punk",
  description:
    "First home or fifth. A pre-approval that holds up with sellers, a straight timeline, and a lending team you can actually reach.",
};

export default function Buy() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead
        kicker="Buy a Home"
        title="A pre-approval"
        accent="that means something."
        lede="Most buyers lose houses they could have afforded because their approval didn't hold up. Here is how we make sure yours does."
      />
      <DeepPage
        kicker="Who this is for"
        forWho="First-time buyers, move-up buyers, and anyone who has been told 'you're pre-qualified' and suspects that doesn't mean much."
        blocks={[
          { n: "01", h: "First-time buyers", p: "You have never done this and everyone is talking to you in acronyms. We start from zero and we don't rush you." },
          { n: "02", h: "Move-up buyers", p: "Selling one and buying another at the same time. The timing is the hard part, and it is solvable." },
          { n: "03", h: "Veterans & first responders", p: "VA and specialty programs, run by someone who actually knows the paperwork." },
        ]}
        needList={[
          "Two most recent pay stubs",
          "Last two years of W-2s or 1099s",
          "Last two months of bank statements, all pages",
          "Photo ID",
          "If self-employed: two years of tax returns, all schedules",
          "If VA: your Certificate of Eligibility, or we can pull it",
        ]}
        timeline={[
          { when: "Day 1", what: "Full pre-approval, underwritten up front. You know your real number and what would change it." },
          { when: "Weeks 1–8", what: "You shop. We turn payment scenarios on specific houses around the same day you ask." },
          { when: "Contract day", what: "Offer accepted. Rate locked, file opens, every contract date mapped out." },
          { when: "Weeks 2–4", what: "Underwriting. Conditions worked the day they arrive, and you hear from us before you have to ask." },
          { when: "Closing week", what: "Clear to close. Final numbers reviewed with you, wire instructions verified." },
          { when: "Closing day", what: "You sign, it funds, the house is yours." },
        ]}
        faqs={[
          { q: "How much do I actually need for a down payment?", a: "Less than most people think, and it depends entirely on the loan. Conventional can start at 3% down, FHA at 3.5%, and VA and USDA can be zero. The bigger question is usually reserves and closing costs, which is what nobody tells you about up front." },
          { q: "Will getting pre-approved hurt my credit?", a: "A full pre-approval involves a hard pull, which typically moves a score by a few points and recovers quickly. Mortgage inquiries inside a short window count as one, so shopping lenders does not stack damage. We can also talk through your situation before pulling anything." },
          { q: "What's the difference between pre-qualified and pre-approved?", a: "Pre-qualified means someone listened to what you told them. Pre-approved means someone verified it. Only one of those holds up when a listing agent is comparing three offers, and the difference is why buyers lose houses they could have afforded." },
          { q: "How long does the whole thing take?", a: "From contract to closing, typically three to four weeks. The variable is almost never the lender's speed — it's how fast documents come back. Which is exactly why we ask for everything at once instead of drip-feeding requests." },
          { q: "What if my credit isn't great?", a: "Tell us anyway. There is a real range of what works, and there are programs built for scores well below what people assume. If it genuinely isn't the moment, we will say so and tell you what to fix and roughly how long it takes." },
        ]}
      />
      <LoudLead
        kicker="Buy a home"
        title="Find out what"
        accent="you can actually buy."
        lede="Two minutes to start. No credit pull to have the first conversation."
      />
      <SiteFooter />
    </>
  );
}
