import Link from "next/link";
import s from "../Site.module.css";

/**
 * The three routes into lending.
 *
 * Deliberately loud and button-first: the lending page was a wall of black
 * with nothing pulling the eye toward an action. Each card is a full link, the
 * red button is the brightest thing in the section, and each one leads to a
 * page with real depth rather than a marketing paragraph.
 */
const PATHS = [
  {
    no: "01",
    title: "Buy a home",
    body: "First home or fifth. A pre-approval that means something and a team that answers the phone.",
    cta: "How buying works",
    href: "/lending/buy",
  },
  {
    no: "02",
    title: "Refinance",
    body: "A straight answer on whether it actually makes sense for you, including the times it doesn't.",
    cta: "Run the numbers",
    href: "/lending/refinance",
  },
  {
    no: "03",
    title: "Investors",
    body: "Financing built for people buying their second, fifth, or twentieth property.",
    cta: "Investor financing",
    href: "/lending/investors",
  },
];

export default function LendingPaths() {
  return (
    <div className={s.lpaths}>
      {PATHS.map((p) => (
        <Link key={p.no} href={p.href} className={s.lpath}>
          <div>
            <div className={s.lpathNo}>{p.no}</div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
          <span className={s.lpathGo}>
            {p.cta} <span aria-hidden="true">&rarr;</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
