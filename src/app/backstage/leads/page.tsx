import Link from "next/link";
import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getLeads } from "@/lib/db";
import { LEAD_KINDS, isLeadKind, kindOf, type LeadKind } from "@/lib/leadTypes";

export const dynamic = "force-dynamic";

/**
 * Backstage → Leads, sorted by where each one came from.
 *
 * One tab per kind: the ticket list, Book Chris, the assistant, calls booked
 * and everything else. Each tab has its own download, so the ticket list can
 * go to whoever runs the conference without the mortgage leads going with it.
 *
 * Read-only on purpose. Leads are a record, not something to edit.
 *
 * IT SAYS WHETHER LEADS ARE BEING EMAILED, because the old copy here promised
 * that every lead "also went to your inbox and the backup sheet", which is
 * only true when LEAD_ENDPOINT is set in Vercel. Only whether it is set is
 * read here, never its value.
 */
export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const active: LeadKind | null = isLeadKind(type) ? type : null;

  const [probe, all] = await Promise.all([dbProbe(), getLeads(1000)]);
  const counts = Object.fromEntries(
    LEAD_KINDS.map((k) => [k.key, all.filter((l) => kindOf(l.source) === k.key).length])
  ) as Record<LeadKind, number>;
  const leads = active ? all.filter((l) => kindOf(l.source) === active) : all;
  const kind = LEAD_KINDS.find((k) => k.key === active);
  const emailing = Boolean(process.env.LEAD_ENDPOINT || process.env.LEAD_WEBHOOK);

  const tab = (href: string, label: string, n: number, on: boolean) => (
    <Link
      key={href}
      href={href}
      className={`${s.pill} ${on ? s.pillRed : ""}`}
      style={{ textDecoration: "none", padding: "7px 13px", fontSize: 13.5 }}
      aria-current={on ? "page" : undefined}
    >
      {label} <span style={{ opacity: 0.75, marginLeft: 4 }}>{n}</span>
    </Link>
  );

  const link = { color: "var(--ink)", textDecorationColor: "var(--rule2)" };

  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Leads</h1>
          <p className={s.sub}>
            Everyone who filled out a form on the site, newest first, sorted by
            which form they used. Download any tab as a spreadsheet.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />

      {!emailing && (
        <div className={s.notice}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5.5M12 16.2v.3" />
          </svg>
          <span>
            <b>Leads are saved here but not emailed yet.</b> The email and
            backup-sheet connection hasn&rsquo;t been switched on. Check this
            page until it is. Text ProyTech to turn it on.
          </span>
        </div>
      )}

      <nav
        aria-label="Kinds of lead"
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}
      >
        {tab("/backstage/leads", "All", all.length, !active)}
        {LEAD_KINDS.map((k) =>
          tab(`/backstage/leads?type=${k.key}`, k.label, counts[k.key], active === k.key)
        )}
      </nav>

      <div className={s.cardHead} style={{ marginBottom: 14 }}>
        <p className={s.help} style={{ margin: 0 }}>
          {kind ? kind.blurb : "Every form, every kind."}
        </p>
        <a
          className={`${s.btn} ${s.btnGhost}`}
          href={`/api/backstage/leads${active ? `?type=${active}` : ""}`}
          style={{ textDecoration: "none" }}
        >
          Download {kind ? kind.label : "all"} ({leads.length})
        </a>
      </div>

      {leads.length === 0 ? (
        <div className={s.empty}>
          Nothing here yet. They&rsquo;ll appear the moment the first one comes
          through.
        </div>
      ) : (
        leads.map((l) => {
          const k = LEAD_KINDS.find((x) => x.key === kindOf(l.source));
          return (
            <div key={l.id} className={s.card}>
              <div className={s.cardHead}>
                <h2 className={s.cardTitle}>
                  {l.first} {l.last}
                </h2>
                <span style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {!active && k && <span className={`${s.pill} ${s.pillMuted}`}>{k.label}</span>}
                  <span className={s.pill}>
                    {new Date(l.created_at).toLocaleString("en-US", {
                      timeZone: "America/Chicago",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </span>
              </div>
              <div className={s.grid3}>
                <div>
                  <span className={s.label}>Email</span>
                  <p className={s.rowBlurb}>
                    {l.email ? <a href={`mailto:${l.email}`} style={link}>{l.email}</a> : "—"}
                  </p>
                </div>
                <div>
                  <span className={s.label}>Phone</span>
                  <p className={s.rowBlurb}>
                    {l.phone ? <a href={`tel:${l.phone}`} style={link}>{l.phone}</a> : "—"}
                  </p>
                </div>
                <div>
                  <span className={s.label}>Looking for</span>
                  <p className={s.rowBlurb}>{l.intent}</p>
                </div>
              </div>
              {/* Short notes show in full. A chat lead carries the whole
                  conversation, which would make one card a page long, so
                  long notes fold away behind a click. */}
              {l.notes && l.notes.length <= 400 && (
                <>
                  <span className={s.label} style={{ marginTop: 14 }}>Notes</span>
                  <p className={s.rowBlurb} style={{ whiteSpace: "pre-line" }}>{l.notes}</p>
                </>
              )}
              {l.notes && l.notes.length > 400 && (
                <details style={{ marginTop: 14 }}>
                  <summary className={s.label} style={{ cursor: "pointer", display: "list-item" }}>
                    Notes and conversation
                  </summary>
                  <p className={s.rowBlurb} style={{ whiteSpace: "pre-line", marginTop: 8 }}>{l.notes}</p>
                </details>
              )}
            </div>
          );
        })
      )}
    </Shell>
  );
}
