"use client";

// Client component: toggle plus live preview of the banner.

import { useState } from "react";
import s from "./Backstage.module.css";
import { Field } from "./Field";
import { LIMITS, type Announcement } from "@/lib/content";

export default function AnnouncementEditor({
  initial, configured,
}: {
  initial: Announcement;
  configured: boolean;
}) {
  const [a, setA] = useState<Announcement>(initial);
  const [toast, setToast] = useState("");

  function save() {
    setToast(configured ? "Saved." : "Preview only — not saved.");
    setTimeout(() => setToast(""), 2600);
  }

  return (
    <>
      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>The bar</h2>
          <span className={`${s.pill} ${a.enabled ? s.pillGreen : s.pillMuted}`}>
            {a.enabled ? "Showing on the site" : "Hidden"}
          </span>
        </div>

        <label className={s.pill} style={{ cursor: "pointer", display: "inline-flex", marginBottom: 18 }}>
          <input
            type="checkbox"
            checked={a.enabled}
            onChange={(e) => setA({ ...a, enabled: e.target.checked })}
            style={{ marginRight: 8, accentColor: "#EB2933" }}
          />
          Show the bar on every page
        </label>

        <Field label="What it says" value={a.text}
          onChange={(v) => setA({ ...a, text: v })} max={LIMITS.announcement}
          help="One sentence. It has to read at a glance from the top of the page." />
        <Field label="Where it links" value={a.href}
          onChange={(v) => setA({ ...a, href: v })} />
      </div>

      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Preview</h2>
        </div>
        <div style={{
          background: "#EB2933", color: "#0A0A0A", padding: "12px 18px",
          borderRadius: 8, fontWeight: 800, fontSize: 13.5,
          letterSpacing: ".04em", textAlign: "center",
          opacity: a.enabled ? 1 : 0.34,
        }}>
          {a.text || "Your announcement will show here"} &rarr;
        </div>
        {!a.enabled && (
          <p className={s.help} style={{ marginTop: 10 }}>
            Dimmed because the bar is switched off.
          </p>
        )}
      </div>

      <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={save}>
        Save
      </button>

      {toast && <div className={s.toast}>{toast}</div>}
    </>
  );
}
