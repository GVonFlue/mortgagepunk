"use client";

// Client component: the upload, the drag-to-reorder list and the save request.

import { useEffect, useRef, useState } from "react";
import s from "./Backstage.module.css";
import w from "./WallManager.module.css";
import { Field } from "./Field";
import {
  WALL_SHAPES, WALL_LIMITS, cleanPostLink, nearestShape,
  type SocialTile, type WallShape,
} from "@/lib/socialTiles";

/**
 * Backstage → Movement wall.
 *
 * The pictures under The Movement on the home page, in the order they show.
 * Built for the job Chris actually has: he posts something, likes it, and
 * wants it on the wall, opening that post. So adding is one card at the top —
 * picture, link, done — and the list below is the wall itself, top to bottom.
 *
 * NOTHING HERE IS SAVED UNTIL "SAVE THE WALL". Unlike Photos, which saves on
 * upload, this is a list being arranged: dragging five tiles around should
 * not put five half-finished versions of the home page live. The save bar
 * sticks to the bottom of the screen so it is never far from the last change,
 * and leaving with unsaved changes asks first.
 *
 * Tiles without a link still work — they open the profile — and are marked in
 * yellow so the ones still to do are easy to find.
 */

const ratio = (shape: WallShape) =>
  WALL_SHAPES.find((x) => x.key === shape)?.ratio ?? 9 / 16;

function readSize(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ w: 0, h: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

function linkError(v: string): string {
  try {
    cleanPostLink(v);
    return "";
  } catch (e) {
    return e instanceof Error ? e.message : "That link doesn't look right.";
  }
}

const BLANK = { src: "", href: "", alt: "", shape: "reel" as WallShape };

export default function WallManager({
  initial,
  configured,
}: {
  initial: SocialTile[];
  configured: boolean;
}) {
  const [items, setItems] = useState<SocialTile[]>(initial);
  const [draft, setDraft] = useState({ ...BLANK });
  const [uploading, setUploading] = useState(false);
  const [addErr, setAddErr] = useState("");
  const [linkErrs, setLinkErrs] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  // Ask before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const shown = items.filter((t) => !t.hidden);
  const linked = shown.filter((t) => t.href).length;

  function flash(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2600);
  }

  async function upload(f: File) {
    setAddErr("");
    setUploading(true);
    try {
      const size = await readSize(f);
      const form = new FormData();
      form.append("file", f);
      form.append("slot", "wall");
      const r = await fetch("/api/backstage/photo", { method: "POST", body: form });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "That didn't upload.");
      setDraft((d) => ({ ...d, src: j.url, shape: nearestShape(size.w, size.h) }));
    } catch (e) {
      setAddErr(e instanceof Error ? e.message : "That didn't upload. Try again.");
    }
    setUploading(false);
  }

  function add() {
    if (!draft.src) return setAddErr("Upload the picture first.");
    const le = linkError(draft.href);
    if (le) return setAddErr(le);
    setAddErr("");
    const tile: SocialTile = {
      id: `tmp-${Date.now()}`,
      sort: 0,
      src: draft.src,
      alt: draft.alt.trim() || "Mortgage Punk on Instagram",
      shape: draft.shape,
      href: cleanPostLink(draft.href),
      hidden: false,
    };
    // New posts go first: the newest thing is usually the one he wants seen.
    setItems([tile, ...items]);
    setDraft({ ...BLANK });
    setDirty(true);
    flash("Added to the top. Save the wall to put it live.");
  }

  function patch(id: string, p: Partial<SocialTile>) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...p } : t)));
    setDirty(true);
  }

  function setLink(id: string, v: string) {
    patch(id, { href: v });
    if (linkErrs[id]) setLinkErrs((e) => ({ ...e, [id]: "" }));
  }

  // Tidy the link when the field is left: strip the tracking, or flag it.
  function tidyLink(id: string, v: string) {
    const le = linkError(v);
    setLinkErrs((e) => ({ ...e, [id]: le }));
    if (!le) {
      const clean = cleanPostLink(v);
      if ((clean ?? "") !== v) patch(id, { href: clean });
    }
  }

  function moveTo(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    setItems(next);
    setDirty(true);
  }

  function remove(t: SocialTile) {
    if (!window.confirm("Take this picture off the wall for good? (Hide keeps it for later.)")) return;
    setItems(items.filter((x) => x.id !== t.id));
    setDirty(true);
  }

  async function save() {
    // Check every link before sending, so the message can point at the tile.
    const errs: Record<string, string> = {};
    items.forEach((t) => {
      const le = linkError(t.href ?? "");
      if (le) errs[t.id] = le;
    });
    setLinkErrs(errs);
    if (Object.keys(errs).length) {
      return setErr("One of the links needs fixing — it's marked in red.");
    }
    if (!items.some((t) => !t.hidden)) {
      return setErr("At least one picture has to stay on the wall.");
    }

    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/backstage/wall", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "");
      // The server hands back real ids for new tiles and the cleaned links.
      setItems(j.items);
      setDirty(false);
      flash("Saved. It's on the home page now.");
    } catch (e) {
      setErr(e instanceof Error && e.message ? e.message : "Couldn't save. Try again.");
    }
    setBusy(false);
  }

  return (
    <>
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Add a post</h2>
        </div>

        <div className={w.addGrid}>
          <button
            type="button"
            className={w.drop}
            style={{ aspectRatio: String(ratio(draft.shape)) }}
            onClick={() => file.current?.click()}
            disabled={uploading || !configured}
          >
            {draft.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.src} alt="" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                </svg>
                <strong>{uploading ? "Uploading..." : "Upload the picture"}</strong>
                <span>The cover of the post. JPG, PNG or WebP, under 8MB.</span>
              </>
            )}
          </button>

          <div>
            <Field
              label="Link to the post"
              value={draft.href}
              onChange={(v) => setDraft({ ...draft, href: v })}
              placeholder="https://www.instagram.com/reel/..."
              help="On the post, tap Share, then Copy link. Leave it empty and the picture opens your profile."
            />
            <label className={s.field}>
              <span className={s.label}>Shape</span>
              <select
                className={s.select}
                value={draft.shape}
                onChange={(e) => setDraft({ ...draft, shape: e.target.value as WallShape })}
              >
                {WALL_SHAPES.map((x) => (
                  <option key={x.key} value={x.key}>{x.label}</option>
                ))}
              </select>
              <span className={s.help}>
                Picked from the picture&rsquo;s own shape when you upload it, so its
                words don&rsquo;t get cropped off.
              </span>
            </label>
            <Field
              label="What's in it"
              value={draft.alt}
              max={WALL_LIMITS.alt}
              onChange={(v) => setDraft({ ...draft, alt: v })}
              placeholder="Chris on stage at the conference"
              help="A few words. Read aloud to people who can't see the picture, and to Google."
            />

            {addErr && <div className={s.loginErr} style={{ marginBottom: 14 }}>{addErr}</div>}

            <div className={s.btnRow}>
              <button
                type="button"
                className={`${s.btn} ${s.btnPrimary}`}
                onClick={add}
                disabled={uploading || !draft.src}
              >
                Add to the wall
              </button>
              {draft.src && (
                <button
                  type="button"
                  className={`${s.btn} ${s.btnGhost}`}
                  onClick={() => file.current?.click()}
                  disabled={uploading}
                >
                  Use a different picture
                </button>
              )}
            </div>
          </div>
        </div>

        <input
          ref={file}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = "";
          }}
        />
      </div>

      <div className={s.cardHead} style={{ marginTop: 26 }}>
        <h2 className={s.cardTitle}>The wall, top to bottom</h2>
        <div className={w.summary}>
          <span className={s.pill}>{shown.length} showing</span>
          <span className={`${s.pill} ${s.pillGreen}`}>{linked} open their post</span>
          {shown.length - linked > 0 && (
            <span className={s.pill} style={{ background: "#FFFBEF", borderColor: "#E8D9A8" }}>
              {shown.length - linked} open your profile
            </span>
          )}
        </div>
      </div>
      <p className={s.help} style={{ marginTop: -6, marginBottom: 14 }}>
        Drag the dots to reorder. Across the page it reads left to right, so the
        first few here are the first row people see. Mixing the shapes keeps it
        looking like a feed instead of a grid.
      </p>

      <div className={w.list}>
        {items.map((t, i) => {
          const le = linkErrs[t.id];
          return (
            <div
              key={t.id}
              className={[
                w.item,
                t.hidden ? w.itemHidden : "",
                dragId === t.id ? w.itemDragging : "",
                overId === t.id && dragId !== t.id ? w.itemOver : "",
              ].join(" ")}
              onDragOver={(e) => {
                if (!dragId) return;
                e.preventDefault();
                if (overId !== t.id) setOverId(t.id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) {
                  const from = items.findIndex((x) => x.id === dragId);
                  // Dropped on a row = goes in front of it.
                  moveTo(from, from < i ? i - 1 : i);
                }
                setDragId(null);
                setOverId(null);
              }}
            >
              <span
                className={w.handle}
                draggable
                aria-hidden="true"
                title="Drag to reorder"
                onDragStart={(e) => {
                  setDragId(t.id);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", t.id);
                  const row = (e.currentTarget as HTMLElement).parentElement;
                  if (row) e.dataTransfer.setDragImage(row, 20, 20);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setOverId(null);
                }}
              >
                <svg viewBox="0 0 16 16">
                  <circle cx="5.5" cy="3.5" r="1.4" /><circle cx="10.5" cy="3.5" r="1.4" />
                  <circle cx="5.5" cy="8" r="1.4" /><circle cx="10.5" cy="8" r="1.4" />
                  <circle cx="5.5" cy="12.5" r="1.4" /><circle cx="10.5" cy="12.5" r="1.4" />
                </svg>
              </span>

              <span className={w.thumb} style={{ aspectRatio: String(ratio(t.shape)) }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.src} alt="" loading="lazy" />
                <span className={w.num}>{i + 1}</span>
              </span>

              <div className={w.body}>
                <p className={w.alt} title={t.alt}>
                  {t.hidden && <b>Hidden · </b>}
                  {t.alt}
                </p>
                <div className={w.fields}>
                  <input
                    className={`${w.link} ${!t.href ? w.linkMissing : ""} ${le ? w.linkErr : ""}`}
                    value={t.href ?? ""}
                    placeholder="Paste the post's link — empty opens your profile"
                    aria-label={`Link for picture ${i + 1}`}
                    onChange={(e) => setLink(t.id, e.target.value)}
                    onBlur={(e) => tidyLink(t.id, e.target.value)}
                  />
                  <select
                    className={w.shape}
                    value={t.shape}
                    aria-label={`Shape of picture ${i + 1}`}
                    onChange={(e) => patch(t.id, { shape: e.target.value as WallShape })}
                  >
                    {WALL_SHAPES.map((x) => (
                      <option key={x.key} value={x.key}>{x.label}</option>
                    ))}
                  </select>
                </div>
                {le && <p className={w.err}>{le}</p>}
              </div>

              <div className={w.actions}>
                <button type="button" className={w.mini} onClick={() => moveTo(i, 0)}
                  disabled={i === 0} title="Move to the top">Top</button>
                <button type="button" className={w.mini} onClick={() => moveTo(i, i - 1)}
                  disabled={i === 0} aria-label="Move up">&uarr;</button>
                <button type="button" className={w.mini} onClick={() => moveTo(i, i + 1)}
                  disabled={i === items.length - 1} aria-label="Move down">&darr;</button>
                <button type="button" className={w.mini}
                  onClick={() => patch(t.id, { hidden: !t.hidden })}>
                  {t.hidden ? "Show" : "Hide"}
                </button>
                {t.href && (
                  <a className={w.mini} href={t.href} target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}>
                    Open
                  </a>
                )}
                <button type="button" className={`${w.mini} ${w.miniDanger}`}
                  onClick={() => remove(t)}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={w.saveBar}>
        <button
          type="button"
          className={`${s.btn} ${s.btnPrimary}`}
          onClick={save}
          disabled={busy || !configured || !dirty}
        >
          {busy ? "Saving..." : dirty ? "Save the wall" : "Saved"}
        </button>
        {dirty && configured && <span className={s.help} style={{ margin: 0 }}>You have unsaved changes.</span>}
        {err && <span className={s.photoErr} style={{ margin: 0 }}>{err}</span>}
      </div>

      {toast && <div className={s.toast}>{toast}</div>}
    </>
  );
}
