import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import Statement, { Kicker, Punch } from "@/components/brand/Statement";
import s from "@/components/Site.module.css";
import { thumbnail, topicSlug } from "@/lib/library";
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
      {/* Teaching page, so the hero gives before it asks. Set with the
          size-jump treatment from his posters rather than a flat two-tone
          heading. */}
      <section className={`${s.sec} ${s.dark}`}>
        <div className={s.wrap}>
          <Kicker>The Game of Money</Kicker>
          <Statement
            as="h1"
            lines={[
              { t: "Nobody", size: "md" },
              { t: "taught you", size: "xl" },
              { t: "any of this.", size: "xl", tone: "red" },
              { t: "So here it is. Free. All of it.", size: "sm" },
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
                  <div className={s.tp}>{(v.topics ?? []).join(" · ")}</div>
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
