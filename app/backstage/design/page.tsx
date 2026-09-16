import Shell from "@/components/backstage/Shell";
import s from "@/components/backstage/Backstage.module.css";
import { ART_SLOTS, PHOTO_SLOTS, BRAND, STAGE, CHRIS } from "@/lib/design-specs";

export const metadata = {
  title: "Design specs — Backstage",
  robots: { index: false, follow: false },
};

/**
 * Design specs, rendered from lib/design-specs.ts rather than written out by
 * hand. A spec doc drifts the first time anyone nudges a number; this reads
 * from the same values the layout uses, so it cannot go stale.
 *
 * Written for a designer, not a developer — no CSS, no units they'd have to
 * translate, and the occlusion shown as a picture rather than described.
 */
export default function DesignPage() {
  const slot = ART_SLOTS[0];

  // to-scale diagram of the hero stage: art slot, and where Chris covers it
  const S = 620 / STAGE.w;
  const box = {
    x: 38 * S,
    y: 96 * S,
    w: slot.w * S,
    h: slot.h * S,
  };
  const chris = {
    x: CHRIS.left * S,
    y: CHRIS.top * S,
    w: (CHRIS.right - CHRIS.left) * S,
    h: (CHRIS.bottom - CHRIS.top) * S,
  };

  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Design specs</h1>
          <p className={s.sub}>
            Everything a designer needs to make artwork that drops straight in.
            These numbers come from the live layout, so they are always current
            — send this page rather than writing a brief.
          </p>
        </div>
      </div>

      {/* ---------- the diagram ---------- */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Where the headline sits</h2>
          <span className={s.pill}>To scale</span>
        </div>

        <svg viewBox={`0 0 620 ${STAGE.h * S}`} className={s.specDiagram}
          role="img" aria-label="Diagram of the hero showing the artwork area and where Chris covers it">
          <rect x="0" y="0" width="620" height={STAGE.h * S} fill="#141414" rx="6" />

          {/* the art slot */}
          <rect x={box.x} y={box.y} width={box.w} height={box.h}
            fill="rgba(235,41,51,.14)" stroke="#EB2933" strokeWidth="1.5"
            strokeDasharray="5 4" rx="3" />
          <text x={box.x + 10} y={box.y + 22} className={s.specLabel} fill="#EB2933">
            YOUR ARTWORK
          </text>
          <text x={box.x + 10} y={box.y + 40} className={s.specDim} fill="#EB2933">
            {slot.w} × {slot.h}
          </text>

          {/* Chris, drawn on top because that's what he does */}
          <rect x={chris.x} y={chris.y} width={chris.w} height={chris.h}
            fill="rgba(255,255,255,.11)" stroke="rgba(255,255,255,.4)"
            strokeWidth="1.5" rx="3" />
          <text x={chris.x + 10} y={chris.y + 22} className={s.specLabel} fill="#C4C4C4">
            CHRIS
          </text>
          <text x={chris.x + 10} y={chris.y + 40} className={s.specDim} fill="#8E8E8E">
            in front
          </text>

          {/* the fold where the buttons start */}
          <line x1="0" y1={640 * S} x2="620" y2={640 * S}
            stroke="#E0A84C" strokeWidth="1" strokeDasharray="3 3" />
          <text x="8" y={640 * S - 7} className={s.specDim} fill="#E0A84C">
            buttons start here — artwork is capped above this line
          </text>
        </svg>

        <p className={s.help} style={{ marginTop: 14 }}>
          The right-hand portion of the artwork sits behind Chris. Keep anything
          that has to be read in the left {slot.occluded?.fromX}% of the canvas.
        </p>
      </div>

      {/* ---------- artwork slots ---------- */}
      {ART_SLOTS.map((a) => (
        <div key={a.id} className={s.card}>
          <div className={s.cardHead}>
            <h2 className={s.cardTitle}>{a.name}</h2>
            <span className={`${s.pill} ${s.pillRed}`}>
              {a.exportW} × {a.exportH}
            </span>
          </div>
          <p className={s.sub} style={{ margin: "0 0 16px" }}>{a.where}</p>

          <dl className={s.specTable}>
            <div>
              <dt>Design at</dt>
              <dd>{a.w} × {a.h} px</dd>
            </div>
            <div>
              <dt>Export at</dt>
              <dd>{a.exportW} × {a.exportH} px (3×)</dd>
            </div>
            <div>
              <dt>Aspect ratio</dt>
              <dd>{(a.w / a.h).toFixed(2)} : 1</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>{a.format}</dd>
            </div>
            <div>
              <dt>Max file size</dt>
              <dd>6 MB</dd>
            </div>
          </dl>

          <ul className={s.specNotes}>
            {a.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* ---------- photography ---------- */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Photography still needed</h2>
        </div>
        <dl className={s.specTable}>
          {PHOTO_SLOTS.map((p) => (
            <div key={p.id}>
              <dt>{p.name}</dt>
              <dd>
                {p.ratio} &middot; {p.exportW}px wide
                <span className={s.specWhere}>{p.where}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ---------- brand ---------- */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Colours</h2>
        </div>
        <div className={s.swatches}>
          {BRAND.colors.map((c) => (
            <div key={c.hex} className={s.swatch}>
              <span className={s.swatchChip} style={{ background: c.hex }} />
              <div>
                <strong>{c.name}</strong>
                <code>{c.hex}</code>
                <span>{c.use}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Type &amp; rules</h2>
        </div>
        <dl className={s.specTable}>
          {BRAND.fonts.map((f) => (
            <div key={f.name}>
              <dt>{f.name}</dt>
              <dd>{f.use}</dd>
            </div>
          ))}
        </dl>
        <ul className={s.specNotes} style={{ marginTop: 16 }}>
          {BRAND.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
