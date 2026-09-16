/**
 * /backstage is private. This metadata keeps it out of search results;
 * middleware.ts keeps it out of everyone's hands without the password. The
 * obscure path alone is not the protection — it just means nobody stumbles in.
 */
export const metadata = {
  title: "Backstage — Mortgage Punk",
  robots: { index: false, follow: false, nocache: true },
};

export default function BackstageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
