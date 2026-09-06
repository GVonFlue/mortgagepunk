import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import LoudLead from "@/components/sections/LoudLead";
import s from "@/components/Site.module.css";
import { getTestimonials } from "@/lib/db";

export const metadata = {
  title: "Client Stories — Mortgage Punk",
  description:
    "What it's actually like to work with the Mortgage Punk lending team, in clients' own words.",
};

export const revalidate = 300;

export default async function TestimonialsPage() {
  const items = await getTestimonials({ publishedOnly: true });

  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead
        kicker="Client stories"
        title="In their words,"
        accent="not ours."
        lede="Every one of these is a real person who let us use their name."
      />

      <section className={`${s.sec} ${s.dark}`} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          {items.length === 0 ? (
            <div className={s.todo}>
              TODO: no published testimonials yet. Add them in Backstage —
              they start as drafts and only appear here once published, because
              these are real people being quoted by name.
            </div>
          ) : (
            <div className={s.tGrid}>
              {items.map((t) => (
                <figure key={t.id} className={s.tCard}>
                  <div className={s.tStars} aria-label={`${t.rating} out of 5`}>
                    {"\u2605".repeat(t.rating)}
                  </div>
                  <blockquote className={s.tQuote}>{t.quote}</blockquote>
                  <figcaption className={s.tWho}>
                    <span className={s.tName}>{t.name}</span>
                    {t.role && <span className={s.tRole}>{t.role}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <LoudLead
        kicker="Your turn"
        title="Start the"
        accent="conversation."
        lede="Tell us where you are and someone from the team gets back to you."
      />
      <SiteFooter />
    </>
  );
}
