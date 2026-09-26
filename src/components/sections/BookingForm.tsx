"use client";

// Client component: controlled form state and submit handling.

import { useState } from "react";
import s from "../Site.module.css";
import { REQUEST_TYPES, type RequestKey } from "@/lib/booking";

/**
 * Booking and appearance requests for Chris.
 *
 * Replaces sending these to the generic contact form, which asked a conference
 * organiser whether they were "buying a home or refinancing". A booking
 * request needs different facts — the room, the date, the size of the
 * audience — and asking for them up front saves Ashley a round of email
 * before she can even quote.
 *
 * THE FORM CHANGES SHAPE WITH THE REQUEST. A podcast has an outlet and an air
 * date, not a venue and an audience count; asking a producer for "audience
 * size" is how a form starts to feel like it was not written for them. So the
 * labels follow the request type and the speaking-only fields hide for the
 * rest.
 *
 * Arrives pre-filled from wherever it was opened: a talk row on /about sets the
 * talk, "Press enquiries" sets the type, "Sponsor the event" on /movement sets
 * sponsorship. See /book for the query parameters.
 *
 * Posts to /api/lead with source "booking". Every field goes into `notes` as
 * labelled lines, because that is the column Backstage and the sheet both
 * show — a separate field per question would need a schema change and would
 * still be invisible in the sheet.
 */

type Status = "idle" | "sending" | "sent" | "error";

export default function BookingForm({
  talks,
  initialType = "speaking",
  initialTalk = "",
}: {
  talks: { id: string; title: string }[];
  initialType?: RequestKey;
  initialTalk?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [f, setF] = useState({
    first: "", last: "", email: "", phone: "",
    type: initialType as RequestKey,
    talk: initialTalk,
    org: "", date: "", location: "", audience: "Not sure yet", details: "",
  });

  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.value });

  const media = f.type === "podcast" || f.type === "press";
  const speaking = f.type === "speaking";
  const orgLabel = media ? "Outlet or show" : "Organization or event";
  const dateLabel = media ? "Deadline or air date" : "Event date";
  const talkTitle = talks.find((t) => t.id === f.talk)?.title;

  async function submit() {
    if (!f.first.trim() || !f.email.trim() || !f.phone.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");

    const lines = [
      `Request: ${REQUEST_TYPES[f.type]}`,
      speaking && `Talk: ${talkTitle ?? "Not chosen yet"}`,
      f.org.trim() && `${orgLabel}: ${f.org.trim()}`,
      f.date.trim() && `${dateLabel}: ${f.date.trim()}`,
      speaking && f.location.trim() && `Location: ${f.location.trim()}`,
      speaking && `Audience: ${f.audience}`,
      f.details.trim() && `\nDetails:\n${f.details.trim()}`,
    ].filter(Boolean);

    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first: f.first,
          last: f.last,
          email: f.email,
          phone: f.phone,
          intent: `Booking: ${REQUEST_TYPES[f.type]}`,
          notes: lines.join("\n"),
          source: "booking",
        }),
      });
      setStatus(r.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className={s.form}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 34, textTransform: "uppercase", margin: 0 }}>
          Request received.
        </h3>
        <p className={s.lede} style={{ marginTop: 8 }}>
          Chris&rsquo;s team reviews every booking request personally and comes
          back to you with availability and next steps.
        </p>
      </div>
    );
  }

  return (
    <div className={s.form}>
      <div className={s.field}>
        <label htmlFor="bk-type">What are you booking?</label>
        <select id="bk-type" value={f.type} onChange={set("type")}>
          {(Object.keys(REQUEST_TYPES) as RequestKey[]).map((k) => (
            <option key={k} value={k}>{REQUEST_TYPES[k]}</option>
          ))}
        </select>
      </div>

      {speaking && talks.length > 0 && (
        <div className={s.field}>
          <label htmlFor="bk-talk">Which talk?</label>
          <select id="bk-talk" value={f.talk} onChange={set("talk")}>
            <option value="">Not sure yet — help me choose</option>
            {talks.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
      )}

      <div className={s.row2}>
        <div className={s.field}>
          <label htmlFor="bk-first">First name</label>
          <input id="bk-first" value={f.first} onChange={set("first")} autoComplete="given-name" />
        </div>
        <div className={s.field}>
          <label htmlFor="bk-last">Last name</label>
          <input id="bk-last" value={f.last} onChange={set("last")} autoComplete="family-name" />
        </div>
      </div>
      <div className={s.row2}>
        <div className={s.field}>
          <label htmlFor="bk-email">Email</label>
          <input id="bk-email" type="email" value={f.email} onChange={set("email")} autoComplete="email" />
        </div>
        <div className={s.field}>
          <label htmlFor="bk-phone">Mobile</label>
          <input id="bk-phone" type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" />
        </div>
      </div>

      <div className={s.row2}>
        <div className={s.field}>
          <label htmlFor="bk-org">{orgLabel}</label>
          <input id="bk-org" value={f.org} onChange={set("org")} autoComplete="organization" />
        </div>
        <div className={s.field}>
          <label htmlFor="bk-date">{dateLabel}</label>
          <input id="bk-date" value={f.date} onChange={set("date")} placeholder="Approximate is fine" />
        </div>
      </div>

      {speaking && (
        <div className={s.row2}>
          <div className={s.field}>
            <label htmlFor="bk-loc">City or venue</label>
            <input id="bk-loc" value={f.location} onChange={set("location")} />
          </div>
          <div className={s.field}>
            <label htmlFor="bk-aud">Audience size</label>
            <select id="bk-aud" value={f.audience} onChange={set("audience")}>
              <option>Under 50</option>
              <option>50 to 200</option>
              <option>200 to 1,000</option>
              <option>1,000 or more</option>
              <option>Not sure yet</option>
            </select>
          </div>
        </div>
      )}

      <div className={s.field}>
        <label htmlFor="bk-details">Tell us about it</label>
        <textarea
          id="bk-details"
          value={f.details}
          onChange={set("details")}
          placeholder={
            media
              ? "The angle, the format, and who the audience is."
              : "The audience, the goal of the event, and anything we should know."
          }
        />
      </div>

      <div>
        <button
          type="button"
          onClick={submit}
          disabled={status === "sending"}
          className={`${s.btn} ${s.btnSolid}`}
          style={{ border: 0, cursor: "pointer" }}
        >
          {status === "sending" ? "Sending..." : "Send the request"}{" "}
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      {status === "error" && (
        <p className={s.disc} style={{ color: "#EB2933" }}>
          Name, email and mobile are required. If it still won&rsquo;t go through,
          try again in a minute.
        </p>
      )}
      <p className={s.disc}>
        We&rsquo;ll only use this to respond to your request. We do not sell
        your information.
      </p>
    </div>
  );
}
