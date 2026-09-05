import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import ConferenceEditor from "@/components/backstage/ConferenceEditor";
import s from "@/components/backstage/Backstage.module.css";
import { isConfigured, SEED_CONFERENCE } from "@/lib/content";

export default function ConferencePage() {
  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Conference</h1>
          <p className={s.sub}>
            The American Dream Conference card on the homepage. Update it once a
            year and the site keeps itself current — no rebuild.
          </p>
        </div>
      </div>
      <Notice configured={isConfigured()} />
      <ConferenceEditor initial={SEED_CONFERENCE} configured={isConfigured()} />
    </Shell>
  );
}
