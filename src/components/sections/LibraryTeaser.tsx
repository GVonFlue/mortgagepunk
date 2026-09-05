import Link from "next/link";
import s from "../Site.module.css";
import { TOPICS, PLACEHOLDER, thumbnail, topicSlug } from "../../lib/library";

/**
 * The education library teaser. Thumbnails are grayscale until hover — the
 * brand's desaturated-world / colour-where-the-energy-is rule, applied to UI.
 */
export default function LibraryTeaser() {
  const featured = PLACEHOLDER.filter((v) => v.featured && v.published).slice(0, 3);

  return (
    <section className={`${s.sec} ${s.dark}`} aria-label="The Game of Money">
      <div className={s.wrap}>
        <div className={s.libhead}>
          <div>
            <div className={s.kick}>The Game of Money</div>
            <h2 className={s.h2}>
              Everything they<br />
              <em>never taught you.</em>
            </h2>
          </div>
          <Link href="/library" className={`${s.btn} ${s.ghost}`}>
            Browse the library &rarr;
          </Link>
        </div>

        <div className={s.chips}>
          <span className={`${s.chip} ${s.on}`}>All</span>
          {TOPICS.map((t) => (
            <Link key={t} href={`/library/${topicSlug(t)}`} className={s.chip}>
              {t}
            </Link>
          ))}
        </div>

        <div className={s.vids}>
          {featured.map((v) => (
            <Link key={v.id} href={`/library#${v.id}`} className={s.vid}>
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
