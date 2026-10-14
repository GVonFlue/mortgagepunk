"use client";

// Client component: file reading, upload progress and per-slot save state.

import { useState, useRef } from "react";
import s from "./Backstage.module.css";
import { IMAGE_SLOTS, type ImageSlot, type SiteImage } from "@/lib/images";

/**
 * Backstage → Photos.
 *
 * One card per picture on the site that Chris can swap. The cards are
 * generated from the slot registry in lib/images.ts, so this file never
 * mentions a specific photograph — adding a slot there adds a card here.
 *
 * WRITTEN FOR SOMEBODY WHO DOES NOT BUILD WEBSITES. Three things follow from
 * that, and they are the whole design:
 *
 *  1. Every card says where the picture appears, in plain words, before it
 *     says anything else. "Chris, beside his story" is findable; a filename
 *     is not.
 *  2. Nothing is destructive. Replacing a photo writes a new row; "Put the
 *     original back" deletes it. The picture that shipped with the site is
 *     always one click away, so there is nothing to be afraid of.
 *  3. The upload is one step, not three. Pick a file and it reads, uploads
 *     and saves in one go — no separate "save" button to forget, which is
 *     the single most common way a change gets lost.
 *
 * Dimensions are read in the browser before upload and stored with the URL.
 * That is what lets the live page reserve the right box while the photo
 * loads, instead of the layout jumping when it arrives.
 */

type Status = { kind: "idle" | "busy" | "ok" | "err"; msg?: string };

function readSize(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    // A file the browser cannot decode still uploads; the live page then
    // falls back to the slot's declared shape rather than breaking.
    img.onerror = () => {
      resolve({ w: 0, h: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

function SlotCard({
  slot,
  current,
  onChanged,
}: {
  slot: ImageSlot;
  current?: SiteImage;
  onChanged: (slot: string, img: SiteImage | null) => void;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const input = useRef<HTMLInputElement>(null);

  const live = current?.url ?? slot.fallback;
  const isCustom = Boolean(current?.url);

  async function pick(file: File) {
    setStatus({ kind: "busy", msg: "Uploading..." });

    const { w, h } = await readSize(file);

    const form = new FormData();
    form.append("file", file);
    form.append("slot", slot.key);

    try {
      const up = await fetch("/api/backstage/photo", { method: "POST", body: form });
      const uj = await up.json();
      if (!up.ok || !uj.ok) {
        return setStatus({ kind: "err", msg: uj.error ?? "That didn't upload." });
      }

      const save = await fetch("/api/backstage/images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: slot.key, url: uj.url, w, h }),
      });
      const sj = await save.json();
      if (!save.ok || !sj.ok) {
        return setStatus({ kind: "err", msg: sj.error ?? "Uploaded, but couldn't save it." });
      }

      onChanged(slot.key, { slot: slot.key, url: uj.url, w: w || null, h: h || null });
      setStatus({ kind: "ok", msg: "Changed. It's live on the site now." });
    } catch {
      setStatus({ kind: "err", msg: "Something went wrong. Try again." });
    }
  }

  async function reset() {
    setStatus({ kind: "busy", msg: "Putting the original back..." });
    try {
      const r = await fetch(`/api/backstage/images?slot=${encodeURIComponent(slot.key)}`, {
        method: "DELETE",
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        return setStatus({ kind: "err", msg: j.error ?? "Couldn't reset that." });
      }
      onChanged(slot.key, null);
      setStatus({ kind: "ok", msg: "Original photo is back." });
    } catch {
      setStatus({ kind: "err", msg: "Something went wrong. Try again." });
    }
  }

  return (
    <div className={s.photoCard}>
      <div className={s.photoThumb}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={live} alt="" />
        {isCustom && <span className={`${s.pill} ${s.pillGreen}`}>Changed</span>}
      </div>

      <div className={s.photoBody}>
        <h3 className={s.photoTitle}>{slot.label}</h3>
        <p className={s.photoWhere}>{slot.where}</p>
        <p className={s.help}>{slot.guidance}</p>

        <div className={s.btnRow}>
          <button
            type="button"
            className={`${s.btn} ${s.btnPrimary}`}
            onClick={() => input.current?.click()}
            disabled={status.kind === "busy"}
          >
            {status.kind === "busy" ? "Working..." : isCustom ? "Change it again" : "Change this photo"}
          </button>
          {isCustom && (
            <button
              type="button"
              className={`${s.btn} ${s.btnGhost}`}
              onClick={reset}
              disabled={status.kind === "busy"}
            >
              Put the original back
            </button>
          )}
        </div>

        {status.msg && (
          <p className={status.kind === "err" ? s.photoErr : s.photoOk}>{status.msg}</p>
        )}

        <input
          ref={input}
          type="file"
          accept={slot.needsTransparency ? "image/png" : "image/jpeg,image/png,image/webp"}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void pick(f);
            // Reset the input so picking the same file twice still fires.
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

export default function PhotoManager({ initial }: { initial: Record<string, SiteImage> }) {
  const [images, setImages] = useState(initial);

  function onChanged(slot: string, img: SiteImage | null) {
    setImages((prev) => {
      const next = { ...prev };
      if (img) next[slot] = img;
      else delete next[slot];
      return next;
    });
  }

  return (
    <>
      {IMAGE_SLOTS.map((group) => (
        <div key={group.group} className={s.card}>
          <div className={s.cardHead}>
            <h2 className={s.cardTitle}>{group.group}</h2>
          </div>
          <div className={s.photoGrid}>
            {group.slots.map((slot) => (
              <SlotCard
                key={slot.key}
                slot={slot}
                current={images[slot.key]}
                onChanged={onChanged}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
