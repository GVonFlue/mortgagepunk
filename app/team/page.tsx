import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import TeamGrid from "@/components/sections/TeamGrid";
import LoudLead from "@/components/sections/LoudLead";
import s from "@/components/Site.module.css";

export const metadata = {
  title: "The Team — Mortgage Punk",
  description:
    "The lending team behind Mortgage Punk. Real people, real NMLS numbers, and a phone that gets answered.",
};

export default function Team() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead
        kicker="The Lending Team"
        title="Real people."
        accent="Real phone numbers."
        lede="Mortgage Punk is a brand. The lending underneath it is a team, and you get to know exactly who is on your file."
      />
      <section className={`${s.sec} ${s.dark}`} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <TeamGrid />
          <div className={s.todo} style={{ marginTop: 30 }}>
            TODO: names, titles, NMLS numbers, markets, short bios and headshots
            needed for the two loan officers alongside Chris. Each one gets its
            own page — that is what makes a team page worth having for search.
          </div>
        </div>
      </section>
      <LoudLead
        kicker="Start here"
        title="Talk to a person,"
        accent="not a call center."
        lede="Tell us where you are and someone from the team gets back to you."
      />
      <SiteFooter />
    </>
  );
}
