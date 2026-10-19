import Link from "next/link";
import Image from "next/image";
import s from "./SocialWall.module.css";

/**
 * The Movement — a wall of Instagram posts at mixed sizes.
 *
 * WHY THESE ARE STATIC RIGHT NOW: pulling a live Instagram feed needs a Meta
 * app, a long-lived access token and a refresh job, because the tokens expire
 * every 60 days. That is its own piece of work and it would block this layout
 * from being seen at all. So the grid is real and the tiles are real posts —
 * swapping the source for a live feed later touches this one component and
 * nothing else.
 *
 * EVERY TILE LINKS TO THE PROFILE, not to an individual post. The artwork was
 * delivered as a folder of exports with no permalinks attached, so the profile
 * is the only honest destination. When the live feed lands, each tile gets its
 * own post URL and this constant becomes the fallback.
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
 * cropped off by object-fit. Each entry below takes the ratio nearest its own
 * file. The event photographs are the exception: they are real photography and
 * crop happily, so they take whatever shape the rhythm needs.
 *
 * THE ORDER IS INTERLEAVED ON PURPOSE. Shapes are distributed rather than
 * grouped — in a column masonry, each ratio is a distinct tile HEIGHT, and
 * runs of one height make the columns line up into rows, which is the exact
 * grid look this layout exists to avoid. Roughly every third tile is a
 * non-reel. Reordering is free; clustering the shapes is not.
 */

const INSTAGRAM = "https://www.instagram.com/mortgagepunk";

type Shape = "square" | "portrait" | "tallish" | "reel";
type Tile = { src: string; alt: string; shape: Shape };

/* The box enforces the ratio, so these are the rendered shape rather than the
   file's own pixels — they exist to give next/image an aspect hint and to stop
   it guessing. `sizes` is what actually drives the srcset. */
const DIMS: Record<Shape, [number, number]> = {
  reel: [720, 1280],
  tallish: [900, 1200],
  portrait: [1000, 1250],
  square: [1000, 1000],
};

const S = "/brand/social/";

const TILES: Tile[] = [
  { src: S + "adc-movement-poster.jpg", alt: "American Dream Conference poster: the American Dream isn't a memory, it's a movement", shape: "reel" },
  { src: "/brand/adc-concert.jpg", alt: "Live music closing the conference", shape: "square" },
  { src: S + "portrait-red.jpg", alt: "Chris in red light, straightening his collar", shape: "reel" },
  { src: S + "whats-your-next-move.jpg", alt: "What's your next move? The Game of Money", shape: "reel" },
  { src: S + "lender-lies-01.jpg", alt: "Lender Lies number one: the $12,000 free refinance", shape: "tallish" },
  { src: S + "so-it-sucked-less.jpg", alt: "So it sucked less? Chris and a guest mid-conversation", shape: "reel" },
  { src: S + "review-five-star.jpg", alt: "A client review of working with Chris and the Mortgage Punk team", shape: "portrait" },
  { src: S + "lender-lies-02.jpg", alt: "Lender Lies number two: why is my lender ghosting me?", shape: "reel" },
  { src: S + "nobody-came-for-a-mortgage.jpg", alt: "Nobody came here for a mortgage — Chris on the mic", shape: "reel" },
  { src: "/brand/adc-panel.jpg", alt: "Panel session on stage", shape: "tallish" },
  { src: S + "thank-you-wichita.jpg", alt: "Thank you, Wichita — same energy in 2027?", shape: "reel" },
  { src: S + "seventy-k-first-home.jpg", alt: "How they got $70,000 to buy their first home", shape: "reel" },
  { src: S + "own-it.jpg", alt: "Own it: you don't have to inherit someone else's definition of the American Dream", shape: "square" },
  { src: S + "podcast-kash-nancy-shih.jpg", alt: "The Mortgage Punk Show: Achieve K.A.S.H. to make more cash, with Nancy Shih", shape: "reel" },
  { src: "/brand/adc-phone.jpg", alt: "An attendee filming the keynote", shape: "portrait" },
  { src: S + "american-dream-tee.jpg", alt: "American Dream tee: own it, beyond a paycheck", shape: "reel" },
  { src: S + "client-story-nothing-to-lose.jpg", alt: "Client story: five years ago he had nothing to lose", shape: "reel" },
  { src: S + "not-everything-needs-a-strategy.jpg", alt: "Not everything needs a strategy", shape: "tallish" },
  { src: "/brand/adc-stage-crowd.jpg", alt: "Chris on stage at the conference, room full", shape: "reel" },
  { src: S + "paycheck-isnt-the-playbook.jpg", alt: "Your paycheck isn't the playbook", shape: "square" },
  { src: S + "problems-start-at-preapproval.jpg", alt: "Most mortgage problems start at pre-approval", shape: "reel" },
  { src: S + "what-does-freedom-mean.jpg", alt: "What does freedom actually mean? Live at Backstage Pass", shape: "reel" },
  { src: S + "vote-punk-best-of-wichita.jpg", alt: "Vote Punk — Best of Wichita 2026, home mortgage and financial education", shape: "portrait" },
  { src: S + "one-closing-three-wins.jpg", alt: "One closing, three wins: home equity, debt paid off, startup capital", shape: "reel" },
  { src: S + "game-of-money-chapter-02.jpg", alt: "The Game of Money, chapter two: I've failed, I'm still learning", shape: "tallish" },
  { src: S + "never-too-late-to-learn.jpg", alt: "Real people, real conversations — it's never too late to learn the game", shape: "reel" },
  { src: S + "american-dream-rewrite.jpg", alt: "The American Dream: the freedom and opportunity to rewrite your story", shape: "reel" },
  { src: "/brand/adc-education.jpg", alt: "Breakout session at the conference", shape: "square" },
  { src: S + "ninety-to-a-million.jpg", alt: "$90 to $1,000,000? The Suck Less Mortgage Process", shape: "reel" },
  { src: "/brand/chris-stage.jpg", alt: "Chris mid-keynote", shape: "portrait" },
  { src: S + "recruit-at-restaurants.jpg", alt: "I recruit at restaurants — podcast interview", shape: "reel" },
  { src: S + "show-sponsor-kihle.jpg", alt: "The Mortgage Punk Show, sponsored by Kihle Roofing and Construction", shape: "reel" },
  { src: S + "freedom-on-your-own-terms.jpg", alt: "The American Dream was never about having it all — it was about the freedom to build a life on your own terms", shape: "tallish" },
  { src: S + "explanation-didnt-fail.jpg", alt: "The American Dream didn't fail. The explanation did.", shape: "reel" },
  { src: "/brand/adc-stageset.jpg", alt: "The stage before doors", shape: "tallish" },
  { src: "/brand/adc-interview.jpg", alt: "Chris interviewing on stage", shape: "reel" },
];

/* Six columns on a wide monitor down to two on a phone — so the tile is never
   wider than about a fifth of the viewport except on a phone. Without this the
   browser assumes full width and fetches a file several times larger than the
   slot it lands in, on every one of thirty-six tiles. */
const SIZES =
  "(max-width:700px) 50vw, (max-width:980px) 34vw, (max-width:1280px) 25vw, (max-width:1600px) 20vw, 17vw";

export default function SocialWall() {
  return (
    <div className={s.wrap}>
      <div className={s.grid}>
        {TILES.map((t, i) => {
          const [w, h] = DIMS[t.shape];
          return (
            <a
              key={t.src}
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className={`${s.tile} ${s[t.shape]}`}
              aria-label={`${t.alt} — open Mortgage Punk on Instagram`}
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
      </div>

      <Link href="/movement" className={s.cta}>
        Join the movement <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
