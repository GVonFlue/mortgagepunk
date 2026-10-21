import Link from "next/link";
import s from "./MoneyWall.module.css";
import VideoPlay from "./VideoPlay";


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

/**
 * THE FOUR TILES ON THE HOME PAGE ARE CHOSEN HERE, NOT IN BACKSTAGE.
 *
 * This wall used to read library_videos and take the first four by sort, which
 * meant the front page changed shape every time Chris added anything to the
 * library, and the one video he wanted people to see first could be pushed off
 * by a new upload. These four are the pitch, so they are pinned.
 *
 * WHAT THIS COSTS, AND IT IS A REAL COST: editing the library in Backstage no
 * longer changes the home page. /library and every topic page still read the
 * database and still behave exactly as before — this is the home page only.
 * To change what is below, change this list.
 *
 * The last tile is a whole series behind one cover. Playing it runs the nine
 * Loan Process Updates in order, inside the page, with YouTube's own next and
 * previous controls — see playlistId in VideoPlay.
 */
type Tile = { id: string; youtube_id: string; title: string; playlist?: string };

const FEATURE: Tile = {
  id: "mp-2min",
  youtube_id: "tUNYWih9C-8",
  title: "Mortgage Punk in 2 Minutes",
};

const COVERS: Tile[] = [
  {
    id: "adc-vip",
    youtube_id: "u0jK6P4gges",
    // Full title on YouTube is "The American Dream Home Buying Conference | A
    // New Kind of Event (VIP Access)" — too long to set under a square cover.
    title: "The American Dream Conference",
  },
  {
    id: "adc-launch",
    youtube_id: "bVFf3_B8eUQ",
    title: "Before This Gets Big",
  },
  {
    id: "loan-process",
    youtube_id: "ZWJYJ8hCSzQ",
    title: "The Loan Process, Start to Finish",
    playlist: "PLMXmAZ6CDQgqG9JJvMPEtQw7sm-gByPN4",
  },
];

const BELOW = 3;

function Feature({ v }: { v: Tile }) {
  return (
    <div className={s.feature}>
      <VideoPlay
        youtubeId={v.youtube_id}
        title={v.title}
        feature
        playlistId={v.playlist}
        frameClassName={`${s.art} ${s.artFeature}`}
        playClassName={s.play}
      />
    </div>
  );
}

function Cover({ v }: { v: Tile }) {
  return (
    <div className={s.card}>
      <span className={s.tv}>
        <span className={s.tvScreen}>
          <VideoPlay
            youtubeId={v.youtube_id}
            title={v.title}
            playlistId={v.playlist}
            frameClassName={`${s.art} ${s.artCard}`}
            playClassName={s.play}
          />
        </span>
        {/* Over the video, not behind it — the rounded screen corners are
            part of this file's alpha, so the bezel does the clipping. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.tvFrame} src="/brand/tv-frame.webp" alt="" aria-hidden="true" loading="lazy" />
      </span>
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

export default function MoneyWall() {
  const row = COVERS.slice(0, BELOW);
  const empty = Math.max(0, BELOW - row.length);

  return (
    <div className={s.wrap}>
      <Feature v={FEATURE} />

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
