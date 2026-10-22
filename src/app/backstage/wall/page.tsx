import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import WallManager from "@/components/backstage/WallManager";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getSocialTiles, wallTableReady } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function WallPage() {
  const [probe, table, items] = await Promise.all([
    dbProbe(),
    wallTableReady(),
    getSocialTiles(),
  ]);

  // Connected, but the one-time setup for this screen hasn't been run. Say so
  // plainly rather than letting a whole wall be arranged and then refused.
  const needsSetup = probe.ok && !table.ok;

  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Movement wall</h1>
          <p className={s.sub}>
            The pictures under The Movement on the home page. Add a post, paste
            its link so the picture opens that post on Instagram, and drag them
            into the order you want.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />
      {needsSetup && (
        <div className={s.notice}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5.5M12 16.2v.3" />
          </svg>
          <span>
            <b>One setup step left.</b> This screen needs its table in the
            database before it can save. Until then the wall on the site stays
            exactly as it is. Text ProyTech and it&rsquo;ll be switched on.
          </span>
        </div>
      )}
      <WallManager initial={items} configured={probe.ok && table.ok} />
    </Shell>
  );
}
