import Link from "next/link";
import s from "./MoneyWall.module.css";
import { thumbnail, topicSlug } from "@/lib/library";
import { getVideos, getTopics } from "@/lib/db";

/** Eight slots, four across. Fewer videos than that fills the rest with
 *  placeholders so the grid stays square while the library is being built. */
const SLOTS = 8;

/**
 * The Game of Money, shown rather than announced.
 *
 * FOUR ACROSS, EIGHT TOTAL. The previous three-up grid left the topic list
 * stranded in the empty space beside it, which read as a broken layout rather
 * than a design. A fixed eight-slot grid can't do that: it is always two full
 * rows of four, however many videos exist.
 *
 * PLACEHOLDERS ARE DELIBERATE. Chris is still filling the library, so empty
 * slots show a marked "coming soon" tile instead of collapsing the grid. He
 * sees the finished shape now and the slots fill themselves as he uploads
 * through Backstage — no code change needed.
 *
 * TOPICS SIT UNDERNEATH, full width, as a single quiet row. They are a way
 * deeper for anyone who wants one, not a filter interface competing with the
 * wall itself.
 */
export default async function MoneyWall() {
  const [all, topics] = await Promise.all([
    getVideos({ publishedOnly: true }),
    getTopics(),
  ]);

  const videos = all.slice(0, SLOTS);
  const empty = Math.max(0, SLOTS - videos.length);

  return (
    <div className={s.wrap}>
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
            {v.topics?.[0] && <span className={s.topic}>{v.topics[0]}</span>}
            <h3>{v.title}</h3>
          </a>
        ))}

        {Array.from({ length: empty }).map((_, i) => (
          <div key={`slot-${i}`} className={s.slot} aria-hidden="true">
            <span className={s.slotBox}>
              <span className={s.slotMark} />
            </span>
            <span className={s.slotLabel}>Coming soon</span>
          </div>
        ))}
      </div>

      {topics.length > 0 && (
        <div className={s.topics}>
          {topics.map((t) => (
            <Link key={t.id} href={`/library/${topicSlug(t.name)}`}>
              {t.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
