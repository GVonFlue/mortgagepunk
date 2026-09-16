import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import s from "@/components/Site.module.css";

export const metadata = {
  title: "Merch — Mortgage Punk",
  description: "Mortgage Punk merch. Coming soon.",
};

/**
 * Deliberate placeholder. Chris named a real merch store a priority twice, and
 * the proposal put the full store (catalog, inventory, fulfilment) on the
 * horizon rather than in this build. This page exists so the idea is visible
 * and not silently dropped — the store gets scoped and quoted separately.
 */
export default function Merch() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead
        kicker="Merch"
        title="Wear it loud."
        accent="Coming soon."
        lede="A real Mortgage Punk store is being built — catalog, sizes, the whole thing. Get on the list and you will hear first."
      />
      <section className={`${s.sec} ${s.dark}`} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={s.todo}>
            TODO: the full merch store (catalog, inventory, fulfilment) is on the
            horizon in the proposal, not in this build. Platform recommendation
            pending from ProyTech. Do not expand this page without a scope
            conversation.
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
