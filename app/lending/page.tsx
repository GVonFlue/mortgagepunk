import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import ProcessScroll from "@/components/sections/ProcessScroll";
import LendingPaths from "@/components/sections/LendingPaths";
import LoudLead from "@/components/sections/LoudLead";
import s from "@/components/Site.module.css";

export const metadata = {
  title: "Lending — Mortgage Punk",
  description:
    "Buy a home, refinance, or finance an investment property with a lending team that answers the phone. No runaround, no fine print.",
};

/**
 * Page rhythm, deliberately alternating so the eye has somewhere to rest:
 *   dark hero -> LIGHT process -> dark routes -> LIGHT proof -> RED capture
 * The old version was black the whole way down and nothing pulled toward an
 * action.
 */
export default function Lending() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />

      <PageHead
        kicker="The Lending Team"
        title="No runaround."
        accent="No fine print. No BS."
        lede="Mortgage Punk is loud on purpose, and the lending underneath it is a serious operation. Here is exactly how it works."
      />

      <ProcessScroll />

      <section className={`${s.sec} ${s.dark}`}>
        <div className={s.wrap}>
          <div className={s.kick}>Where do you fit</div>
          <h2 className={s.h2}>
            Three ways in.
            <br />
            <em>Pick yours.</em>
          </h2>
          <p className={s.lede}>
            The process above is the same either way. What changes is the
            paperwork, the timeline, and what we're solving for.
          </p>
          <div style={{ marginTop: "clamp(30px,3.4vw,52px)" }}>
            <LendingPaths />
          </div>
        </div>
      </section>

      <section className={`${s.sec} ${s.bone}`}>
        <div className={s.wrap}>
          <div className={s.kick}>Why it&rsquo;s different here</div>
          <h2 className={s.h2}>
            A mortgage builds wealth.
            <br />
            <em>The process is what sucks.</em>
          </h2>
          <p className={`${s.lede} ${s.prose}`}>
            That sentence is the whole reason Mortgage Punk exists. The loan
            itself is a tool that turns debt into an asset. Everything painful
            about getting one is a process problem, and process problems are
            fixable.
          </p>
          <div className={s.lend} style={{ marginTop: 44 }}>
            <div className={s.c}>
              <div className={s.n}>01</div>
              <h3>You hear from us first</h3>
              <p>
                Before you have to chase. The single most common complaint about
                lenders is silence, and it is entirely avoidable.
              </p>
            </div>
            <div className={s.c}>
              <div className={s.n}>02</div>
              <h3>Everything asked once</h3>
              <p>
                We pull the full document list up front instead of drip-feeding
                requests across three weeks.
              </p>
            </div>
            <div className={s.c}>
              <div className={s.n}>03</div>
              <h3>Straight answers</h3>
              <p>
                Including when the answer is no, or wait. A deal that shouldn&rsquo;t
                happen is worse for you than for us.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LoudLead
        kicker="Start here"
        title="Get approved"
        accent="the right way."
        lede="Two minutes, no credit pull to start the conversation. Someone from the team comes back to you with a real answer."
      />

      <SiteFooter />
    </>
  );
}
