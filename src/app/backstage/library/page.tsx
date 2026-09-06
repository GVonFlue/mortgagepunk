import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import LibraryManager from "@/components/backstage/LibraryManager";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getVideos } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const probe = await dbProbe();
  const videos = await getVideos();
  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>The Library</h1>
          <p className={s.sub}>
            Paste a YouTube link, pick a topic, write two sentences. The title
            and thumbnail come from YouTube automatically, so there is never an
            image to upload.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />
      <LibraryManager initial={videos} configured={probe.ok} />
    </Shell>
  );
}
