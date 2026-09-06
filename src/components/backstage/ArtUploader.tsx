"use client";

// Client component: reads the file locally to capture real dimensions, then
// uploads and reports back the public URL.

import { useState, useRef } from "react";
import s from "./Backstage.module.css";

/**
 * Headline artwork uploader.
 *
 * Reads the PNG in the browser first to capture its true pixel dimensions.
 * Those get stored alongside the URL and become the CSS aspect-ratio on the
 * live hero — which means the art holds its shape while it loads instead of
 * snapping into place, and can never stretch.
 *
 * PNG only, enforced here and again on the server. The headline sits over a
 * photo and behind Chris, so it needs a real alpha channel; a JPG arrives with
 * a white box around it.
 */
export default function ArtUploader({
  slot,
  label,
  hint,
  url,
  w,
  h,
  onChange,
  disabled,
}: {
  slot: "desktop" | "mobile";
  label: string;
  hint: string;
  url?: string | null;
  w?: number | null;
  h?: number | null;
  onChange: (v: { url: string | null; w: number | null; h: number | null }) => void;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function pick(file: File) {
    setErr("");

    if (file.type !== "image/png") {
      return setErr(
        "PNG only. The headline sits over a photo and behind Chris, so it needs a transparent background."
      );
    }
    if (file.size > 6 * 1024 * 1024) {
      return setErr(`That's ${(file.size / 1048576).toFixed(1)}MB. Keep it under 6MB.`);
    }

    // read the real dimensions before uploading
    const dims = await new Promise<{ w: number; h: number } | null>((res) => {
      const img = new Image();
      const src = URL.createObjectURL(file);
      img.onload = () => {
        res({ w: img.naturalWidth, h: img.naturalHeight });
        URL.revokeObjectURL(src);
      };
      img.onerror = () => res(null);
      img.src = src;
    });

    if (!dims) return setErr("Couldn't read that file. Try exporting it again.");
    if (dims.w < 900 && slot === "desktop") {
      setErr(
        `That's only ${dims.w}px wide. It'll look soft on a big screen — export at 2000px or more.`
      );
      // a warning, not a block. Chris may be reviewing a rough cut.
    }

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slot", slot);
      const r = await fetch("/api/backstage/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "Upload failed");
      onChange({ url: j.url, w: dims.w, h: dims.h });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed. Try again.");
    }
    setBusy(false);
  }

  return (
    <div className={s.field}>
      <span className={s.label}>{label}</span>

      {url ? (
        <div className={s.artPreview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" />
          <div className={s.artPreviewMeta}>
            <span className={s.pill}>
              {w && h ? `${w} × ${h}` : "uploaded"}
            </span>
            <div className={s.btnRow}>
              <button type="button" className={`${s.btn} ${s.btnGhost}`}
                onClick={() => input.current?.click()} disabled={busy || disabled}>
                Replace
              </button>
              <button type="button" className={`${s.btn} ${s.btnDanger}`}
                onClick={() => onChange({ url: null, w: null, h: null })}
                disabled={busy || disabled}>
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={s.artDrop}
          onClick={() => input.current?.click()}
          disabled={busy || disabled}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 16V4M7.5 8.5 12 4l4.5 4.5" />
            <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
          </svg>
          <strong>{busy ? "Uploading..." : "Upload a PNG"}</strong>
          <span>{hint}</span>
        </button>
      )}

      <input
        ref={input}
        type="file"
        accept="image/png"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pick(f);
          e.target.value = "";
        }}
      />

      {err && <p className={s.artErr}>{err}</p>}
    </div>
  );
}
