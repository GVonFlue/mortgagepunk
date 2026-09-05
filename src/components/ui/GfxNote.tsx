import s from "../Site.module.css";

/**
 * Placeholder marker for artwork Chris still owes us.
 *
 * Deliberately visible so it reads as an intentional talking point during a
 * walkthrough rather than as unfinished work. Delete the component and its
 * usages once the real graphics land.
 *
 * `where` positions it: "path" bottom-right of a path panel, "evt" top-right
 * of the conference card. The parent must be position:relative.
 */
export default function GfxNote({ where = "path" }: { where?: "path" | "evt" }) {
  return (
    <span className={`${s.gfxNote} ${where === "evt" ? s.gfxEvt : s.gfxPath}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.6" />
        <path d="m4 17 5-5 4 4 3-2.5 4 3.5" />
      </svg>
      Get graphics from Mortgage Punk
    </span>
  );
}
