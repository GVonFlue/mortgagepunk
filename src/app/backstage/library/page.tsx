import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import LibraryManager from "@/components/backstage/LibraryManager";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getVideos, getTopics } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const probe = await dbProbe();
  const [videos, topics] = await Promise.all([getVideos(), getTopics()]);
  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>The Library</h1>
          <p className={s.sub}>
            Paste a YouTube link, tag it with every topic it fits, write two
            sentences. The title and thumbnail come from YouTube automatically,
            so there is never an image to upload.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />
      <LibraryManager initial={videos} topics={topics} configured={probe.ok} />
    </Shell>
  );
}
