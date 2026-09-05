"use client";

// Client component: local list state and inline editing.

import { useState } from "react";
import s from "./Backstage.module.css";
import { Field, Area, Select } from "./Field";

export type Item = {
  id: string;
  title: string;
  blurb: string;
  tag: string;
  pending: boolean;
};

/**
 * Shared editor for the simple ordered lists — press items and speaking
 * topics. Both are "title + blurb + optional tag, in an order", so one
 * component covers them and there is only one place to fix a bug.
 */
export default function ListEditor({
  kind, initial, titleLabel, blurbLabel, titleMax, blurbMax,
  tagOptions, allowPending = false, addLabel, configured,
}: {
  kind: string;
  initial: Item[];
  titleLabel: string;
  blurbLabel: string;
  titleMax: number;
  blurbMax: number;
  tagOptions?: string[];
  allowPending?: boolean;
  addLabel: string;
  configured: boolean;
}) {
  const [items, setItems] = useState<Item[]>(initial);
  const [draft, setDraft] = useState<Item>({
    id: "", title: "", blurb: "", tag: tagOptions?.[0] ?? "", pending: false,
  });
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");

  function flash(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2400);
  }

  function add() {
    if (!draft.title.trim()) return setErr(`${titleLabel} can't be empty.`);
    if (!draft.blurb.trim()) return setErr(`${blurbLabel} can't be empty.`);
    setErr("");
    setItems([...items, { ...draft, id: `tmp-${Date.now()}` }]);
    setDraft({ id: "", title: "", blurb: "", tag: tagOptions?.[0] ?? "", pending: false });
    flash(configured ? "Added." : "Added in preview — not saved.");
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  }

  return (
    <>
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>{addLabel}</h2>
        </div>

        <div className={tagOptions ? s.grid2 : undefined}>
          <Field
            label={titleLabel}
            value={draft.title}
            onChange={(v) => setDraft({ ...draft, title: v })}
            max={titleMax}
          />
          {tagOptions && (
            <Select
              label="Type"
              value={draft.tag}
              onChange={(v) => setDraft({ ...draft, tag: v })}
              options={tagOptions}
            />
          )}
        </div>

        <Area
          label={blurbLabel}
          value={draft.blurb}
          onChange={(v) => setDraft({ ...draft, blurb: v })}
          max={blurbMax}
        />

        {allowPending && (
          <label className={s.pill} style={{ cursor: "pointer", display: "inline-flex", marginBottom: 14 }}>
            <input
              type="checkbox"
              checked={draft.pending}
              onChange={(e) => setDraft({ ...draft, pending: e.target.checked })}
              style={{ marginRight: 7, accentColor: "#EB2933" }}
            />
            Unverified — keep it off the public site
          </label>
        )}

        {err && <div className={s.loginErr} style={{ marginBottom: 14 }}>{err}</div>}

        <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={add}>
          {addLabel}
        </button>
      </div>

      <div className={s.cardHead} style={{ marginTop: 26 }}>
        <h2 className={s.cardTitle}>Current list ({items.length})</h2>
      </div>

      {items.length === 0 ? (
        <div className={s.empty}>Nothing here yet.</div>
      ) : (
        items.map((it, i) => (
          <div key={it.id} className={s.row} style={{ gridTemplateColumns: "1fr auto" }}>
            <div>
              <h3 className={s.rowTitle}>{it.title}</h3>
              <p className={s.rowBlurb}>{it.blurb}</p>
              <div className={s.rowMeta}>
                {it.tag && <span className={s.pill}>{it.tag}</span>}
                <span className={`${s.pill} ${it.pending ? s.pillMuted : s.pillGreen}`}>
                  {it.pending ? "Hidden — unverified" : "Live"}
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
              {allowPending && (
                <button type="button" className={`${s.btn} ${s.btnGhost}`}
                  onClick={() => setItems(items.map((x) =>
                    x.id === it.id ? { ...x, pending: !x.pending } : x))}>
                  {it.pending ? "Mark verified" : "Mark unverified"}
                </button>
              )}
              <button type="button" className={`${s.btn} ${s.btnDanger}`}
                onClick={() => { setItems(items.filter((x) => x.id !== it.id)); flash("Removed."); }}>
                Remove
              </button>
            </div>
          </div>
        ))
      )}

      {toast && <div className={s.toast}>{toast}</div>}
      <input type="hidden" name="kind" value={kind} />
    </>
  );
}
