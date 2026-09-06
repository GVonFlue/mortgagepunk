import Link from "next/link";
import s from "../Site.module.css";

export type FaqItem = { q: string; a: string };
export type Block = { n: string; h: string; p: string };

/**
 * Shared body for the three lending sub-pages.
 *
 * Buy, refinance and invest differ in content, not in shape — each one is
 * "who it's for, what you need, what it costs you in time, and the questions
 * everyone actually asks". One component means a fix lands on all three.
 */
export default function DeepPage({
  kicker,
  forWho,
  blocks,
  needList,
  timeline,
  faqs,
}: {
  kicker: string;
  forWho: string;
  blocks: Block[];
  needList: string[];
  timeline: { when: string; what: string }[];
  faqs: FaqItem[];
}) {
  return (
    <>
      <section className={`${s.sec} ${s.ink}`}>
        <div className={s.wrap}>
          <div className={s.kick}>{kicker}</div>
          <p className={s.lede} style={{ fontSize: "clamp(17px,1.5vw,24px)", color: "var(--mp-bone)", maxWidth: "48ch" }}>
            {forWho}
          </p>
          <div className={s.lpaths} style={{ marginTop: "clamp(28px,3vw,46px)" }}>
            {blocks.map((b) => (
              <div key={b.n} className={s.lpath} style={{ minHeight: 0, cursor: "default" }}>
                <div>
                  <div className={s.lpathNo}>{b.n}</div>
                  <h3 style={{ fontSize: "clamp(22px,2.2vw,32px)" }}>{b.h}</h3>
                  <p>{b.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${s.sec} ${s.bone}`}>
        <div className={s.wrap}>
          <div className={s.mv}>
            <div>
              <div className={s.kick}>What you&rsquo;ll need</div>
              <h2 className={s.h2}>
                Everything,
                <br />
                <em>asked once.</em>
              </h2>
              <p className={s.lede}>
                Here is the whole list up front. No drip-feeding requests across
                three weeks — you can have most of this together in an evening.
              </p>
            </div>
            <div>
              <ul className={s.procDo} style={{ gap: 12 }}>
                {needList.map((n) => (
                  <li key={n} style={{ fontSize: 16 }}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={`${s.sec} ${s.dark}`}>
        <div className={s.wrap}>
          <div className={s.kick}>How long it takes</div>
          <h2 className={s.h2}>
            The honest
            <br />
            <em>timeline.</em>
          </h2>
          <div className={s.tl} style={{ marginTop: 36 }}>
            {timeline.map((t) => (
              <div key={t.when} className={s.tlRow}>
                <span className={s.tlWhen}>{t.when}</span>
                <p className={s.tlWhat}>{t.what}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${s.sec} ${s.bone}`}>
        <div className={s.wrap}>
          <div className={s.kick}>Questions people actually ask</div>
          <h2 className={s.h2}>Straight answers.</h2>
          <div style={{ marginTop: 34, maxWidth: "82ch" }}>
            {faqs.map((f) => (
              <details key={f.q} className={s.faq}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div style={{ marginTop: 34 }}>
            <Link href="#start" className={`${s.btn} ${s.btnSolid}`}>
              Start the conversation &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
