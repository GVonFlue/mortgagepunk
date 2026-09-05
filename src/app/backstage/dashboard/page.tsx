import Link from "next/link";
import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import s from "@/components/backstage/Backstage.module.css";
import {
  isConfigured, SEED_VIDEOS, SEED_LEADS, SEED_PRESS, SEED_ANNOUNCEMENT,
} from "@/lib/content";

export default function Overview() {
  const configured = isConfigured();
  const videos = SEED_VIDEOS;
  const leads = SEED_LEADS;
  const press = SEED_PRESS;

  const stats = [
    { v: String(videos.filter((v) => v.published).length), l: "Videos live" },
    { v: String(videos.filter((v) => v.featured).length), l: "On the homepage" },
    { v: String(leads.length), l: "Leads this month" },
    { v: String(press.filter((p) => !p.pending).length), l: "Press items live" },
  ];

  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Backstage</h1>
          <p className={s.sub}>
            Everything here changes the live site. Nothing here can break it —
            every field is capped to fit the layout it lands in.
          </p>
        </div>
      </div>

      <Notice configured={configured} />

      <div className={s.stats}>
        {stats.map((x) => (
          <div key={x.l} className={s.stat}>
            <span className={s.statVal}>{x.v}</span>
            <span className={s.statLabel}>{x.l}</span>
          </div>
        ))}
      </div>

      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Start here</h2>
        </div>
        <div className={s.btnRow}>
          <Link href="/backstage/library" className={`${s.btn} ${s.btnPrimary}`}>
            Add a video
          </Link>
          <Link href="/backstage/leads" className={`${s.btn} ${s.btnGhost}`}>
            Read new leads
          </Link>
          <Link href="/backstage/conference" className={`${s.btn} ${s.btnGhost}`}>
            Update the conference
          </Link>
          <Link href="/backstage/settings" className={`${s.btn} ${s.btnGhost}`}>
            {SEED_ANNOUNCEMENT.enabled ? "Edit the banner" : "Turn on the banner"}
          </Link>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>What you can change from here</h2>
        </div>
        <p className={s.sub} style={{ margin: 0 }}>
          The education library, the leads inbox, press and appearances, the
          conference details, your speaking topics, and the site-wide
          announcement bar.
        </p>
        <p className={s.help} style={{ marginTop: 12 }}>
          Page layouts, colours, and navigation aren&rsquo;t editable on purpose
          — those are design decisions, and text us if you want one changed.
        </p>
      </div>
    </Shell>
  );
}
