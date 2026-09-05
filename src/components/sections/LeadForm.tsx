"use client";

// Client component: controlled form state and submit handling.

import { useState } from "react";
import s from "../Site.module.css";

type Status = "idle" | "sending" | "sent" | "error";

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [f, setF] = useState({
    first: "", last: "", email: "", phone: "", intent: "Buying a home", notes: "",
  });

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function submit() {
    if (!f.first.trim() || !f.email.trim() || !f.phone.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, source: "homepage" }),
      });
      setStatus(r.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className={s.form}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 34, textTransform: "uppercase" }}>
          Got it.
        </h3>
        <p className={s.lede} style={{ marginTop: 8 }}>
          Someone from the team will reach out. If it&rsquo;s urgent, text us — you
          will get a person, not a queue.
        </p>
      </div>
    );
  }

  return (
    <div className={s.form}>
      <div className={s.row2}>
        <div className={s.field}>
          <label htmlFor="first">First name</label>
          <input id="first" value={f.first} onChange={set("first")} autoComplete="given-name" />
        </div>
        <div className={s.field}>
          <label htmlFor="last">Last name</label>
          <input id="last" value={f.last} onChange={set("last")} autoComplete="family-name" />
        </div>
      </div>
      <div className={s.row2}>
        <div className={s.field}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={f.email} onChange={set("email")} autoComplete="email" />
        </div>
        <div className={s.field}>
          <label htmlFor="phone">Mobile</label>
          <input id="phone" type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" />
        </div>
      </div>
      <div className={s.field}>
        <label htmlFor="intent">What are you working on?</label>
        <select id="intent" value={f.intent} onChange={set("intent")}>
          <option>Buying a home</option>
          <option>Refinancing</option>
          <option>Investment property</option>
          <option>Just learning right now</option>
          <option>Something else</option>
        </select>
      </div>
      <div className={s.field}>
        <label htmlFor="notes">Anything we should know?</label>
        <textarea id="notes" value={f.notes} onChange={set("notes")} />
      </div>
      <div>
        <button
          type="button"
          onClick={submit}
          disabled={status === "sending"}
          className={`${s.btn} ${s.solid}`}
          style={{ border: 0, cursor: "pointer" }}
        >
          {status === "sending" ? "Sending..." : "Send it"} <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      {status === "error" && (
        <p className={s.disc} style={{ color: "#EB2933" }}>
          Name, email and mobile are required. If it still won&rsquo;t send, text us
          instead.
        </p>
      )}
      <p className={s.disc}>
        By submitting you agree we can contact you about your inquiry. We do not
        sell your information.
      </p>
    </div>
  );
}
