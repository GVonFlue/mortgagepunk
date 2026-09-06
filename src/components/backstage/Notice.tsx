import s from "./Backstage.module.css";

/**
 * Honest banner about the database connection.
 *
 * Takes the result of an actual probe, not just "are the env vars set". Reads
 * fall back to seed data when a query fails, so without a real check a broken
 * credential is indistinguishable from a working one — the dashboard looks
 * fine and silently saves nothing.
 */
export default function Notice({
  configured,
  error,
}: {
  configured: boolean;
  error?: string;
}) {
  if (configured) return null;
  return (
    <div className={s.notice}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5.5M12 16.2v.3" />
      </svg>
      <span>
        <b>Not saving.</b> The database isn&rsquo;t reachable, so you can click
        through everything but nothing will persist.
        {error && (
          <>
            <br />
            <code style={{ fontSize: 11.5, opacity: 0.85 }}>{error}</code>
          </>
        )}
      </span>
    </div>
  );
}
