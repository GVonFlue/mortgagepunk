import Link from "next/link";
import s from "../Site.module.css";
import Statement, { Kicker } from "../brand/Statement";
import { getTestimonials } from "@/lib/db";

/**
 * Three testimonials on a light band, linking to the full page.
 *
 * Renders NOTHING when there are no published ones. An empty proof section is
 * worse than no proof section — placeholder quotes on a lending site would be
 * both obvious and, since these are real named people, not something to fake.
 */
export default async function Testimonials() {
  const items = await getTestimonials({ publishedOnly: true, featuredOnly: true });
  if (items.length === 0) return null;

  return (
    <section className={`${s.sec} ${s.bone}`} aria-label="What clients say">
      <div className={s.wrap}>
        <div className={s.libhead}>
          <div>
            <Kicker>Real people</Kicker>
            <Statement
              onLight
              lines={[
                { t: "Don't take", size: "md", tone: "ink" },
                { t: "our word", size: "xl", tone: "ink" },
                { t: "for it.", size: "xl", tone: "red" },
              ]}
            />
          </div>
          <Link href="/testimonials" className={`${s.btn} ${s.btnGhost}`}>
            Read them all &rarr;
          </Link>
        </div>

        <div className={s.tGrid}>
          {items.slice(0, 3).map((t) => (
            <figure key={t.id} className={s.tCard}>
              <div className={s.tStars} aria-label={`${t.rating} out of 5`}>
                {"\u2605".repeat(t.rating)}
              </div>
              <blockquote className={s.tQuote}>{t.quote}</blockquote>
              <figcaption className={s.tWho}>
                <span className={s.tName}>{t.name}</span>
                {t.role && <span className={s.tRole}>{t.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
