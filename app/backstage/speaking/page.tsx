import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import ListEditor from "@/components/backstage/ListEditor";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getTalks } from "@/lib/db";
import { LIMITS } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SpeakingPage() {
  const probe = await dbProbe();
  const talks = await getTalks();
  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Speaking</h1>
          <p className={s.sub}>
            The talks listed on your About page. They render like tour dates, so
            keep the titles short and let the line underneath do the selling.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />
      <ListEditor
        endpoint="/api/backstage/speaking"
        initial={talks.map((t) => ({
          id: t.id, title: t.title, blurb: t.blurb, tag: "", pending: false,
        }))}
        titleLabel="Talk title"
        blurbLabel="One line on what it covers"
        titleMax={LIMITS.talkTitle}
        blurbMax={LIMITS.talkBlurb}
        addLabel="Add a talk"
        configured={probe.ok}
      />
    </Shell>
  );
}
