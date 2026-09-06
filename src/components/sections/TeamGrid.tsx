import Image from "next/image";
import Link from "next/link";
import s from "../Site.module.css";
import { TEAM } from "@/lib/team";

/**
 * Team cards. Pending members render dimmed with a marked photo slot so the
 * gap is a visible talking point in a walkthrough rather than a missing row.
 */
export default function TeamGrid() {
  return (
    <div className={s.teamGrid}>
      {TEAM.map((m) => (
        <Link
          key={m.slug}
          href={`/team/${m.slug}`}
          className={`${s.teamCard} ${m.pending ? s.teamPending : ""}`}
        >
          <div className={s.teamPhoto}>
            {m.photo ? (
              <Image
                src={m.photo}
                alt={m.name}
                width={630}
                height={954}
                sizes="(max-width: 700px) 90vw, 26vw"
              />
            ) : (
              <div className={s.teamPhotoEmpty}>
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none"
                  stroke="#EB2933" strokeWidth="1.6" aria-hidden="true">
                  <circle cx="12" cy="8.5" r="3.6" />
                  <path d="M4.5 20c0-4 3.4-6.2 7.5-6.2s7.5 2.2 7.5 6.2" />
                </svg>
                <span>Headshot needed</span>
              </div>
            )}
          </div>
          <div className={s.teamBody}>
            <h3 className={s.teamName}>{m.name}</h3>
            <span className={s.teamRole}>{m.role}</span>
            <p className={s.teamShort}>{m.short}</p>
            <div className={s.teamMeta}>
              <span className={s.chip}>{m.market}</span>
              {m.nmls && <span className={s.chip}>NMLS #{m.nmls}</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
