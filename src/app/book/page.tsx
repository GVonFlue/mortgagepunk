import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import BookingForm from "@/components/sections/BookingForm";
import s from "@/components/Site.module.css";
import { getTalks } from "@/lib/db";
import { asRequestKey } from "@/lib/booking";
import { APPLY_URL, EXTERNAL } from "@/lib/links";

export const metadata = {
  title: "Book Chris Waipa — Mortgage Punk",
  description:
    "Book Chris Waipa for your stage, podcast or publication, or partner on the American Dream Conference.",
};

/**
 * /book — every request to get Chris somewhere.
 *
 * Speaking, podcasts, press, partnerships and conference sponsorship. This
 * replaced /contact, which was a lending form with a paragraph about speaking
 * bolted above it; /contact now redirects here.
 *
 * PRE-FILLED FROM THE LINK THAT OPENED IT:
 *   /book?type=press            opens on Press
 *   /book?type=sponsorship      opens on conference sponsorship
 *   /book?talk=<talk id>        opens on Speaking with that talk chosen
 * Unknown values fall back to Speaking rather than erroring, because these
 * links get pasted into emails and a typo should still reach a working form.
 *
 * Talks come from Backstage → Speaking, the same list /about shows, so a talk
 * added or renamed there appears here with no deploy.
 *
 * A borrower who lands here by accident — the old /contact URL was the
 * catch-all — is pointed at the application portal rather than left to fill
 * in a booking form.
 */
export default async function Book({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; talk?: string }>;
}) {
  const [params, talks] = await Promise.all([searchParams, getTalks()]);

  const talk = talks.find((t) => t.id === params.talk)?.id ?? "";
  const type = talk ? "speaking" : asRequestKey(params.type) ?? "speaking";

  return (
    <>
      <AnnouncementBar />
      <SiteNav />

      <section className={`${s.sec} ${s.dark} ${s.wash} ${s.washStage}`} aria-label="Book Chris Waipa">
        <div className={s.wrap}>
          <div className={s.lead}>
            <div>
              <div className={s.kick}>Book Chris</div>
              <h1 className={s.h2}>
                Get Chris
                <br />
                <em>in the room.</em>
              </h1>
              <p className={s.lede}>
                Keynotes, breakouts, podcasts, press and partnerships. Tell us
                the room and the date and someone comes back to you with
                availability.
              </p>
              <p className={s.lede} style={{ marginTop: 18 }}>
                Booking is coordinated by Ashley Thill.
              </p>
              <p className={s.disc} style={{ marginTop: 28 }}>
                Looking for a mortgage instead?{" "}
                <a href={APPLY_URL} {...EXTERNAL} style={{ color: "var(--mp-red)" }}>
                  Get approved &rarr;
                </a>{" "}
                or{" "}
                <Link href="/#ask" style={{ color: "var(--mp-red)" }}>
                  ask a question
                </Link>
                .
              </p>
            </div>
            {/* keyed so a client-side hop between two /book links (say
                from a talk to Press) remounts the form with the new values
                instead of keeping the old ones in state */}
            <BookingForm
              key={`${type}-${talk}`}
              talks={talks.map((t) => ({ id: t.id, title: t.title }))}
              initialType={type}
              initialTalk={talk}
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
