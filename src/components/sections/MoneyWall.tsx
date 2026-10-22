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
type Tile = { id: string; youtube_id: string; title: string; playlist?: string; poster?: string };

const FEATURE: Tile = {
  id: "mp-2min",
  youtube_id: "tUNYWih9C-8",
  title: "Mortgage Punk in 2 Minutes",
  /* OURS, NOT YOUTUBE'S. This upload has no maxresdefault — YouTube answers
     with a 120x90 placeholder — so the best it can give the widest image on
     the page is a 640x480 file stretched across 1520px. This is sharp, on
     brand, and does not wait on anyone editing YouTube. If a custom
     thumbnail is ever uploaded there, delete this line and the wall goes
     back to following YouTube. */
  poster: "/brand/thumb-mp-2min.jpg",
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
    id: "long-game",
    youtube_id: "o1O8UO7dHo0",
    // "Homeownership Is the Long Game (And Why Most People Miss It)" on
    // YouTube. Shortened here for the same reason as the conference tile
    // above: the full title does not set under a cover without wrapping to
    // three lines.
    title: "Homeownership Is the Long Game",
  },
  {
    id: "loan-process",
    youtube_id: "ZWJYJ8hCSzQ",
    title: "The Loan Process, Start to Finish",
    playlist: "PLMXmAZ6CDQgqG9JJvMPEtQw7sm-gByPN4",
  },
];

const BELOW = 3;

/**
 * THE TWO WRAPPERS AROUND THE FEATURE ARE THE SCROLL HOLD.
 *
 * featureHold is a tall block; featureStick is one viewport tall and sticks
 * to the top of it. The set therefore locks in the middle of the screen for
 * the extra height of the hold, assembles while it is locked, and releases
 * when the hold runs out and the covers rise underneath.
 *
 * Both are plain blocks with no styling of their own until the stylesheet
 * turns the hold on, and it only does that where scroll-driven animations
 * are supported and motion is wanted. Everywhere else this markup is two
 * divs that do nothing, which is the whole point — the layout cannot be
 * changed by a feature the browser cannot run.
 */
function Feature({ v }: { v: Tile }) {
  return (
   <div className={s.featureHold}>
    <div className={s.featureStick}>
    <div className={s.feature}>
      {/* THE SET IS PHONE-ONLY HERE, and the markup carries it at every width
          because the breakpoint is CSS's business, not React's. Above 760px
          .tvFeature unwinds all of this back to a plain 16:9 frame — see the
          note in MoneyWall.module.css for why the big one does not get a
          television on a laptop. */}
      <span className={`${s.tv} ${s.tvFeature}`}>
        <span className={s.tvScreen}>
          <VideoPlay
            youtubeId={v.youtube_id}
            title={v.title}
            feature
            playlistId={v.playlist}
            poster={v.poster}
            frameClassName={`${s.art} ${s.artFeature}`}
            playClassName={s.play}
          />
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.tvFrame} src="/brand/tv-frame.webp" alt="" aria-hidden="true" />
        {/* Drawn, not typeset. The first version set this in Anton and it
            read as generic broadcast — the brand's character is in the
            hand-cut ransom lettering, not in its supporting typeface. */}
        <span className={`${s.tvBadge} ${s.tvBadgeAct}`} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wordmark-opening-act.webp" alt="" />
        </span>
      </span>
    </div>
    </div>
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
            poster={v.poster}
            frameClassName={`${s.art} ${s.artCard}`}
            playClassName={s.play}
          />
        </span>
        {/* Over the video, not behind it — the rounded screen corners are
            part of this file's alpha, so the bezel does the clipping. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.tvFrame} src="/brand/tv-frame.webp" alt="" aria-hidden="true" loading="lazy" />
        {/* The channel bug on the bezel: the mark plus TV, so a row of these
            reads as Mortgage Punk TV. aria-hidden because it is branding on
            a picture of a television, not information — the video's real
            title is the h3 below. */}
        {/* One drawn lockup rather than the logo with a typeset TV beside it,
            for the same reason as Opening Act above: the TV has to be brush
            lettered in the logo's own hand or it reads as a font parked next
            to a drawing. */}
        <span className={s.tvBadge} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mp-tv.webp" alt="" loading="lazy" />
        </span>
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
