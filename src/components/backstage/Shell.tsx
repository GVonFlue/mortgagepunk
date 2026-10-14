"use client";

// Client component: needs the pathname to decide whether to show the "back to
// everything" link, and a click handler for sign out.

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import s from "./Backstage.module.css";

/**
 * The Backstage frame.
 *
 * THIS USED TO BE A SIDEBAR of eleven identical rows. Two problems with that,
 * and they are why it changed:
 *
 *  1. Eleven text links in a column all look the same. Finding "the one that
 *     changes the conference" meant reading the whole list every time, which
 *     is exactly the kind of small friction that stops somebody updating
 *     their own site.
 *  2. The sidebar was always there, taking a fifth of the screen on every
 *     page, to show ten links the person was not using.
 *
 * So the navigation became the home screen — big labelled tiles you choose
 * from — and the frame shrank to a single bar. Every page gets the full width,
 * and one obvious link goes back to the tiles.
 *
 * The bar deliberately holds almost nothing: the logo, the way back, the live
 * site, and sign out. Anything else competes with the page.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  // On the tile screen itself there is nothing to go back to.
  const atHome = path === "/backstage/dashboard";

  async function logout() {
    await fetch("/api/backstage/logout", { method: "POST" });
    router.push("/backstage");
    router.refresh();
  }

  return (
    <div className={s.shell}>
      <header className={s.topbar}>
        <Link href="/backstage/dashboard" className={s.brand}>
          <Image
            src="/brand/mortgagepunk-logo@3x.png"
            alt="Mortgage Punk"
            width={1209}
            height={825}
          />
          <span className={s.brandTag}>Backstage</span>
        </Link>

        <div className={s.topbarRight}>
          {!atHome && (
            <Link href="/backstage/dashboard" className={s.backLink}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
              Everything
            </Link>
          )}
          <Link href="/" className={s.viewSite} target="_blank">
            View the live site &rarr;
          </Link>
          <button type="button" className={s.logout} onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <main className={s.main}>{children}</main>
    </div>
  );
}
