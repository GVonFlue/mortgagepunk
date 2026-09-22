import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import Statement, { Punch } from "@/components/brand/Statement";
import s from "@/components/Site.module.css";
import VideoPlay from "@/components/sections/VideoPlay";
import { topicSlug } from "@/lib/library";
import { getVideos, getTopics } from "@/lib/db";

export const metadata = {
  title: "The Game of Money — Mortgage Punk",
  description:
    "Free education on homeownership, mortgages, investing, taxes and building wealth. Everything they never taught you.",
};

export const revalidate = 300;

export default async function Library() {
  const [videos, topics] = await Promise.all([
    getVideos({ publishedOnly: true }),
    getTopics(),
  ]);

  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      {/* The page is named after the series, so the series name is the
          headline: stacked, centred, set in the same size-jump Statement face
          as the rest of the site. The kicker that used to sit above it said
          "The Game of Money" too, which made the name appear twice before the
          first sentence. The photograph is lifted for this hero only — see
          .photoLift in Site.module.css. */}
      <section
        className={`${s.sec} ${s.dark} ${s.photoBg} ${s.photoEducation} ${s.photoLift}`}
      >
        <div className={`${s.wrap} ${s.heroCenter}`}>
          <Statement
            as="h1"
            align="center"
            lines={[
              { t: "The Game", size: "xl" },
              { t: "of Money", size: "xl", tone: "red" },
            ]}
          />
          <Punch>
            The rules around money, homeownership, investing and taxes that
            most people are expected to just <strong>know</strong>. No gate, no
            email, no upsell at the end.
          </Punch>
        </div>
      </section>

      <section className={`${s.sec} ${s.dark}`} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={s.chips}>
            <span className={`${s.chip} ${s.on}`}>All</span>
            {topics.map((t) => (
              <Link key={t.id} href={`/library/${topicSlug(t.name)}`} className={s.chip}>
                {t.name}
              </Link>
            ))}
          </div>

          {videos.length === 0 ? (
            <p className={s.lede}>The library is being loaded. Check back shortly.</p>
          ) : (
            <div className={s.vids}>
              {videos.map((v) => (
                <article key={v.id} id={v.id} className={s.vid}>
                  <VideoPlay
                    youtubeId={v.youtube_id}
                    title={v.title}
                    frameClassName={s.thumb}
                    playClassName={s.play}
                  />
                  <div className={s.tp}>{(v.topics ?? []).join(" · ")}</div>
                  <h4>{v.title}</h4>
                  <p>{v.blurb}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
