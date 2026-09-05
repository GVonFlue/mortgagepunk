import Link from "next/link";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import s from "@/components/Site.module.css";
import { TOPICS, PLACEHOLDER, thumbnail, topicSlug } from "@/lib/library";

export const metadata = {
  title: "The Game of Money — Mortgage Punk",
  description:
    "Free education on homeownership, mortgages, investing, taxes and building wealth. Everything they never taught you.",
};

export default function Library() {
  const videos = PLACEHOLDER.filter((v) => v.published);

  return (
    <>
      <SiteNav />
      <PageHead
        kicker="The Game of Money"
        title="Everything they"
        accent="never taught you."
        lede="The rules around money, homeownership, investing and wealth that most people were never taught. Free, always."
      />

      <section className={`${s.sec} ${s.dark}`} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={s.chips}>
            <span className={`${s.chip} ${s.on}`}>All</span>
            {TOPICS.map((t) => (
              <Link key={t} href={`/library/${topicSlug(t)}`} className={s.chip}>
                {t}
              </Link>
            ))}
          </div>

          {videos.length === 0 ? (
            <p className={s.lede}>The library is being loaded. Check back shortly.</p>
          ) : (
            <div className={s.vids}>
              {videos.map((v) => (
                <div key={v.id} id={v.id} className={s.vid}>
                  <div className={s.thumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.youtubeId ? thumbnail(v.youtubeId) : "/brand/hero-plate.jpg"}
                      alt=""
                    />
                    <span className={s.play} aria-hidden="true" />
                  </div>
                  <div className={s.tp}>{v.topic}</div>
                  <h4>{v.title}</h4>
                  <p>{v.blurb}</p>
                </div>
              ))}
            </div>
          )}

          <div className={s.todo} style={{ marginTop: 34 }}>
            TODO: wire to Supabase once the dashboard ships. Chris adds a YouTube URL,
            picks a topic, writes a blurb — title and thumbnail come from YouTube
            automatically so no image is ever uploaded.
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
