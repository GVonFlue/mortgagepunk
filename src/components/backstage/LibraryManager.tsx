"use client";

// Client component: this is the editing surface — local state, validation,
// and save requests.

import { useState } from "react";
import s from "./Backstage.module.css";
import { Field, Area } from "./Field";
import { LIMITS, type Video, type LibraryTopic } from "@/lib/content";
import { youtubeId, thumbnail } from "@/lib/library";

const BLANK = {
  url: "",
  title: "",
  blurb: "",
  topics: [] as string[],
  featured: false,
  published: true,
};

/** Toggle chips. A video can sit in several topics — plenty straddle two. */
function TopicPicker({
  all,
  chosen,
  onToggle,
}: {
  all: LibraryTopic[];
  chosen: string[];
  onToggle: (name: string) => void;
}) {
  return (
    <div className={s.field}>
      <span className={s.label}>
        Topics
        <span className={s.count}>{chosen.length} selected</span>
      </span>
      <div className={s.btnRow}>
        {all.map((t) => {
          const on = chosen.includes(t.name);
          return (
            <button
              key={t.id}
              type="button"
              className={`${s.pill} ${on ? s.pillRed : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => onToggle(t.name)}
            >
              {on ? "\u2713 " : ""}
              {t.name}
            </button>
          );
        })}
      </div>
      <span className={s.help}>
        Pick every topic this fits. It shows under each one on the library page.
      </span>
    </div>
  );
}

export default function LibraryManager({
  initial,
  topics,
  configured,
}: {
  initial: Video[];
  topics: LibraryTopic[];
  configured: boolean;
}) {
  const [videos, setVideos] = useState<Video[]>(initial);
  const [draft, setDraft] = useState({ ...BLANK });
  const [editing, setEditing] = useState<Video | null>(null);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  const vid = youtubeId(draft.url);
  const featuredCount = videos.filter((v) => v.featured).length;

  function flash(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2600);
  }

  function toggleDraftTopic(name: string) {
    setDraft({
      ...draft,
      topics: draft.topics.includes(name)
        ? draft.topics.filter((t) => t !== name)
        : [...draft.topics, name],
    });
  }

  async function add() {
    if (!vid) return setErr("That doesn't look like a YouTube link.");
    if (!draft.title.trim()) return setErr("Give it a title.");
    if (!draft.blurb.trim()) return setErr("Write a couple of sentences.");
    if (draft.topics.length === 0) return setErr("Pick at least one topic.");
    if (draft.featured && featuredCount >= 4) {
      return setErr("Only four videos can sit on the homepage. Un-feature one first.");
    }
    setErr("");
    setBusy(true);

    const row: Video = {
      id: `tmp-${Date.now()}`,
      youtube_id: vid,
      title: draft.title.trim(),
      blurb: draft.blurb.trim(),
      topics: draft.topics,
      featured: draft.featured,
      published: draft.published,
      sort: videos.length + 1,
    };

    if (configured) {
      try {
        const r = await fetch("/api/backstage/library", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row),
        });
        const j = await r.json();
        if (!r.ok || !j.ok) throw new Error(j.error || "");
        row.id = j.video.id;
      } catch (e) {
        setBusy(false);
        return setErr(
          e instanceof Error && e.message ? e.message : "Couldn't save that. Try again."
        );
      }
    }

    setVideos([...videos, row]);
    setDraft({ ...BLANK });
    setBusy(false);
    flash(configured ? "Added." : "Added in preview \u2014 not saved.");
  }

  async function saveEdit() {
    if (!editing) return;
    if (!editing.title.trim()) return setErr("Title can't be empty.");
    if (!editing.blurb.trim()) return setErr("Blurb can't be empty.");
    if (editing.topics.length === 0) return setErr("Pick at least one topic.");
    setErr("");
    setBusy(true);

    if (configured) {
      try {
        const r = await fetch("/api/backstage/library", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing.id,
            title: editing.title.trim(),
            blurb: editing.blurb.trim(),
            topics: editing.topics,
          }),
        });
        const j = await r.json();
        if (!r.ok || !j.ok) throw new Error(j.error || "");
      } catch (e) {
        setBusy(false);
        return setErr(
          e instanceof Error && e.message ? e.message : "Couldn't save that. Try again."
        );
      }
    }

    setVideos(videos.map((v) => (v.id === editing.id ? editing : v)));
    setEditing(null);
    setBusy(false);
    flash(configured ? "Updated." : "Updated in preview \u2014 not saved.");
  }

  async function toggle(id: string, key: "featured" | "published") {
    const target = videos.find((v) => v.id === id);
    if (!target) return;
    if (key === "featured" && !target.featured && featuredCount >= 4) {
      return setErr("Only four videos can sit on the homepage. Un-feature one first.");
    }
    const next = !target[key];

    // optimistic: flip it now, roll back if the server disagrees
    const before = videos;
    setVideos(videos.map((v) => (v.id === id ? { ...v, [key]: next } : v)));
    setErr("");

    if (!configured) return;
    try {
      const r = await fetch("/api/backstage/library", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [key]: next }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "");
    } catch (e) {
      setVideos(before);
      setErr(e instanceof Error && e.message ? e.message : "Couldn't save that change.");
    }
  }

  async function remove(id: string) {
    const before = videos;
    setVideos(videos.filter((v) => v.id !== id));
    if (!configured) return flash("Removed in preview \u2014 not saved.");
    try {
      const r = await fetch("/api/backstage/library", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!r.ok) throw new Error();
      flash("Removed.");
    } catch {
      setVideos(before);
      setErr("Couldn't remove that. Try again.");
    }
  }

  return (
    <>
      {/* ---- add ---- */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Add a video</h2>
          <span className={`${s.pill} ${featuredCount >= 4 ? s.pillRed : ""}`}>
            {featuredCount}/4 on homepage
          </span>
        </div>

        <Field
          label="YouTube link"
          value={draft.url}
          onChange={(v) => setDraft({ ...draft, url: v })}
          placeholder="https://www.youtube.com/watch?v=..."
          help="Any YouTube link works — watch, share, shorts, or live."
        />

        {vid && (
          <div className={s.row} style={{ gridTemplateColumns: "120px 1fr" }}>
            <div className={s.thumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnail(vid)} alt="" />
            </div>
            <p className={s.rowBlurb}>
              Found it. This thumbnail comes straight from YouTube and updates
              itself if you ever change the video artwork.
            </p>
          </div>
        )}

        <Field
          label="Title"
          value={draft.title}
          onChange={(v) => setDraft({ ...draft, title: v })}
          max={LIMITS.videoTitle}
          placeholder="What is a Mortgage?"
        />

        <TopicPicker all={topics} chosen={draft.topics} onToggle={toggleDraftTopic} />

        <Area
          label="Blurb"
          value={draft.blurb}
          onChange={(v) => setDraft({ ...draft, blurb: v })}
          max={LIMITS.videoBlurb}
          placeholder="Two or three sentences on what someone gets out of watching."
          help="This sits under the title on the card. Keep it to the promise, not the summary."
        />

        <div className={s.btnRow} style={{ marginBottom: 14 }}>
          <label className={s.pill} style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
              style={{ marginRight: 7, accentColor: "#EB2933" }}
            />
            Show on the homepage
          </label>
          <label className={s.pill} style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              style={{ marginRight: 7, accentColor: "#EB2933" }}
            />
            Publish now
          </label>
        </div>

        {err && !editing && (
          <div className={s.loginErr} style={{ marginBottom: 14 }}>{err}</div>
        )}

        <button
          type="button"
          className={`${s.btn} ${s.btnPrimary}`}
          onClick={add}
          disabled={busy}
        >
          {busy ? "Adding..." : "Add to the library"}
        </button>
      </div>

      {/* ---- list ---- */}
      <div className={s.cardHead} style={{ marginTop: 26 }}>
        <h2 className={s.cardTitle}>In the library ({videos.length})</h2>
      </div>

      {videos.length === 0 ? (
        <div className={s.empty}>
          Nothing in the library yet. Add your first video above.
        </div>
      ) : (
        videos.map((v) =>
          editing?.id === v.id ? (
            <div key={v.id} className={s.card} style={{ borderColor: "#EB2933" }}>
              <div className={s.cardHead}>
                <h3 className={s.cardTitle}>Editing</h3>
                <span className={s.pill}>Nothing changes until you hit Save</span>
              </div>

              <Field
                label="Title"
                value={editing.title}
                onChange={(x) => setEditing({ ...editing, title: x })}
                max={LIMITS.videoTitle}
              />

              <TopicPicker
                all={topics}
                chosen={editing.topics}
                onToggle={(name) =>
                  setEditing({
                    ...editing,
                    topics: editing.topics.includes(name)
                      ? editing.topics.filter((t) => t !== name)
                      : [...editing.topics, name],
                  })
                }
              />

              <Area
                label="Blurb"
                value={editing.blurb}
                onChange={(x) => setEditing({ ...editing, blurb: x })}
                max={LIMITS.videoBlurb}
              />

              {err && <div className={s.loginErr} style={{ marginBottom: 14 }}>{err}</div>}

              <div className={s.btnRow}>
                <button type="button" className={`${s.btn} ${s.btnPrimary}`}
                  onClick={saveEdit} disabled={busy}>
                  {busy ? "Saving..." : "Save changes"}
                </button>
                <button type="button" className={`${s.btn} ${s.btnGhost}`}
                  onClick={() => { setEditing(null); setErr(""); }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div key={v.id} className={s.row}>
              <div className={s.thumb}>
                {v.youtube_id ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbnail(v.youtube_id)} alt="" />
                ) : (
                  <span className={s.thumbEmpty}>No video linked</span>
                )}
              </div>
              <div>
                <h3 className={s.rowTitle}>{v.title}</h3>
                <p className={s.rowBlurb}>{v.blurb}</p>
                <div className={s.rowMeta}>
                  {(v.topics ?? []).map((t) => (
                    <span key={t} className={s.pill}>{t}</span>
                  ))}
                  {v.featured && <span className={`${s.pill} ${s.pillRed}`}>Homepage</span>}
                  <span className={`${s.pill} ${v.published ? s.pillGreen : s.pillMuted}`}>
                    {v.published ? "Live" : "Draft"}
                  </span>
                </div>
              </div>
              <div className={s.rowActions}>
                <button type="button" className={`${s.btn} ${s.btnGhost}`}
                  onClick={() => { setEditing({ ...v }); setErr(""); }}>
                  Edit
                </button>
                <button type="button" className={`${s.btn} ${s.btnGhost}`}
                  onClick={() => toggle(v.id, "featured")}>
                  {v.featured ? "Unfeature" : "Feature"}
                </button>
                <button type="button" className={`${s.btn} ${s.btnGhost}`}
                  onClick={() => toggle(v.id, "published")}>
                  {v.published ? "Unpublish" : "Publish"}
                </button>
                <button type="button" className={`${s.btn} ${s.btnDanger}`}
                  onClick={() => remove(v.id)}>
                  Remove
                </button>
              </div>
            </div>
          )
        )
      )}

      {toast && <div className={s.toast}>{toast}</div>}
    </>
  );
}
