"use client";

// Client component: needs the current pathname to mark the active nav item,
// and a click handler for logout.

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import s from "./Backstage.module.css";

const NAV = [
  { href: "/backstage/dashboard", label: "Overview", icon: "grid" },
  { href: "/backstage/library", label: "Library", icon: "play" },
  { href: "/backstage/topics", label: "Topics", icon: "tag" },
  { href: "/backstage/leads", label: "Leads", icon: "inbox" },
  { href: "/backstage/testimonials", label: "Testimonials", icon: "quote" },
  { href: "/backstage/press", label: "Press", icon: "star" },
  { href: "/backstage/conference", label: "Conference", icon: "calendar" },
  { href: "/backstage/speaking", label: "Speaking", icon: "mic" },
  { href: "/backstage/settings", label: "Announcement", icon: "megaphone" },
] as const;

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    play: <><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M10 9.5v5l4.5-2.5z" /></>,
    tag: <><path d="M3 12.5V4.5A1.5 1.5 0 0 1 4.5 3h8l8.5 8.5a1.5 1.5 0 0 1 0 2.1l-6.4 6.4a1.5 1.5 0 0 1-2.1 0z" /><circle cx="7.8" cy="7.8" r="1.4" /></>,
    inbox: <><path d="M3 13h4l2 3h6l2-3h4" /><path d="M5.5 5h13l2.5 8v4a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-4z" /></>,
    quote: <><path d="M9.5 6.5C6.7 7.6 5 10 5 13v4.5h5.5V11H8c0-1.7.6-2.9 1.5-3.4z" /><path d="M19.5 6.5C16.7 7.6 15 10 15 13v4.5h5.5V11H18c0-1.7.6-2.9 1.5-3.4z" /></>,
    star: <path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9z" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
    mic: <><rect x="9" y="2.5" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></>,
    megaphone: <><path d="M3.5 10.5v3a1.5 1.5 0 0 0 1.5 1.5h2l7 4V5l-7 4H5a1.5 1.5 0 0 0-1.5 1.5z" /><path d="M18 9.5a4 4 0 0 1 0 5" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/backstage/logout", { method: "POST" });
    router.push("/backstage");
    router.refresh();
  }

  return (
    <div className={s.shell}>
      <aside className={s.side}>
        <div className={s.brand}>
          <Image
            src="/brand/mortgagepunk-logo@3x.png"
            alt="Mortgage Punk"
            width={1209}
            height={825}
          />
          <span className={s.brandTag}>Backstage</span>
        </div>

        <nav>
          <ul className={s.navList}>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={path === n.href ? s.navActive : undefined}
                  aria-current={path === n.href ? "page" : undefined}
                >
                  <Icon name={n.icon} />
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.sideFoot}>
          <Link href="/" className={s.viewSite} target="_blank">
            View the live site &rarr;
          </Link>
          <button type="button" className={s.logout} onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className={s.main}>{children}</main>
    </div>
  );
}
