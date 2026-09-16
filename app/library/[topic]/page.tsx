import Link from "next/link";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import s from "@/components/Site.module.css";
import { thumbnail, topicSlug } from "@/lib/library";
import { getVideos, getTopics } from "@/lib/db";

export const revalidate = 300;

/**
 * Topics are data now, so the routes can't be pre-generated from a constant.
 * dynamicParams lets a topic Chris adds in /backstage work immediately
 * instead of 404ing until the next deploy.
 */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const topics = await getTopics();
  const match = topics.find((t) => topicSlug(t.name) === topic);
  return {
    title: match ? `${match.name} — Mortgage Punk` : "Library — Mortgage Punk",
    description: match ? `${match.name}: free education from Mortgage Punk.` : undefined,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const [all, topics] = await Promise.all([
    getVideos({ publishedOnly: true }),
    getTopics(),
  ]);

  const match = topics.find((t) => topicSlug(t.name) === topic);
  if (!match) notFound();

  // filtered in JS rather than with a PostgREST array query: the library is
  // small, and it keeps the array-encoding rules out of the query string
  const videos = all.filter((v) => (v.topics ?? []).includes(match.name));

  return (
    <>
      <AnnouncementBar />
      <SiteNav />
      <PageHead kicker="The Game of Money" title={match.name} />

      <section className={`${s.sec} ${s.dark}`} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={s.chips}>
            <Link href="/library" className={s.chip}>All</Link>
            {topics.map((t) => (
              <Link
                key={t.id}
                href={`/library/${topicSlug(t.name)}`}
                className={`${s.chip} ${t.name === match.name ? s.on : ""}`}
              >
                {t.name}
              </Link>
            ))}
          </div>

          {videos.length === 0 ? (
            <p className={s.lede}>Nothing here yet. More is on the way.</p>
          ) : (
            <div className={s.vids}>
              {videos.map((v) => (
                <a
                  key={v.id}
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
                  <div className={s.tp}>{(v.topics ?? []).join(" \u00b7 ")}</div>
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
