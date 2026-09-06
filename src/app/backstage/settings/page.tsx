import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import AnnouncementEditor from "@/components/backstage/AnnouncementEditor";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getAnnouncement } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const probe = await dbProbe();
  const announcement = await getAnnouncement();
  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Announcement</h1>
          <p className={s.sub}>
            A red bar across the top of every page. Turn it on when tickets drop
            or something is happening, turn it off when it&rsquo;s over. Leaving
            it on permanently is how people stop seeing it.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />
      <AnnouncementEditor initial={announcement} configured={probe.ok} />
    </Shell>
  );
}
