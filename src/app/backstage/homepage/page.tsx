import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import HeroEditor from "@/components/backstage/HeroEditor";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getHero } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomepagePage() {
  const probe = await dbProbe();
  const hero = await getHero();
  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Homepage</h1>
          <p className={s.sub}>
            The words in the hero and what the buttons say. The layout
            doesn&rsquo;t change — the headline still sits behind Chris exactly
            as it does now, and long lines scale themselves down so nothing can
            run off the edge.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />
      <HeroEditor initial={hero} configured={probe.ok} />
    </Shell>
  );
}
