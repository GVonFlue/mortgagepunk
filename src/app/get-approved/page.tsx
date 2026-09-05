import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import LeadSection from "@/components/sections/LeadSection";
import s from "@/components/Site.module.css";

export const metadata = {
  title: "Get Approved the Right Way — Mortgage Punk",
  description:
    "Start your mortgage approval with a team that answers the phone. No runaround, no fine print.",
};

const STEPS = [
  ["01", "Tell us where you are", "Two minutes. What you're trying to do and how to reach you. No credit pull to start the conversation."],
  ["02", "Talk to a person", "A real member of the team, not a call center. We tell you what you actually qualify for and what would change it."],
  ["03", "Get your approval", "A pre-approval that holds up with sellers, and a straight timeline to closing."],
];

export default function GetApproved() {
  return (
    <>
      <SiteNav />
      <PageHead
        kicker="Get Approved"
        title="The right way."
        accent="Which is to say, honestly."
        lede="Most lenders sell speed. We sell certainty. Here is exactly how this goes."
      />

      <section className={`${s.sec} ${s.bone}`}>
        <div className={s.wrap}>
          <div className={s.lend}>
            {STEPS.map(([n, h, p]) => (
              <div key={n} className={s.c}>
                <div className={s.n}>{n}</div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadSection />
      <SiteFooter />
    </>
  );
}
