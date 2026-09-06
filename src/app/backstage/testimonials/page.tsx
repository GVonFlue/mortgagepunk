import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import TestimonialsManager from "@/components/backstage/TestimonialsManager";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getTestimonials } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const probe = await dbProbe();
  const items = await getTestimonials();
  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Testimonials</h1>
          <p className={s.sub}>
            Three sit on the homepage, the rest live on the testimonials page.
            Everything starts as a draft — nothing goes public until you publish
            it, because these are real people being quoted by name.
          </p>
        </div>
      </div>
      <Notice configured={probe.ok} error={probe.error} />
      <TestimonialsManager initial={items} configured={probe.ok} />
    </Shell>
  );
}
