import Link from "next/link";
import s from "./MoneyWall.module.css";
import { thumbnail } from "@/lib/library";
import { getVideos } from "@/lib/db";

/**
 * The Game of Money, as a record shelf.
 *
 * One feature video at full width, three below it as album-style cards:
 * artwork on top, a description panel underneath. That shape is borrowed
 * from a music site on purpose — it treats the content as a body of work
 * rather than as a list of links.
 *
 * Empty slots render as marked placeholders so the finished shape is visible
 * while Chris is still filling the library through Backstage.
 */

const BELOW = 3;

function VideoCard({
  v,
  feature = false,
}: {
  v: { id: string; youtube_id?: string | null; title: string; blurb?: string | null };
  feature?: boolean;
}) {
  const href = v.youtube_id
    ? `https://www.youtube.com/watch?v=${v.youtube_id}`
    : undefined;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={feature ? s.feature : s.card}
    >
      <span className={s.art}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={v.youtube_id ? thumbnail(v.youtube_id) : "/brand/hero-plate.jpg"}
          alt=""
          loading={feature ? "eager" : "lazy"}
        />
        <span className={s.play} aria-hidden="true" />
      </span>
      <span className={s.info}>
        <h3>{v.title}</h3>
        {v.blurb && <p>{v.blurb}</p>}
      </span>
    </a>
  );
}

function Slot({ feature = false }: { feature?: boolean }) {
  return (
    <div className={feature ? s.feature : s.card} aria-hidden="true">
      <span className={`${s.art} ${s.slotArt}`}>
        <span className={s.slotMark} />
      </span>
      <span className={s.info}>
        <h3 className={s.slotTitle}>Coming soon</h3>
      </span>
    </div>
  );
}

export default async function MoneyWall() {
  const all = await getVideos({ publishedOnly: true });
  const [hero, ...rest] = all;
  const row = rest.slice(0, BELOW);
  const empty = Math.max(0, BELOW - row.length);

  return (
    <div className={s.wrap}>
      {hero ? <VideoCard v={hero} feature /> : <Slot feature />}

      <div className={s.row}>
        {row.map((v) => (
          <VideoCard key={v.id} v={v} />
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <Slot key={`slot-${i}`} />
        ))}
      </div>

      <Link href="/library" className={s.cta}>
        Watch the whole library <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
