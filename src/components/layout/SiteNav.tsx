import Image from "next/image";
import Link from "next/link";
import n from "./SiteNav.module.css";
import MobileNav from "./MobileNav";
import { APPLY_URL, EXTERNAL } from "@/lib/links";

/**
 * Nav for inner pages. The homepage does NOT use this — its nav is baked into
 * the hero stage so it scales with the composition.
 */
const LINKS = [
  { label: "Lending", href: "/lending" },
  { label: "Tools", href: "/tools" },
  { label: "The Game of Money", href: "/library" },
  { label: "The Movement", href: "/movement" },
  { label: "About Chris", href: "/about" },
];

export default function SiteNav() {
  return (
    <nav className={n.nav} aria-label="Primary">
      <Link href="/" className={n.logo}>
        <Image
          src="/brand/mortgagepunk-logo@3x.png"
          alt="Mortgage Punk"
          width={1209}
          height={825}
          priority
        />
      </Link>
      <ul className={n.links}>
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
      <a href={APPLY_URL} {...EXTERNAL} className={n.cta}>
        Get Approved <span aria-hidden="true">&rarr;</span>
      </a>
      <MobileNav />
    </nav>
  );
}
