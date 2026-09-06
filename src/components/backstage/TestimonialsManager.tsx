"use client";

// Client component: list state, star picker, and the save request.

import { useState } from "react";
import s from "./Backstage.module.css";
import { Field, Area } from "./Field";
import { LIMITS, type Testimonial } from "@/lib/content";

const BLANK = {
  name: "", role: "", quote: "", rating: 5, featured: false, published: true,
};

function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <span style={{ display: "inline-flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          disabled={!onChange}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          style={{
            background: "none", border: 0, padding: 0,
            cursor: onChange ? "pointer" : "default", lineHeight: 1,
            color: n <= value ? "#EB2933" : "#3A3A3A", fontSize: 17,
          }}
        >
          ★
        </button>
      ))}
    </span>
  );
}

/**
 * Testimonials are regulated marketing claims, so this screen is deliberately
 * cautious: everything starts unpublished, and the list shows plainly which
 * entries are live. Nothing reaches the public site until Chris publishes it.
 */
export default function TestimonialsManager({
  initial, configured,
}: {
  initial: Testimonial[];
  configured: boolean;
}) {
  const [items, setItems] = useState<Testimonial[]>(initial);
  const [draft, setDraft] = useState({ ...BLANK });
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  const featuredCount = items.filter((t) => t.featured && t.published).length;

  function flash(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2600);
  }

  function add() {
    if (!draft.name.trim()) return setErr("Whose words are these?");
    if (!draft.quote.trim()) return setErr("Add the quote.");
    setErr("");
    setItems([
      ...items,
      { ...draft, id: `tmp-${Date.now()}`, sort: items.length + 1 } as Testimonial,
    ]);
    setDraft({ ...BLANK });
    setDirty(true);
  }

  function patch(id: string, k: keyof Testimonial, v: unknown) {
    if (k === "featured" && v === true) {
      const t = items.find((x) => x.id === id);
      if (t && !t.featured && featuredCount >= 3) {
        return setErr("Only three can sit on the homepage. Un-feature one first.");
      }
    }
    setErr("");
    setItems(items.map((x) => (x.id === id ? { ...x, [k]: v } : x)));
    setDirty(true);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    setDirty(true);
  }

  async function save() {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/backstage/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "");
      setDirty(false);
      flash("Saved.");
    } catch (e) {
      setErr(e instanceof Error && e.message ? e.message : "Couldn't save. Try again.");
    }
    setBusy(false);
  }

  return (
    <>
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Add a testimonial</h2>
          <span className={`${s.pill} ${featuredCount >= 3 ? s.pillRed : ""}`}>
            {featuredCount}/3 on homepage
          </span>
        </div>

        <div className={s.grid2}>
          <Field label="Name" value={draft.name} max={LIMITS.testimonialName}
            onChange={(v) => setDraft({ ...draft, name: v })}
            placeholder="Sarah M." />
          <Field label="Who they are" value={draft.role} max={LIMITS.testimonialRole}
            onChange={(v) => setDraft({ ...draft, role: v })}
            placeholder="First-time buyer, Wichita" />
        </div>

        <Area label="What they said" value={draft.quote} max={LIMITS.testimonialQuote}
          onChange={(v) => setDraft({ ...draft, quote: v })}
          help="Their words, not a rewrite. Real ones always sound better than polished ones." />

        <div className={s.field}>
          <span className={s.label}>Rating</span>
          <Stars value={draft.rating} onChange={(n) => setDraft({ ...draft, rating: n })} />
        </div>

        <div className={s.btnRow} style={{ marginBottom: 14 }}>
          <label className={s.pill} style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={draft.featured}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
              style={{ marginRight: 7, accentColor: "#EB2933" }} />
            Show on the homepage
          </label>
          <label className={s.pill} style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              style={{ marginRight: 7, accentColor: "#EB2933" }} />
            Publish
          </label>
        </div>

        {err && <div className={s.loginErr} style={{ marginBottom: 14 }}>{err}</div>}

        <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={add}>
          Add testimonial
        </button>
      </div>

      <div className={s.cardHead} style={{ marginTop: 26 }}>
        <h2 className={s.cardTitle}>All testimonials ({items.length})</h2>
      </div>

      {items.length === 0 ? (
        <div className={s.empty}>Nothing here yet.</div>
      ) : (
        items.map((t, i) => (
          <div key={t.id} className={s.row} style={{ gridTemplateColumns: "1fr auto" }}>
            <div>
              <h3 className={s.rowTitle}>{t.name}</h3>
              <p className={s.rowBlurb} style={{ marginBottom: 8 }}>{t.role}</p>
              <p className={s.rowBlurb} style={{ color: "#B4B4B4" }}>&ldquo;{t.quote}&rdquo;</p>
              <div className={s.rowMeta}>
                <Stars value={t.rating} />
                {t.featured && <span className={`${s.pill} ${s.pillRed}`}>Homepage</span>}
                <span className={`${s.pill} ${t.published ? s.pillGreen : s.pillMuted}`}>
                  {t.published ? "Live" : "Draft"}
                </span>
              </div>
            </div>
            <div className={s.rowActions}>
              <div className={s.btnRow}>
                <button type="button" className={`${s.btn} ${s.btnGhost}`}
                  onClick={() => move(i, -1)} disabled={i === 0}>&uarr;</button>
                <button type="button" className={`${s.btn} ${s.btnGhost}`}
                  onClick={() => move(i, 1)} disabled={i === items.length - 1}>&darr;</button>
              </div>
              <button type="button" className={`${s.btn} ${s.btnGhost}`}
                onClick={() => patch(t.id, "featured", !t.featured)}>
                {t.featured ? "Unfeature" : "Feature"}
              </button>
              <button type="button" className={`${s.btn} ${s.btnGhost}`}
                onClick={() => patch(t.id, "published", !t.published)}>
                {t.published ? "Unpublish" : "Publish"}
              </button>
              <button type="button" className={`${s.btn} ${s.btnDanger}`}
                onClick={() => { setItems(items.filter((x) => x.id !== t.id)); setDirty(true); }}>
                Remove
              </button>
            </div>
          </div>
        ))
      )}

      <div className={s.btnRow} style={{ marginTop: 20 }}>
        <button type="button" className={`${s.btn} ${s.btnPrimary}`}
          onClick={save} disabled={busy || !configured || !dirty}>
          {busy ? "Saving..." : dirty ? "Save changes" : "Saved"}
        </button>
        {dirty && configured && <span className={s.help}>You have unsaved changes.</span>}
      </div>

      {toast && <div className={s.toast}>{toast}</div>}
    </>
  );
}
