"use client";

// Client component: form state plus a live preview of the composition.

import { useState } from "react";
import s from "./Backstage.module.css";
import { Field } from "./Field";
import ArtUploader from "./ArtUploader";
import { LIMITS, HERO_FIT, type Hero } from "@/lib/content";

/**
 * Homepage hero copy.
 *
 * WORDS are editable. LAYOUT is not. The headline still sits behind Chris, the
 * shadow stack is unchanged, and the stage still scales as one unit — those are
 * design decisions and they are the part that breaks when nudged.
 *
 * The preview below is the real reason this screen exists. The hero is a fixed
 * composition with no text wrapping, so a long word would run off the edge.
 * Hero.tsx scales each line down past a reference length, and this preview
 * applies the identical maths so Chris sees the actual result before saving
 * rather than discovering it on the live site.
 */

function fit(text: string, base: number, reference: number): number {
  const len = text.trim().length || 1;
  if (len <= reference) return base;
  return Math.round(base * (reference / len) * 10) / 10;
}

export default function HeroEditor({
  initial, configured,
}: {
  initial: Hero;
  configured: boolean;
}) {
  const [h, setH] = useState<Hero>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");

  const set = <K extends keyof Hero>(k: K, v: Hero[K]) => setH({ ...h, [k]: v });

  // preview stage is 1512 wide scaled into ~520px
  const U = 520 / 1512;
  const px = (n: number) => `${n * U}px`;

  const bigFit = fit(h.line_big, 246, HERO_FIT.line_big);
  const accentFit = fit(h.line_accent, 246, HERO_FIT.line_accent);
  const shrunk =
    bigFit < 246 || accentFit < 246 || fit(h.line_small, 106, HERO_FIT.line_small) < 106;

  async function save() {
    if (!configured) {
      setToast("Preview only — not saved.");
      return setTimeout(() => setToast(""), 2600);
    }
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/backstage/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(h),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "");
      setToast("Saved. The homepage updates within five minutes.");
      setTimeout(() => setToast(""), 3400);
    } catch (e) {
      setErr(e instanceof Error && e.message ? e.message : "Couldn't save. Try again.");
    }
    setBusy(false);
  }

  return (
    <>
      {/* ---------- live preview ---------- */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>How it will look</h2>
          {shrunk && <span className={`${s.pill} ${s.pillRed}`}>Type scaled to fit</span>}
        </div>

        <div className={s.heroPrev}>
          {h.art_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={h.art_url} alt=""
              style={{ width: `${((h.art_width_units ?? 1030) / 1512) * 100}%`,
                       height: "auto", display: "block" }} />
          ) : (
          <div className={s.heroPrevType}>
            <span style={{ fontSize: px(fit(h.eyebrow, 58, HERO_FIT.eyebrow)),
              letterSpacing: ".20em", lineHeight: 1, display: "block" }}>
              {h.eyebrow}
            </span>
            <span className={s.heroPrevRule} />
            <span style={{ fontSize: px(fit(h.line_small, 106, HERO_FIT.line_small)),
              lineHeight: .86, display: "block" }}>
              {h.line_small}
            </span>
            <span style={{ fontSize: px(bigFit), lineHeight: .8, display: "block" }}>
              {h.line_big}
            </span>
            <span style={{ fontSize: px(accentFit), lineHeight: .8, display: "block",
              color: "var(--mp-red)" }}>
              {h.line_accent}
            </span>
          </div>
          )}
          <div className={s.heroPrevCtas}>
            <span className={s.heroPrevBtn}>{h.cta1_label}</span>
            <span className={`${s.heroPrevBtn} ${s.heroPrevBtnGhost}`}>{h.cta2_label}</span>
          </div>
        </div>

        <p className={s.help} style={{ marginTop: 12 }}>
          Chris and the concrete are omitted here so the text is readable — on
          the live site the headline still sits behind him exactly as it does
          now. {shrunk && "One of your lines is longer than the original, so it's been scaled down to stay inside the frame."}
        </p>
      </div>

      {/* ---------- artwork ---------- */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Headline artwork</h2>
          <span className={`${s.pill} ${h.art_url ? s.pillRed : s.pillMuted}`}>
            {h.art_url ? "Artwork is live" : "Using typed text"}
          </span>
        </div>
        <p className={s.help} style={{ marginTop: -8, marginBottom: 18 }}>
          Upload the designer&rsquo;s finished headline as a transparent PNG and
          it replaces the typed version — same position on the page, and still
          sitting behind Chris. Remove it and the typed text comes straight back.
        </p>

        <ArtUploader
          slot="desktop"
          label="Desktop artwork"
          hint="Transparent PNG, 2000px wide or more. This is the one that matters."
          url={h.art_url}
          w={h.art_w}
          h={h.art_h}
          onChange={(v) => setH({ ...h, art_url: v.url, art_w: v.w, art_h: v.h })}
          disabled={!configured}
        />

        <ArtUploader
          slot="mobile"
          label="Phone artwork (optional)"
          hint="A desktop lockup is usually too wide for a phone. Upload a narrower version and it takes over below 820px."
          url={h.art_mobile_url}
          w={h.art_mobile_w}
          h={h.art_mobile_h}
          onChange={(v) =>
            setH({ ...h, art_mobile_url: v.url, art_mobile_w: v.w, art_mobile_h: v.h })
          }
          disabled={!configured}
        />

        {h.art_url && (
          <div className={s.grid2} style={{ marginTop: 6 }}>
            <Field label="How wide it sits" value={String(h.art_width_units ?? 1030)}
              onChange={(v) => set("art_width_units", Number(v) || 1030)}
              help="1030 matches the current headline. Higher is wider." />
            <Field label="How far from the top" value={String(h.art_top_units ?? 96)}
              onChange={(v) => set("art_top_units", Number(v) || 96)}
              help="96 matches the current headline. Higher moves it down." />
          </div>
        )}

        {!configured && (
          <p className={s.help}>Connect the database before uploading.</p>
        )}
      </div>

      {/* ---------- the headline ---------- */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>The headline</h2>
          {h.art_url && <span className={s.pill}>Hidden while artwork is live</span>}
        </div>
        <p className={s.help} style={{ marginTop: -8, marginBottom: 16 }}>
          {h.art_url
            ? "Artwork is showing instead, but keep this accurate — it's what search engines and screen readers read, since they can't read an image."
            : "The typed version, set in Anton. Long lines scale down automatically so nothing runs off the edge."}
        </p>
        <div className={s.grid2}>
          <Field label="Small line on top" value={h.eyebrow} max={LIMITS.heroLine}
            onChange={(v) => set("eyebrow", v)}
            help={`Best at ${HERO_FIT.eyebrow} characters or fewer.`} />
          <Field label="Second line" value={h.line_small} max={LIMITS.heroLine}
            onChange={(v) => set("line_small", v)}
            help={`Best at ${HERO_FIT.line_small} characters or fewer.`} />
        </div>
        <div className={s.grid2}>
          <Field label="Big line" value={h.line_big} max={LIMITS.heroLine}
            onChange={(v) => set("line_big", v)}
            help={`The widest line. Past ${HERO_FIT.line_big} characters it scales down.`} />
          <Field label="Big line in red" value={h.line_accent} max={LIMITS.heroLine}
            onChange={(v) => set("line_accent", v)}
            help={`Past ${HERO_FIT.line_accent} characters it scales down.`} />
        </div>
      </div>

      {/* ---------- side text ---------- */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Text beside Chris</h2>
        </div>
        <Field label="First line" value={h.rail_top} max={LIMITS.heroRail}
          onChange={(v) => set("rail_top", v)} />
        <Field label="Red line" value={h.rail_hit} max={LIMITS.heroRail}
          onChange={(v) => set("rail_hit", v)} />
        <Field label="Last line" value={h.rail_bottom} max={LIMITS.heroRail}
          onChange={(v) => set("rail_bottom", v)}
          help="Hidden on phones — there isn't room beside him at that width." />
      </div>

      {/* ---------- buttons ---------- */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>The buttons</h2>
        </div>
        <div className={s.grid2}>
          <Field label="Red button" value={h.cta1_label} max={LIMITS.ctaLabel}
            onChange={(v) => set("cta1_label", v)} />
          <Field label="Where it goes" value={h.cta1_href}
            onChange={(v) => set("cta1_href", v)}
            help="A path like /get-approved, or a full https:// link." />
        </div>
        <div className={s.grid2}>
          <Field label="Black button" value={h.cta2_label} max={LIMITS.ctaLabel}
            onChange={(v) => set("cta2_label", v)} />
          <Field label="Where it goes" value={h.cta2_href}
            onChange={(v) => set("cta2_href", v)} />
        </div>
        <div className={s.grid2}>
          <Field label="Button in the top bar" value={h.nav_cta_label} max={LIMITS.ctaLabel}
            onChange={(v) => set("nav_cta_label", v)} />
          <Field label="Where it goes" value={h.nav_cta_href}
            onChange={(v) => set("nav_cta_href", v)} />
        </div>
      </div>

      {err && <div className={s.loginErr} style={{ marginBottom: 14 }}>{err}</div>}

      <button type="button" className={`${s.btn} ${s.btnPrimary}`}
        onClick={save} disabled={busy}>
        {busy ? "Saving..." : "Save the hero"}
      </button>

      {toast && <div className={s.toast}>{toast}</div>}
    </>
  );
}
