import Image from "next/image";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import PhotoSlot from "@/components/ui/PhotoSlot";
import CallBooking from "@/components/ui/CallBooking";
import a from "@/components/sections/About.module.css";
import { getTalks, getImages } from "@/lib/db";
import { pickImage } from "@/lib/images";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "About Chris Waipa",
  description:
    "Founder of Mortgage Punk, loan officer, speaker, and creator of the American Dream Conference. Reimagining the American Dream.",
  path: "/about",
});

/**
 * /about — built as an ARTIST SITE, not a corporate bio page.
 *
 * Chris's onboarding was explicit: the Avril reference is about the
 * experience, not the brand. "It feels like entering the world of an artist,
 * not navigating a traditional corporate website." So: full-bleed photography,
 * poster-scale type, a marquee ticker, and speaking topics laid out the way an
 * artist site lists tour dates.
 *
 * Copy is Chris's own, from onboarding. Do not rewrite it without asking.
 */


const MARQUEE = [
  "Reimagining the American Dream",
  "The Game of Money",
  "Living Beyond a Paycheck",
];

/** `pending` items render dimmed and must not publish until verified. */
export const revalidate = 300;

export default async function About() {
  const [talks, images] = await Promise.all([
    getTalks(),
    getImages(),
  ]);

  // Photographs are swappable from Backstage → Photos. pickImage falls back
  // to the file that shipped with the build, so an empty table, an
  // unreachable database and a fresh install all render exactly what is on
  // the site today. See lib/images.ts.
  const heroPhoto = pickImage(images, "about-hero");
  const portrait = pickImage(images, "about-portrait");
  const bookingPhoto = pickImage(images, "about-booking");

  return (
    <>
      <AnnouncementBar />
      <SiteNav />

      {/* 1 — full-bleed hero */}
      <section className={a.hero}>
        <div className={a.heroImg}>
          <Image
            src={heroPhoto.src}
            alt="Chris Waipa"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "58% 28%" }}
          />
        </div>
        <div className={a.heroInner}>
          <div className={a.eyebrow}>Founder &middot; Speaker &middot; Movement Leader</div>
          {/* THE NAME IS DRAWN, NOT SET — the same ransom-note system as The
              Game of Money and The Movement, so the one page that is about
              the person behind the brand is finally in the brand's own
              lettering instead of a typeface approximating it.

              The h1 keeps real words in it. The artwork is decorative and
              carries alt="", with the name visually hidden beside it, so the
              heading is still a real h1 for search and assistive tech — the
              same arrangement Section uses for its titleArt. */}
          <h1 className={a.name}>
            <span className={a.srOnly}>Chris Waipa</span>
            <Image
              className={a.nameArt}
              src="/brand/wordmark-chris-waipa.png"
              alt=""
              width={2107}
              height={1105}
              priority
              sizes="(max-width: 900px) 86vw, 46vw"
            />
          </h1>
          <div className={a.heroMeta}>
            <span>Loan Officer</span>
            <span>Founder, Mortgage Punk</span>
            <span>Creator, The American Dream Conference</span>
          </div>
        </div>
      </section>

      {/* 2 — marquee. Duplicated once so the -50% loop is seamless. */}
      <div className={a.marquee}>
        <div className={a.marqueeTrack}>
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>
              {t}
              <span aria-hidden="true"> &#9670; </span>
            </span>
          ))}
        </div>
      </div>

      {/* 3 — the story */}
      <section className={`${a.story} ${a.wash} ${a.washStage}`}>
        <div className={a.storyGrid}>
          <div>
            <p className={a.pull}>
              Two words that were
              <br />
              <em>
                never supposed to
                <br />
                go together.
              </em>
            </p>
            <div className={a.body}>
              <p>
                More than two decades ago, Chris and his wife were seriously
                chasing music. Creativity, connection, and the chance to affect
                people were a real part of who he was.
              </p>
              <p>
                Life took him into mortgage lending instead, where he built a
                successful career and grew steadily more frustrated by an
                industry that left people confused, stressed, and treated like
                transactions rather than people.
              </p>
              <p>
                Then, during a branding conversation, a young designer described
                an idea as looking like <strong>&ldquo;mortgage punk.&rdquo;</strong>{" "}
                The two words were not supposed to fit together. That was exactly
                why they worked.
              </p>
              <p>
                What began as an unconventional approach to a very conventional
                industry has grown into a lending team, a media platform, an
                education community, a live event, and a movement.
              </p>
              <p>
                Today Chris is building a world-class lending team and a growing
                ecosystem connecting homeownership, real-estate investing, taxes,
                entrepreneurship, wealth-building and living beyond a paycheck.{" "}
                <strong>
                  The stage changed from the music days. The desire to use
                  creativity and connection to impact people&rsquo;s lives never
                  did.
                </strong>
              </p>
            </div>
          </div>
          <div className={a.portrait}>
            {/* THE FRAME EXISTS SO THE BUTTON BELOW CANNOT MOVE THE SLAB OR
                THE TAG. Both are positioned in percentages — the red slab is
                inset 6%/12% and the tag sits at bottom:6% — so measuring
                them against a box that now also contains a call to action
                would stretch the slab past the photo and slide the tag down
                off it. They measure against the picture instead. */}
            <div className={a.portraitFrame}>
              {/* The shipped default here is 1080x1200. The previous file was
                  630x954 and was being drawn larger than its own pixels,
                  which is what made it look soft against everything around
                  it. */}
              <Image
                src={portrait.src}
                alt="Chris Waipa"
                width={portrait.width}
                height={portrait.height}
                sizes="(max-width: 900px) 80vw, 34vw"
              />
              <span className={a.portraitTag}>Wichita, Kansas</span>
            </div>

            {/* THE SAME EVENT AS THE HOME PAGE'S CARD, not the speaking desk.
                There is a second one of these further down in the lending
                band, and that is deliberate rather than an oversight: this
                page is long, and the point at which somebody finishes
                reading his story is the point at which they want to talk to
                him. Making them scroll on to find the ask loses the ones who
                stop here. */}
            <CallBooking
              className={`${a.btn} ${a.btnRed} ${a.portraitCta}`}
              label="Schedule a call with Chris"
            />
          </div>
        </div>
      </section>

      {/* 3b — the lending ask.
          Everything below this point books Chris as a speaker, which is the
          right destination for the room that wants him on a stage. It is the
          wrong one for the larger group who read the story above and now want
          him on their mortgage, and who until now had nothing to click on this
          page at all. This band is theirs, and it is deliberately between the
          story and the stage so neither audience has to scroll past the
          other's call to action. */}
      <section className={a.talk}>
        <div className={a.talkInner}>
          <div className={a.kick}>Lending</div>
          <h2 className={a.h2}>
            He does this
            <br />
            <em>for a living.</em>
          </h2>
          <p className={a.lede}>
            Before the stage and the conference, Chris is a loan officer with
            twenty years of files behind him. If you&rsquo;re buying,
            refinancing or just working out whether the numbers move, that
            conversation is free and he takes it himself.
          </p>
          <CallBooking className={`${a.btn} ${a.btnRed}`} label="Schedule a call with Chris" />
        </div>
      </section>

      {/* 4 — speaking topics as a tour-date list */}
      <section className={a.dates} id="speaking">
        <div className={a.datesHead}>
          <div className={a.kick}>On Stage</div>
          <h2 className={a.h2}>
            Book Chris
            <br />
            <em>for your stage.</em>
          </h2>
          <p className={a.lede}>
            Five talks, built from twenty years of watching people get talked
            down to about their own money. Pick the one your room needs.
          </p>
        </div>
        <div className={a.dateList}>
          {talks.map((t, i) => (
            <Link key={t.id} href={`/book?talk=${t.id}`} className={a.dateRow}>
              <span className={a.dateNo}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className={a.dateTitle}>{t.title}</h3>
                <p className={a.dateBlurb}>{t.blurb}</p>
              </div>
              <span className={a.dateGo}>
                Enquire <i>&rarr;</i>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5 — PRESS & APPEARANCES IS REMOVED, NOT HIDDEN.
          Taken down at Garrett's request until there is coverage worth
          showing. It was also rendering a developer TODO on the live page
          and carrying an unverified Wall Street Journal appearance, neither
          of which belongs on a client site.

          The data layer is untouched: getPress() and the Backstage editor
          still exist, so restoring this is putting the markup back. */}

      {/* 6 — booking */}
      <section className={a.book}>
        <div className={a.bookInner}>
          <div className={a.bookGrid}>
            <div>
              <div className={a.kick} style={{ color: "var(--mp-black)" }}>
                Booking
              </div>
              <h2 className={a.h2}>
                Get Chris
                <br />
                <em>in the room.</em>
              </h2>
              <p className={a.lede}>
                Speaking, press, podcasts, and partnerships. Tell us the room and
                the date and someone comes back to you.
              </p>
              <div className={a.bookBtns}>
                <Link href="/book?type=speaking" className={`${a.btn} ${a.btnDark}`}>
                  Book Chris to speak &rarr;
                </Link>
                <Link href="/book?type=press" className={`${a.btn} ${a.btnOutline}`}>
                  Press enquiries &rarr;
                </Link>
              </div>
            </div>
            {/* Was a marked PhotoSlot. This is the real thing: Chris mid-talk
                at the American Dream Conference, the screen behind him. */}
            <div className={a.bookSlot} style={{ border: 0, padding: 0 }}>
              <Image
                src={bookingPhoto.src}
                alt="Chris Waipa speaking at the American Dream Conference"
                width={bookingPhoto.width}
                height={bookingPhoto.height}
                sizes="(max-width: 900px) 92vw, 46vw"
                style={{ width: "100%", height: "100%", objectFit: "cover",
                         borderRadius: 0 }}
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
