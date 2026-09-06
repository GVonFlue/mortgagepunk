import Link from "next/link";
import s from "../Site.module.css";

/**
 * The homepage fork.
 *
 * Replaces the old two-panel version, which asked the same question the hero
 * had already asked one screen earlier. More importantly it adds the middle
 * door: most visitors are neither ready to apply nor here for the movement —
 * they want to know what the numbers look like without talking to anyone yet.
 * With no door for them, they left.
 *
 * Each tile now carries three specifics so the choice is informed rather than
 * a coin flip between two moods.
 */
const DOORS = [
  {
    tone: "doorRed",
    tag: "Ready now",
    title: "Get approved the right way",
    body: "A full pre-approval, underwritten up front, that holds up when you make an offer.",
    points: [
      "Underwritten, not a printout",
      "Your real number in 24 hours",
      "A person on your file, start to close",
    ],
    cta: "Start your approval",
    href: "/get-approved",
  },
  {
    tone: "doorMid",
    tag: "Just looking",
    title: "See what you can afford",
    body: "Run your own numbers first. No signup, no credit pull, nobody calling you about it.",
    points: [
      "Affordability and payment calculators",
      "Refinance break-even math",
      "Honest numbers, taxes and insurance included",
    ],
    cta: "Open the tools",
    href: "/tools",
  },
  {
    tone: "doorDark",
    tag: "Here to learn",
    title: "Follow the movement",
    body: "The Game of Money, explained by someone with no reason to keep it complicated.",
    points: [
      "Free video library, no gate",
      "The American Dream Conference",
      "Guides you can actually keep",
    ],
    cta: "Join the movement",
    href: "/movement",
  },
] as const;

export default function ThreeDoors() {
  return (
    <section className={s.doors} aria-label="Where to start">
      {DOORS.map((d) => (
        <Link key={d.title} href={d.href} className={`${s.door} ${s[d.tone]}`}>
          <span className={s.doorTag}>{d.tag}</span>
          <h3>{d.title}</h3>
          <p>{d.body}</p>
          <ul className={s.doorList}>
            {d.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <span className={s.doorGo}>
            {d.cta} <span aria-hidden="true">&rarr;</span>
          </span>
        </Link>
      ))}
    </section>
  );
}
