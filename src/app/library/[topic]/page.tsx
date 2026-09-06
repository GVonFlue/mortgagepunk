import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import s from "@/components/Site.module.css";
import { TOPICS, thumbnail, topicSlug } from "@/lib/library";
import { getVideos } from "@/lib/db";

export const revalidate = 300;

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: topicSlug(t) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const name = TOPICS.find((t) => topicSlug(t) === topic);
  return {
    title: name ? `${name} — Mortgage Punk` : "Library — Mortgage Punk",
    description: name ? `${name}: free education from Mortgage Punk.` : undefined,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const name = TOPICS.find((t) => topicSlug(t) === topic);
  if (!name) notFound();

  const all = await getVideos({ publishedOnly: true });
  const videos = all.filter((v) => v.topic === name);

  return (
    <>
      <SiteNav />
      <PageHead kicker="The Game of Money" title={name} />

      <section className={`${s.sec} ${s.dark}`} style={{ paddingTop: 0 }}>
        <div className={s.wrap}>
          <div className={s.chips}>
            <Link href="/library" className={s.chip}>All</Link>
            {TOPICS.map((t) => (
              <Link
                key={t}
                href={`/library/${topicSlug(t)}`}
                className={`${s.chip} ${t === name ? s.on : ""}`}
              >
                {t}
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
