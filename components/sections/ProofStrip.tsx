import s from "../Site.module.css";

// Four proof points, lifted from the client's approved hero concept.
const CELLS = [
  {
    title: ["World-Class", "Lending Team"],
    body: "Fast. Transparent. Relentless.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#EB2933" strokeWidth="2">
        <circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.2" />
        <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
        <path d="M15.5 20c0-2.3 1.4-3.6 3.5-3.6s3 1.3 3 3.6" />
      </svg>
    ),
  },
  {
    title: ["Game Changing", "Mortgage Experience"],
    body: "No runaround. No fine print. No BS.",
    icon: <svg viewBox="0 0 24 24" fill="#EB2933"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg>,
  },
  {
    title: ["For Buyers, Owners,", "Investors & Pros"],
    body: "Real solutions for real people.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#EB2933" strokeWidth="2">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.2" fill="#EB2933" />
      </svg>
    ),
  },
  {
    title: ["Reigniting", "the Culture"],
    body: "Education. Opportunity. Financial freedom.",
    icon: <svg viewBox="0 0 24 24" fill="#EB2933"><path d="M5 3v18h2v-7h11l-2.4-3.5L18 7H7V3z" /></svg>,
  },
];

export default function ProofStrip() {
  return (
    <section className={s.proof} aria-label="Why Mortgage Punk">
      {CELLS.map((c) => (
        <div key={c.title[0]} className={s.cell}>
          <span className={s.ic} aria-hidden="true">{c.icon}</span>
          <h3>{c.title[0]}<br />{c.title[1]}</h3>
          <p>{c.body}</p>
        </div>
      ))}
    </section>
  );
}
