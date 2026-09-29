import Link from "next/link";
import Image from "next/image";
import s from "./SocialWall.module.css";

/**
 * The Movement — a wall of Instagram posts at mixed sizes.
 *
 * WHY THESE ARE STATIC RIGHT NOW: pulling a live Instagram feed needs a Meta
 * app, a long-lived access token and a refresh job, because the tokens expire
 * every 60 days. That is its own piece of work and it would block this layout
 * from being seen at all. So the grid is real and the tiles are real
 * photography — swapping the source for a live feed later touches this one
 * component and nothing else.
 *
 * EVERY TILE LINKS TO THE PROFILE, not to an individual post. These are
 * stand-in photographs rather than real posts, so there is no per-post
 * permalink to send anyone to; the profile is the only honest destination.
 * When the live feed lands, each tile gets its own post URL and this constant
 * becomes the fallback.
 *
 * SHAPES ARE SQUARE OR PORTRAIT ONLY. Instagram never posts landscape, so a
 * wall containing wide tiles can't read as a feed however good it looks. The
 * column masonry lets each tile keep its true shape and stack at its natural
 * height, which is what a real feed does.
 */

const INSTAGRAM = "https://www.instagram.com/mortgagepunk";

type Tile = { src: string; alt: string; shape: "square" | "portrait" | "tallish" | "reel" };

const TILES: Tile[] = [
  { src: "/brand/adc-stage-crowd.jpg", alt: "Chris on stage at the conference", shape: "reel" },
  { src: "/brand/adc-concert.jpg", alt: "Live music closing the conference", shape: "square" },
  { src: "/brand/adc-phone.jpg", alt: "An attendee filming the keynote", shape: "portrait" },
  { src: "/brand/adc-panel.jpg", alt: "Panel session on stage", shape: "tallish" },
  { src: "/brand/chris-stage.jpg", alt: "Chris mid-keynote", shape: "portrait" },
  { src: "/brand/adc-education.jpg", alt: "Breakout session", shape: "square" },
  { src: "/brand/adc-interview.jpg", alt: "Chris interviewing on stage", shape: "reel" },
  { src: "/brand/adc-stageset.jpg", alt: "The stage before doors", shape: "tallish" },
  { src: "/brand/adc-stage-crowd.jpg", alt: "From the back of the room", shape: "portrait" },
  { src: "/brand/adc-concert.jpg", alt: "The band mid-set", shape: "square" },
  { src: "/brand/chris-stage.jpg", alt: "Keynote close", shape: "tallish" },
  { src: "/brand/adc-education.jpg", alt: "Clarity, strategy, confidence", shape: "portrait" },
];

export default function SocialWall() {
  return (
    <div className={s.wrap}>
      <div className={s.grid}>
        {TILES.map((t, i) => (
          <a
            key={t.src + i}
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className={`${s.tile} ${s[t.shape]}`}
            aria-label={`${t.alt} — open Mortgage Punk on Instagram`}
          >
            <Image
              src={t.src}
              alt={t.alt}
              width={1200}
              height={1200}
              sizes="(max-width: 700px) 50vw, 25vw"
            />
          </a>
        ))}
      </div>

      <Link href="/movement" className={s.cta}>
        Join the movement <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
