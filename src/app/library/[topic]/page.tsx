import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PageHead from "@/components/layout/PageHead";
import s from "@/components/Site.module.css";
import { TOPICS, PLACEHOLDER, thumbnail, topicSlug } from "@/lib/library";

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

  const videos = PLACEHOLDER.filter((v) => v.published && v.topic === name);

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
                <div key={v.id} className={s.vid}>
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
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
