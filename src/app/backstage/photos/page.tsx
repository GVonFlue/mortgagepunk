import Shell from "@/components/backstage/Shell";
import PhotoManager from "@/components/backstage/PhotoManager";
import Notice from "@/components/backstage/Notice";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getImages } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = { title: "Photos — Backstage" };

export default async function Photos() {
  const [probe, images] = await Promise.all([dbProbe(), getImages()]);

  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Photos</h1>
          <p className={s.sub}>
            Swap the photograph in any of these spots. Changes go live
            immediately, and every one of them can be put back to the original
            with a single click.
          </p>
        </div>
      </div>

      <Notice configured={probe.ok} error={probe.error} />

      <PhotoManager initial={images} />

      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>A note on picture quality</h2>
        </div>
        <p className={s.help} style={{ margin: 0 }}>
          Upload the biggest version you have. The site shrinks a large photo
          down cleanly, but it cannot add detail to a small one — a small file
          stretched across a wide screen is what makes a picture look soft or
          blocky. Aim for at least 1600 pixels across for the wide shots.
        </p>
      </div>
    </Shell>
  );
}
