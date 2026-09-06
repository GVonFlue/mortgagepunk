import Link from "next/link";
import s from "../Site.module.css";
import { thumbnail, topicSlug } from "@/lib/library";
import { getVideos, getTopics } from "@/lib/db";

/**
 * The education library teaser. Thumbnails are grayscale until hover — the
 * brand's desaturated-world / colour-where-the-energy-is rule, applied to UI.
 *
 * Server component: reads straight from the database so whatever Chris
 * featured in /backstage shows up here without a rebuild.
 */
export default async function LibraryTeaser() {
  const [all, topics] = await Promise.all([
    getVideos({ publishedOnly: true }),
    getTopics(),
  ]);
  const featured = all.filter((v) => v.featured).slice(0, 3);

  return (
    <section className={`${s.sec} ${s.dark}`} aria-label="The Game of Money">
      <div className={s.wrap}>
        <div className={s.libhead}>
          <div>
            <div className={s.kick}>The Game of Money</div>
            <h2 className={s.h2}>
              Everything they never taught you
              <em>about money.</em>
            </h2>
          </div>
          <Link href="/library" className={`${s.btn} ${s.btnGhost}`}>
            All {"\u2014"} browse the library &rarr;
          </Link>
        </div>

        <div className={s.chips}>
          <span className={`${s.chip} ${s.on}`}>All</span>
          {topics.map((t) => (
            <Link key={t.id} href={`/library/${topicSlug(t.name)}`} className={s.chip}>
              {t.name}
            </Link>
          ))}
        </div>

        {featured.length === 0 ? (
          <p className={s.lede}>New videos are on the way.</p>
        ) : (
          <div className={s.vids}>
            {featured.map((v) => (
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
                <div className={s.tp}>{v.topics?.[0]}</div>
                <h4>{v.title}</h4>
                <p>{v.blurb}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
