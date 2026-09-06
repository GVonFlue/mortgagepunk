"use client";

// Client component: local list state, rename flow, and save requests.

import { useState } from "react";
import s from "./Backstage.module.css";
import { LIMITS, type LibraryTopic } from "@/lib/content";

/**
 * Topic manager.
 *
 * Renaming is treated as a separate, explicit action rather than "edit the
 * text and save". Videos store topic names as plain strings, so a silent
 * rename would orphan every video that used the old name. The rename endpoint
 * moves them across and reports how many it touched.
 */
export default function TopicsManager({
  initial,
  configured,
  usage,
}: {
  initial: LibraryTopic[];
  configured: boolean;
  usage: Record<string, number>;
}) {
  const [items, setItems] = useState(initial);
  const [draft, setDraft] = useState("");
  const [renaming, setRenaming] = useState<{ id: string; from: string; to: string } | null>(null);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  function flash(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 3000);
  }

  function add() {
    const name = draft.trim();
    if (!name) return;
    if (items.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      return setErr("You already have a topic with that name.");
    }
    setErr("");
    setItems([...items, { id: `tmp-${Date.now()}`, name, sort: items.length + 1 }]);
    setDraft("");
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

  function remove(t: LibraryTopic) {
    const count = usage[t.name] ?? 0;
    if (count > 0) {
      return setErr(
        `${count} ${count === 1 ? "video is" : "videos are"} filed under "${t.name}". ` +
          `Move them first, or rename this topic instead of removing it.`
      );
    }
    setErr("");
    setItems(items.filter((x) => x.id !== t.id));
    setDirty(true);
  }

  async function save() {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/backstage/topics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((t, i) => ({ name: t.name, sort: i + 1 })) }),
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

  async function doRename() {
    if (!renaming) return;
    const to = renaming.to.trim();
    if (!to || to === renaming.from) return setRenaming(null);
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/backstage/topics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: renaming.from, to }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "");

      const next = items.map((t) => (t.id === renaming.id ? { ...t, name: to } : t));
      setItems(next);
      await fetch("/api/backstage/topics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: next.map((t, i) => ({ name: t.name, sort: i + 1 })) }),
      });
      setRenaming(null);
      flash(
        j.moved > 0
          ? `Renamed, and moved ${j.moved} ${j.moved === 1 ? "video" : "videos"} across.`
          : "Renamed."
      );
    } catch (e) {
      setErr(e instanceof Error && e.message ? e.message : "Couldn't rename. Try again.");
    }
    setBusy(false);
  }

  return (
    <>
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Add a topic</h2>
          <span className={s.pill}>{items.length} topics</span>
        </div>
        <div className={s.btnRow}>
          <input
            className={s.input}
            value={draft}
            maxLength={LIMITS.topicName}
            placeholder="e.g. Credit and Scores"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            style={{ flex: 1, minWidth: 240 }}
          />
          <button type="button" className={`${s.btn} ${s.btnGhost}`} onClick={add}>
            Add
          </button>
        </div>
        <p className={s.help} style={{ marginTop: 10 }}>
          Topics are the filter chips on the library page. Keep them short —
          they sit in a row and long names wrap badly.
        </p>
      </div>

      {err && <div className={s.loginErr} style={{ marginBottom: 14 }}>{err}</div>}

      <div className={s.cardHead} style={{ marginTop: 26 }}>
        <h2 className={s.cardTitle}>Your topics</h2>
      </div>

      {items.map((t, i) => (
        <div key={t.id} className={s.row} style={{ gridTemplateColumns: "1fr auto" }}>
          <div>
            {renaming?.id === t.id ? (
              <>
                <input
                  className={s.input}
                  value={renaming.to}
                  maxLength={LIMITS.topicName}
                  autoFocus
                  onChange={(e) => setRenaming({ ...renaming, to: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && doRename()}
                />
                <p className={s.help} style={{ marginTop: 8 }}>
                  Every video filed under &ldquo;{renaming.from}&rdquo; moves to the
                  new name automatically.
                </p>
              </>
            ) : (
              <>
                <h3 className={s.rowTitle}>{t.name}</h3>
                <div className={s.rowMeta}>
                  <span className={`${s.pill} ${usage[t.name] ? s.pillGreen : s.pillMuted}`}>
                    {usage[t.name] ?? 0} {usage[t.name] === 1 ? "video" : "videos"}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className={s.rowActions}>
            {renaming?.id === t.id ? (
              <div className={s.btnRow}>
                <button type="button" className={`${s.btn} ${s.btnPrimary}`}
                  onClick={doRename} disabled={busy}>
                  {busy ? "Saving..." : "Save name"}
                </button>
                <button type="button" className={`${s.btn} ${s.btnGhost}`}
                  onClick={() => setRenaming(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div className={s.btnRow}>
                  <button type="button" className={`${s.btn} ${s.btnGhost}`}
                    onClick={() => move(i, -1)} disabled={i === 0}>&uarr;</button>
                  <button type="button" className={`${s.btn} ${s.btnGhost}`}
                    onClick={() => move(i, 1)} disabled={i === items.length - 1}>&darr;</button>
                </div>
                <button type="button" className={`${s.btn} ${s.btnGhost}`}
                  onClick={() => setRenaming({ id: t.id, from: t.name, to: t.name })}
                  disabled={!configured}>
                  Rename
                </button>
                <button type="button" className={`${s.btn} ${s.btnDanger}`}
                  onClick={() => remove(t)}>
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <div className={s.btnRow} style={{ marginTop: 20 }}>
        <button
          type="button"
          className={`${s.btn} ${s.btnPrimary}`}
          onClick={save}
          disabled={busy || !configured || !dirty}
        >
          {busy ? "Saving..." : dirty ? "Save order and additions" : "Saved"}
        </button>
        {dirty && configured && <span className={s.help}>You have unsaved changes.</span>}
      </div>

      {toast && <div className={s.toast}>{toast}</div>}
    </>
  );
}
