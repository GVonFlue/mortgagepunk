import Link from "next/link";
import s from "./MoneyWall.module.css";
import VideoPlay from "./VideoPlay";
import { getVideos } from "@/lib/db";

/**
 * The Game of Money, as a record shelf.
 *
 * One feature video across the full width of the screen, three square album
 * covers pressed up underneath it. That shape is borrowed from a music site
 * on purpose — it treats the content as a body of work rather than as a list
 * of links.
 *
 * THE FEATURE CARRIES NO TITLE AND NO BLURB. Chris's thumbnails are designed
 * artwork with the title already set into them — "Top 10 Ways to Avoid a
 * Mortgage Trainwreck / Part One: What Is a Mortgage?" is inside the image.
 * Repeating it underneath in web type said the same thing twice, in worse
 * lettering, and pushed the row of covers a screen further down. The artwork
 * is the headline.
 *
 * THE THREE BELOW ARE COVERS, NOT CARDS. No sleeve, no panel, no description:
 * square art, a title under it, and a small gap. A record shelf is a grid of
 * artwork, and the moment each one gets a bordered container with a paragraph
 * in it the page turns back into a list of blog posts.
 *
 * Videos play in place — see VideoPlay. Nothing on this page leaves for
 * youtube.com.
 *
 * Empty slots render as marked placeholders so the finished shape is visible
 * while Chris is still filling the library through Backstage.
 */

const BELOW = 3;

function Feature({
  v,
}: {
  v: { youtube_id?: string | null; title: string };
}) {
  return (
    <div className={s.feature}>
      <VideoPlay
        youtubeId={v.youtube_id}
        title={v.title}
        feature
        frameClassName={`${s.art} ${s.artFeature}`}
        playClassName={s.play}
      />
    </div>
  );
}

function Cover({
  v,
}: {
  v: { youtube_id?: string | null; title: string };
}) {
  return (
    <div className={s.card}>
      <VideoPlay
        youtubeId={v.youtube_id}
        title={v.title}
        frameClassName={`${s.art} ${s.artCard}`}
        playClassName={s.play}
      />
      <span className={s.info}>
        <h3>{v.title}</h3>
      </span>
    </div>
  );
}

function Slot({ feature = false }: { feature?: boolean }) {
  return (
    <div className={feature ? s.feature : s.card} aria-hidden="true">
      <span
        className={`${s.art} ${feature ? s.artFeature : s.artCard} ${s.slotArt}`}
      >
        <span className={s.slotMark} />
      </span>
      {/* the feature slot stays wordless, like the feature itself */}
      {!feature && (
        <span className={s.info}>
          <h3 className={s.slotTitle}>Coming soon</h3>
        </span>
      )}
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
      {hero ? <Feature v={hero} /> : <Slot feature />}

      <div className={s.row}>
        {row.map((v) => (
          <Cover key={v.id} v={v} />
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
