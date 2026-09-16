import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getLeads } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Read-only on purpose. Leads are a record, not something to edit. */
export default async function LeadsPage() {
  const probe = await dbProbe();
  const leads = await getLeads();
  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Leads</h1>
          <p className={s.sub}>
            Everyone who filled out a form on the site, newest first. Read-only —
            this is a record, not something to edit. Every one of these also went
            to your inbox and the backup sheet the moment it came in.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />

      {leads.length === 0 ? (
        <div className={s.empty}>
          No leads yet. They&rsquo;ll appear here the moment the first form comes
          through.
        </div>
      ) : (
        leads.map((l) => (
          <div key={l.id} className={s.card}>
            <div className={s.cardHead}>
              <h2 className={s.cardTitle}>{l.first} {l.last}</h2>
              <span className={s.pill}>
                {new Date(l.created_at).toLocaleString()}
              </span>
            </div>
            <div className={s.grid3}>
              <div>
                <span className={s.label}>Email</span>
                <p className={s.rowBlurb}>
                  <a href={`mailto:${l.email}`} style={{ color: "#EDEBE8" }}>{l.email}</a>
                </p>
              </div>
              <div>
                <span className={s.label}>Phone</span>
                <p className={s.rowBlurb}>
                  <a href={`tel:${l.phone}`} style={{ color: "#EDEBE8" }}>{l.phone}</a>
                </p>
              </div>
              <div>
                <span className={s.label}>Looking for</span>
                <p className={s.rowBlurb}>{l.intent}</p>
              </div>
            </div>
            {l.notes && (
              <>
                <span className={s.label} style={{ marginTop: 14 }}>Notes</span>
                <p className={s.rowBlurb}>{l.notes}</p>
              </>
            )}
          </div>
        ))
      )}
    </Shell>
  );
}
