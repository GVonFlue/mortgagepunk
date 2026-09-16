import Link from "next/link";
import s from "./MoneyWall.module.css";
import { thumbnail, topicSlug } from "@/lib/library";
import { getVideos, getTopics } from "@/lib/db";

/**
 * The Game of Money, shown rather than announced.
 *
 * Six square tiles, straight onto the homepage. The previous version was a
 * signpost — a headline, some filter chips, and a button pointing at a library
 * somewhere else. This is the library, or enough of it to matter.
 *
 * SQUARE, not 16:9. YouTube serves 16:9 thumbnails, so a square crop loses a
 * strip from each side. That is the trade: a square grid reads as a wall of
 * work — an album sleeve, a poster wall — where a row of widescreen rectangles
 * reads as a video player's related-videos list. The crop is centred, so the
 * subject survives it.
 *
 * Titles sit under the tile rather than over it. Text over a thumbnail has to
 * fight whatever is behind it, and these thumbnails already carry type.
 */
export default async function MoneyWall() {
  const [all, topics] = await Promise.all([
    getVideos({ publishedOnly: true }),
    getTopics(),
  ]);
  const videos = all.slice(0, 6);

  return (
    <>
      {videos.length === 0 ? (
        <p className={s.empty}>New videos are on the way.</p>
      ) : (
        <div className={s.grid}>
          {videos.map((v) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={s.tile}
            >
              <span className={s.thumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.youtube_id ? thumbnail(v.youtube_id) : "/brand/hero-plate.jpg"}
                  alt=""
                  loading="lazy"
                />
                <span className={s.play} aria-hidden="true" />
              </span>
              <span className={s.topic}>{v.topics?.[0]}</span>
              <h3>{v.title}</h3>
            </a>
          ))}
        </div>
      )}

      {/* topics as a quiet row, not a filter UI competing with the wall */}
      {topics.length > 0 && (
        <div className={s.topics}>
          {topics.slice(0, 8).map((t) => (
            <Link key={t.id} href={`/library/${topicSlug(t.name)}`}>
              {t.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
