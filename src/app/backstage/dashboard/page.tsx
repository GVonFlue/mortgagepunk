import Link from "next/link";
import Shell from "@/components/backstage/Shell";
import Notice from "@/components/backstage/Notice";
import s from "@/components/backstage/Backstage.module.css";
import { dbProbe, getVideos, getLeads, getPress, getAnnouncement } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * The Backstage home screen: every section as a tile.
 *
 * THIS REPLACED A SIDEBAR of eleven identical text links plus a short page of
 * prose. The tiles are the navigation now.
 *
 * Three rules, and they are what make it usable by somebody who does not do
 * this for a living:
 *
 *  1. EVERY TILE IS NAMED FOR THE THING ON THE SITE, not for the database
 *     behind it. "The bar across the top of every page" rather than
 *     "Announcement". Chris knows what he wants to change by looking at it;
 *     he does not know what we called the table.
 *
 *  2. TILES CARRY LIVE NUMBERS where a number answers the question the person
 *     actually has. "4 new this week" on Leads is the reason to click. A
 *     count of design specs is not, so that tile has none.
 *
 *  3. THE ORDER IS BY HOW OFTEN IT GETS USED, not alphabetical and not by
 *     how the code is organised. Leads and Photos are near the top because
 *     those are the weekly jobs; design specs is last because it is a
 *     reference, opened once a quarter.
 */

type Tile = {
  href: string;
  title: string;
  blurb: string;
  icon: string;
  /** Rendered as a small badge. Omit where a number means nothing. */
  meta?: string;
  /** Pulls the eye to the one or two things worth doing first. */
  accent?: boolean;
};

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    image: (
      <>
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
        <circle cx="8.5" cy="10" r="1.6" />
        <path d="m3.5 17 5-4.5 4 3.5 3-2.5 5 4" />
      </>
    ),
    inbox: (
      <>
        <path d="M3 13h4l2 3h6l2-3h4" />
        <path d="M5.5 5h13l2.5 8v4a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-4z" />
      </>
    ),
    play: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="3" />
        <path d="M10 9.5v5l4.5-2.5z" />
      </>
    ),
    layout: (
      <>
        <rect x="3" y="3.5" width="18" height="17" rx="2" />
        <path d="M3 9.5h18M9 20.5v-11" />
      </>
    ),
    megaphone: (
      <>
        <path d="M3.5 10.5v3a1.5 1.5 0 0 0 1.5 1.5h2l7 4V5l-7 4H5a1.5 1.5 0 0 0-1.5 1.5z" />
        <path d="M18 9.5a4 4 0 0 1 0 5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2.5" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
    quote: (
      <>
        <path d="M9.5 6.5C6.7 7.6 5 10 5 13v4.5h5.5V11H8c0-1.7.6-2.9 1.5-3.4z" />
        <path d="M19.5 6.5C16.7 7.6 15 10 15 13v4.5h5.5V11H18c0-1.7.6-2.9 1.5-3.4z" />
      </>
    ),
    star: <path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9z" />,
    mic: (
      <>
        <rect x="9" y="2.5" width="6" height="11" rx="3" />
        <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
      </>
    ),
    tag: (
      <>
        <path d="M3 12.5V4.5A1.5 1.5 0 0 1 4.5 3h8l8.5 8.5a1.5 1.5 0 0 1 0 2.1l-6.4 6.4a1.5 1.5 0 0 1-2.1 0z" />
        <circle cx="7.8" cy="7.8" r="1.4" />
      </>
    ),
    ruler: (
      <>
        <path d="M3.5 14.8 14.8 3.5l5.7 5.7L9.2 20.5z" />
        <path d="M7.6 7.4l2 2M10.6 10.4l2 2M13.6 13.4l2 2" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default async function Overview() {
  const probe = await dbProbe();
  const [videos, leads, press, announcement] = await Promise.all([
    getVideos(),
    getLeads(50),
    getPress(),
    getAnnouncement(),
  ]);

  const liveVideos = videos.filter((v) => v.published).length;

  const tiles: Tile[] = [
    {
      href: "/backstage/leads",
      title: "Leads",
      blurb: "Everyone who asked you to get in touch, newest first.",
      icon: "inbox",
      meta: leads.length ? `${leads.length} waiting` : "None yet",
      accent: leads.length > 0,
    },
    {
      href: "/backstage/photos",
      title: "Photos",
      blurb: "Swap the pictures on the About and Movement pages.",
      icon: "image",
      accent: true,
    },
    {
      href: "/backstage/library",
      title: "Videos",
      blurb: "The education library. Add a video, or change what's featured.",
      icon: "play",
      meta: `${liveVideos} live`,
    },
    {
      href: "/backstage/homepage",
      title: "Homepage headline",
      blurb: "The big words at the top of the site and the two buttons under them.",
      icon: "layout",
    },
    {
      href: "/backstage/settings",
      title: "Announcement bar",
      blurb: "The strip across the top of every page.",
      icon: "megaphone",
      meta: announcement.enabled ? "On" : "Off",
    },
    {
      href: "/backstage/conference",
      title: "The conference",
      blurb: "Date, venue, keynote and the numbers on the Movement page.",
      icon: "calendar",
    },
    {
      href: "/backstage/testimonials",
      title: "Client stories",
      blurb: "What past clients said about working with you.",
      icon: "quote",
    },
    {
      href: "/backstage/press",
      title: "Press",
      blurb: "Features, interviews and appearances.",
      icon: "star",
      meta: `${press.filter((p) => !p.pending).length} live`,
    },
    {
      href: "/backstage/speaking",
      title: "Speaking topics",
      blurb: "The talks people can book you for.",
      icon: "mic",
    },
    {
      href: "/backstage/topics",
      title: "Video categories",
      blurb: "The labels your videos get filed under.",
      icon: "tag",
    },
    {
      href: "/backstage/design",
      title: "Design specs",
      blurb: "Sizes and colours, for whoever is making artwork.",
      icon: "ruler",
    },
  ];

  return (
    <Shell>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>What would you like to change?</h1>
          <p className={s.sub}>
            Everything here updates the live site straight away. Nothing here
            can break it — every field is capped to fit the space it lands in,
            and every photo can be put back.
          </p>
        </div>
      </div>

      <Notice configured={probe.ok} error={probe.error} />

      <div className={s.tiles}>
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`${s.tile} ${t.accent ? s.tileAccent : ""}`}
          >
            <span className={s.tileIcon}>
              <Icon name={t.icon} />
            </span>
            <span className={s.tileBody}>
              <span className={s.tileTitle}>{t.title}</span>
              <span className={s.tileBlurb}>{t.blurb}</span>
            </span>
            {t.meta && <span className={s.tileMeta}>{t.meta}</span>}
          </Link>
        ))}
      </div>

      <div className={s.card}>
        <div className={s.cardHead}>
          <h2 className={s.cardTitle}>Not here on purpose</h2>
        </div>
        <p className={s.help} style={{ margin: 0 }}>
          Page layouts, colours and the navigation aren&rsquo;t editable — those
          are design decisions, and they&rsquo;re the part that breaks if
          they&rsquo;re nudged. Text ProyTech if you want one changed and
          it&rsquo;ll be done the same day.
        </p>
      </div>
    </Shell>
  );
}
