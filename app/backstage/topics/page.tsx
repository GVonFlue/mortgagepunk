import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import TopicsManager from "@/components/backstage/TopicsManager";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getTopics, getVideos } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  const probe = await dbProbe();
  const [topics, videos] = await Promise.all([getTopics(), getVideos()]);

  // how many videos sit under each topic — shown so Chris can see the impact
  // of a rename or removal before he does it
  const usage: Record<string, number> = {};
  for (const v of videos) {
    for (const t of v.topics ?? []) usage[t] = (usage[t] ?? 0) + 1;
  }

  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Topics</h1>
          <p className={s.sub}>
            The filter chips on the library page. Add a category when you start
            covering something new, and reorder them so the ones you care about
            come first.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />
      <TopicsManager initial={topics} configured={probe.ok} usage={usage} />
    </Shell>
  );
}
