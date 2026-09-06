import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import s from "@/components/Site.module.css";
import { TOPICS, thumbnail, topicSlug } from "@/lib/library";
import { getVideos } from "@/lib/db";

export const metadata = {
  title: "The Game of Money — Mortgage Punk",
  description:
    "Free education on homeownership, mortgages, investing, taxes and building wealth. Everything they never taught you.",
};

export const revalidate = 300;

export default async function Library() {
  const videos = await getVideos({ publishedOnly: true });

  return (
    <>
      <AnnouncementBar />
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
                <a
                  key={v.id}
                  id={v.id}
                  href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.vid}
                >
                  <div className={s.thumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.youtube_id ? thumbnail(v.youtube_id) : "/brand/hero-plate.jpg"}
                      alt=""
                    />
                    <span className={s.play} aria-hidden="true" />
                  </div>
                  <div className={s.tp}>{v.topic}</div>
                  <h4>{v.title}</h4>
                  <p>{v.blurb}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
