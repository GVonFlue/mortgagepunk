import s from "../Site.module.css";
import LeadForm from "./LeadForm";

export default function LeadSection() {
  return (
    <section className={`${s.sec} ${s.dark}`} id="start" aria-label="Contact the team">
      <div className={s.wrap}>
        <div className={s.lead}>
          <div>
            <div className={s.kick}>Start Here</div>
            <h2 className={s.h2}>
              Let&rsquo;s find the leaks,
              <br />
              <em>then plug them.</em>
            </h2>
            <p className={s.lede}>
              Tell us where you are and someone from the team gets back to you.
              Not a call center, not a drip campaign.
            </p>
            <div className={s.todo}>
              TODO before launch: compliance disclosures pending from Andrew
              Richels at Neighborhood Loans. Do not go live without them.
            </div>
          </div>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
