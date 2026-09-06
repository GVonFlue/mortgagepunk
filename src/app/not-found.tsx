import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import s from "@/components/Site.module.css";

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <section className={`${s.sec} ${s.dark}`}>
        <div className={s.wrap}>
          <div className={s.kick}>404</div>
          <h1 className={s.h2}>Nothing here.<br /><em>Try again.</em></h1>
          <p className={s.lede}>
            The page you were after does not exist, or it moved during the rebuild.
          </p>
          <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/" className={`${s.btn} ${s.solid}`}>Back home &rarr;</Link>
            <Link href="/library" className={`${s.btn} ${s.ghost}`}>The library &rarr;</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
