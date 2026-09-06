"use client";

// Client component: this is the editing surface — local state, validation,
// and save requests.

import { useState } from "react";
import s from "./Backstage.module.css";
import { Field, Area, Select } from "./Field";
import {
  TOPICS, LIMITS, youtubeId, thumbnail, type Video,
} from "@/lib/content";

const BLANK = {
  url: "", title: "", blurb: "", topic: TOPICS[0] as string,
  featured: false, published: true,
};

export default function LibraryManager({
  initial, configured,
}: {
  initial: Video[];
  configured: boolean;
}) {
  const [videos, setVideos] = useState<Video[]>(initial);
  const [draft, setDraft] = useState({ ...BLANK });
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);

  const vid = youtubeId(draft.url);
  const featuredCount = videos.filter((v) => v.featured).length;

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  async function add() {
    if (!vid) return setErr("That doesn't look like a YouTube link.");
    if (!draft.title.trim()) return setErr("Give it a title.");
    if (!draft.blurb.trim()) return setErr("Write a couple of sentences.");
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
      topic: draft.topic,
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
        if (!r.ok || !j.ok) throw new Error(j.error || "save failed");
        // use the server's row so we hold the real database id
        row.id = j.video.id;
      } catch (e) {
        setBusy(false);
        return setErr(
          e instanceof Error && e.message !== "save failed"
            ? e.message
            : "Couldn't save that. Try again, or text Garrett."
        );
      }
    }

    setVideos([...videos, row]);
    setDraft({ ...BLANK });
    setBusy(false);
    flash(configured ? "Added." : "Added in preview — not saved.");
  }

  async function toggle(id: string, key: "featured" | "published") {
    const target = videos.find((v) => v.id === id);
    if (!target) return;
    if (key === "featured" && !target.featured && featuredCount >= 4) {
      return setErr("Only four videos can sit on the homepage. Un-feature one first.");
    }
    const next = !target[key];

    // optimistic: flip it now, roll back if the server disagrees
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
      setVideos(videos);
      setErr(e instanceof Error && e.message ? e.message : "Couldn't save that change.");
    }
  }

  async function remove(id: string) {
    const before = videos;
    setVideos(videos.filter((v) => v.id !== id));
    if (!configured) return flash("Removed in preview — not saved.");
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
          <div className={s.row} style={{ marginBottom: 16 }}>
            <div className={s.thumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbnail(vid)} alt="" />
            </div>
            <div>
              <p className={s.rowBlurb}>
                Found it. This thumbnail comes straight from YouTube and updates
                itself if you ever change the video artwork.
              </p>
            </div>
            <div />
          </div>
        )}

        <div className={s.grid2}>
          <Field
            label="Title"
            value={draft.title}
            onChange={(v) => setDraft({ ...draft, title: v })}
            max={LIMITS.videoTitle}
            placeholder="The rate is not the deal"
          />
          <Select
            label="Topic"
            value={draft.topic}
            onChange={(v) => setDraft({ ...draft, topic: v })}
            options={TOPICS}
          />
        </div>

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

        {err && (
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
        videos.map((v) => (
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
                <span className={s.pill}>{v.topic}</span>
                {v.featured && <span className={`${s.pill} ${s.pillRed}`}>Homepage</span>}
                <span className={`${s.pill} ${v.published ? s.pillGreen : s.pillMuted}`}>
                  {v.published ? "Live" : "Draft"}
                </span>
              </div>
            </div>
            <div className={s.rowActions}>
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
        ))
      )}

      {toast && <div className={s.toast}>{toast}</div>}
    </>
  );
}
