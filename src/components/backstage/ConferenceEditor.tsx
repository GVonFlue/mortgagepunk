"use client";

// Client component: form state for the conference card.

import { useState } from "react";
import s from "./Backstage.module.css";
import { Field, Area } from "./Field";
import type { Conference } from "@/lib/content";

export default function ConferenceEditor({
  initial, configured,
}: {
  initial: Conference;
  configured: boolean;
}) {
  const [c, setC] = useState<Conference>(initial);
  const [toast, setToast] = useState("");

  const set = <K extends keyof Conference>(k: K, v: Conference[K]) =>
    setC({ ...c, [k]: v });

  function save() {
    setToast(configured ? "Saved." : "Preview only — not saved.");
    setTimeout(() => setToast(""), 2600);
  }

  return (
    <>
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>The next event</h2>
        </div>
        <div className={s.grid2}>
          <Field label="Headline" value={c.headline}
            onChange={(v) => set("headline", v)} max={44} />
          <Field label="Date" value={c.date_label}
            onChange={(v) => set("date_label", v)} max={30}
            help="Written how you want it read, e.g. October 16, 2027" />
        </div>
        <div className={s.grid2}>
          <Field label="Venue" value={c.venue}
            onChange={(v) => set("venue", v)} max={54} />
          <Field label="Keynote" value={c.keynote}
            onChange={(v) => set("keynote", v)} max={40} />
        </div>
        <Area label="One line on what it is" value={c.blurb}
          onChange={(v) => set("blurb", v)} max={170} />
        <Field label="Tickets link" value={c.url}
          onChange={(v) => set("url", v)}
          help="Where the Conference details button goes." />
      </div>

      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>The three numbers</h2>
        </div>
        <p className={s.help} style={{ marginTop: -8, marginBottom: 16 }}>
          These render as the big red stat tiles. Keep the values to a couple of
          characters — they are set at poster size.
        </p>
        <div className={s.grid3}>
          {c.stats.map((st, i) => (
            <div key={i}>
              <Field label={`Number ${i + 1}`} value={st.value} max={4}
                onChange={(v) => {
                  const next = [...c.stats];
                  next[i] = { ...next[i], value: v };
                  set("stats", next);
                }} />
              <Field label="Label" value={st.label} max={18}
                onChange={(v) => {
                  const next = [...c.stats];
                  next[i] = { ...next[i], label: v };
                  set("stats", next);
                }} />
            </div>
          ))}
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Giveaways</h2>
        </div>
        {c.prizes.map((p, i) => (
          <div key={i} className={s.btnRow} style={{ marginBottom: 10 }}>
            <input className={s.input} value={p} maxLength={60}
              onChange={(e) => {
                const next = [...c.prizes];
                next[i] = e.target.value;
                set("prizes", next);
              }} />
            <button type="button" className={`${s.btn} ${s.btnDanger}`}
              onClick={() => set("prizes", c.prizes.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className={`${s.btn} ${s.btnGhost}`}
          onClick={() => set("prizes", [...c.prizes, ""])}>
          Add a giveaway
        </button>
      </div>

      <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={save}>
        Save the conference
      </button>

      {toast && <div className={s.toast}>{toast}</div>}
    </>
  );
}
