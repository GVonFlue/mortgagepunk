import s from "./Backstage.module.css";

/**
 * Honest banner shown whenever the database isn't wired up yet. Better that
 * Chris sees "this won't save" up front than discovers it after typing.
 */
export default function Notice({ configured }: { configured: boolean }) {
  if (configured) return null;
  return (
    <div className={s.notice}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5.5M12 16.2v.3" />
      </svg>
      <span>
        <b>Preview mode.</b> The database isn&rsquo;t connected yet, so you can
        click through everything but changes won&rsquo;t save. Set{" "}
        <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_KEY</code> in Vercel
        and run <code>supabase-schema.sql</code> to switch this on.
      </span>
    </div>
  );
}
