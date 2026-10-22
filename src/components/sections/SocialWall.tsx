import Link from "next/link";
import Image from "next/image";
import s from "./SocialWall.module.css";
import SnakeGrid from "./SnakeGrid";
import { getSocialTiles } from "@/lib/db";
import { INSTAGRAM_PROFILE, type WallShape } from "@/lib/socialTiles";

/**
 * The Movement — a wall of Instagram posts at mixed sizes.
 *
 * CHRIS PICKS THESE IN BACKSTAGE → Movement wall: upload a picture, paste
 * the post's link, choose its shape, drag it into place, hide or show it. The
 * tiles come from the social_tiles table, and until that exists the wall is
 * the seed set in lib/socialTiles.ts — the wall exactly as it first shipped.
 * Why hand-picked rather than a live Instagram feed is explained there.
 *
 * EACH TILE OPENS ITS OWN POST when it has a link, and the profile when it
 * doesn't. The first delivery was a folder of exports with no permalinks, so
 * every tile opened the profile; links are filled in as they are found.
 *
 * WHAT FOLLOWS IS HOW THE SEED SET WAS CHOSEN, and the same rules are worth
 * keeping when the wall is edited.
 *
 * ---------------------------------------------------------------------------
 * THE DUPLICATES ARE GONE. The first version of this wall ran twelve tiles off
 * eight photographs — adc-stage-crowd, adc-concert, chris-stage and
 * adc-education each appeared twice under different captions, which is the
 * sort of thing nobody notices until they do, and then it is all they see.
 *
 * Two more were dropped on the way in. The delivered folder contained the same
 * post twice in two crops: "Your paycheck isn't the playbook" and "Own it"
 * each arrived as both a 9:16 story and a square. The squares are kept — the
 * set is otherwise 22 verticals out of 30, and a wall of one shape stops
 * reading as a feed.
 *
 * SHAPE IS CHOSEN TO MATCH THE SOURCE, NOT TO FILL A SLOT. These are mostly
 * lettered graphics rather than photographs, and the lettering IS the content,
 * so a tile whose declared ratio disagrees with its file gets its headline
 * cropped off by object-fit. Each seed entry takes the ratio nearest its own
 * file. The event photographs are the exception: they are real photography and
 * crop happily, so they take whatever shape the rhythm needs.
 *
 * THE ORDER IS INTERLEAVED ON PURPOSE. Shapes are distributed rather than
 * grouped — in a column masonry, each ratio is a distinct tile HEIGHT, and
 * runs of one height make the columns line up into rows, which is the exact
 * grid look this layout exists to avoid. Roughly every third tile is a
 * non-reel. Reordering is free; clustering the shapes is not.
 */

/* The box enforces the ratio, so these are the rendered shape rather than the
   file's own pixels — they exist to give next/image an aspect hint and to stop
   it guessing. `sizes` is what actually drives the srcset. */
const DIMS: Record<WallShape, [number, number]> = {
  reel: [720, 1280],
  tallish: [900, 1200],
  portrait: [1000, 1250],
  square: [1000, 1000],
};

/* Six columns on a wide monitor down to two on a phone — so the tile is never
   wider than about a fifth of the viewport except on a phone. Without this the
   browser assumes full width and fetches a file several times larger than the
   slot it lands in, on every one of thirty-six tiles. */
const SIZES =
  "(max-width:700px) 50vw, (max-width:980px) 34vw, (max-width:1280px) 25vw, (max-width:1600px) 20vw, 17vw";

export default async function SocialWall() {
  const tiles = await getSocialTiles({ visibleOnly: true });
  return (
    <div className={s.wrap}>
      {/* SnakeGrid works out where each tile landed so the scroll animation
          can sweep each row — see SnakeGrid.tsx. */}
      <SnakeGrid className={s.grid}>
        {tiles.map((t, i) => {
          const [w, h] = DIMS[t.shape] ?? DIMS.reel;
          return (
            <a
              key={t.id}
              href={t.href || INSTAGRAM_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className={`${s.tile} ${s[t.shape]}`}
              aria-label={
                t.href
                  ? `${t.alt} — open this post on Instagram`
                  : `${t.alt} — open Mortgage Punk on Instagram`
              }
            >
              <Image
                src={t.src}
                alt={t.alt}
                width={w}
                height={h}
                sizes={SIZES}
                /* The first row is above the fold on a tall screen; the rest
                   are not, and thirty-six eager images would be the heaviest
                   thing on the page by a wide margin. */
                loading={i < 6 ? "eager" : "lazy"}
              />
            </a>
          );
        })}
      </SnakeGrid>

      <Link href="/movement" className={s.cta}>
        Join the movement <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
