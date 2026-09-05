import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import LibraryManager from "@/components/backstage/LibraryManager";
import s from "@/components/backstage/Backstage.module.css";
import { isConfigured, SEED_VIDEOS } from "@/lib/content";

export default function LibraryPage() {
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
      <Notice configured={isConfigured()} />
      <LibraryManager initial={SEED_VIDEOS} configured={isConfigured()} />
    </Shell>
  );
}
