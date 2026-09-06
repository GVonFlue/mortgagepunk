import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import ListEditor from "@/components/backstage/ListEditor";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getPress } from "@/lib/db";
import { LIMITS } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function PressPage() {
  const probe = await dbProbe();
  const press = await getPress();
  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Press</h1>
          <p className={s.sub}>
            Features, recognition and coverage on the About page. Mark anything
            unconfirmed as pending — it stays visible to you and stays off the
            public site until you clear it.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />
      <ListEditor
        endpoint="/api/backstage/press"
        initial={press.map((p) => ({
          id: p.id, title: p.outlet, blurb: p.note, tag: p.kind, pending: p.pending,
        }))}
        titleLabel="Outlet"
        blurbLabel="What it was"
        titleMax={LIMITS.pressOutlet}
        blurbMax={LIMITS.pressNote}
        tagOptions={["Feature", "Recognition", "Broadcast", "Podcast", "Interview"]}
        allowPending
        addLabel="Add a press item"
        configured={probe.ok}
      />
    </Shell>
  );
}
