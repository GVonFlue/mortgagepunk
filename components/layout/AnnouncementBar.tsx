import s from "../Site.module.css";
import { getAnnouncement } from "@/lib/db";

/**
 * Site-wide banner, controlled from /backstage → Announcement.
 * Renders nothing at all when switched off, so there is no empty strip and no
 * layout shift on pages where it isn't showing.
 */
export default async function AnnouncementBar() {
  const a = await getAnnouncement();
  if (!a.enabled || !a.text.trim()) return null;

  const inner = (
    <>
      {a.text} <span aria-hidden="true">&rarr;</span>
    </>
  );

  return (
    <div className={s.annBar}>
      {a.href ? (
        <a href={a.href} target="_blank" rel="noopener noreferrer">{inner}</a>
      ) : (
        <span>{inner}</span>
      )}
    </div>
  );
}
