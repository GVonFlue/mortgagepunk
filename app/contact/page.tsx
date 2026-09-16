import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import LeadSection from "@/components/sections/LeadSection";
import s from "@/components/Site.module.css";

export const metadata = {
  title: "Contact — Mortgage Punk",
  description: "Get in touch with the Mortgage Punk team.",
};

export default function Contact() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead
        kicker="Contact"
        title="Reach a person."
        accent="Not a queue."
        lede="Lending questions, speaking requests, press, or partnerships — here is where each one goes."
      />

      <section className={`${s.sec} ${s.ink}`}>
        <div className={s.wrap}>
          <div className={s.lend} style={{ background: "#2A2A2A" }}>
            <div className={s.c} style={{ background: "var(--mp-black)", color: "var(--mp-bone)" }}>
              <div className={s.n}>01</div>
              <h3>Lending</h3>
              <p style={{ color: "#8E8E8E" }}>
                Buying, refinancing, or investing. Use the form below and the team picks
                it up.
              </p>
            </div>
            <div className={s.c} style={{ background: "var(--mp-black)", color: "var(--mp-bone)" }}>
              <div className={s.n}>02</div>
              <h3>Speaking</h3>
              <p style={{ color: "#8E8E8E" }}>
                Booking and stage inquiries are coordinated by Ashley Thill.
              </p>
            </div>
            <div className={s.c} style={{ background: "var(--mp-black)", color: "var(--mp-bone)" }}>
              <div className={s.n}>03</div>
              <h3>Press</h3>
              <p style={{ color: "#8E8E8E" }}>
                Media, interviews, and appearances also route through Ashley.
              </p>
            </div>
          </div>
          <div className={s.todo} style={{ marginTop: 26 }}>
            TODO: final inbox architecture pending. Ashley to confirm whether
            Chris@MortgagePunk.com is the public address or whether dedicated
            speaking and press inboxes get created.
          </div>
        </div>
      </section>

      <LeadSection />
      <SiteFooter />
    </>
  );
}
