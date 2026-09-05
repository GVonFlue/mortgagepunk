import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import AnnouncementEditor from "@/components/backstage/AnnouncementEditor";
import s from "@/components/backstage/Backstage.module.css";
import { isConfigured, SEED_ANNOUNCEMENT } from "@/lib/content";

export default function SettingsPage() {
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
      <Notice configured={isConfigured()} />
      <AnnouncementEditor initial={SEED_ANNOUNCEMENT} configured={isConfigured()} />
    </Shell>
  );
}
