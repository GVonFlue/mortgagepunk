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
 * Sizes are deliberately uneven. A uniform grid reads as a gallery; a mixed
 * one reads as a feed, which is the feeling this section is after.
 */

type Tile = { src: string; alt: string; span: "tall" | "wide" | "box" };

const TILES: Tile[] = [
  { src: "/brand/adc-stage-crowd.jpg", alt: "Chris on stage at the conference", span: "tall" },
  { src: "/brand/adc-concert.jpg", alt: "Live music closing the conference", span: "box" },
  { src: "/brand/adc-panel.jpg", alt: "Panel session on stage", span: "wide" },
  { src: "/brand/adc-education.jpg", alt: "Breakout session", span: "box" },
  { src: "/brand/adc-phone.jpg", alt: "An attendee filming the keynote", span: "tall" },
  { src: "/brand/adc-interview.jpg", alt: "Chris interviewing on stage", span: "box" },
  { src: "/brand/adc-stageset.jpg", alt: "The stage before doors", span: "wide" },
  { src: "/brand/chris-stage.jpg", alt: "Chris mid-keynote", span: "box" },
];

export default function SocialWall() {
  return (
    <div className={s.wrap}>
      <div className={s.grid}>
        {TILES.map((t, i) => (
          <figure key={t.src + i} className={`${s.tile} ${s[t.span]}`}>
            <Image
              src={t.src}
              alt={t.alt}
              width={1200}
              height={1200}
              sizes="(max-width: 700px) 50vw, 25vw"
            />
          </figure>
        ))}
      </div>

      <Link href="/movement" className={s.cta}>
        Join the movement <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
