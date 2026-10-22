import type { Metadata } from "next";
import { Anton, Archivo_Black, Inter } from "next/font/google";
import "./globals.css";
import ChatLauncher from "@/components/chat/ChatLauncher";
import { SITE_URL as SITE_ORIGIN } from "@/lib/siteUrl";

/* next/font/google is the only font source in this project. No CDN <link>
   tags, no self-hosted @font-face, no Adobe/Typekit. See ENGINEERING.md. */

const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-display-alt",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

/**
 * The public origin, used to turn every relative image path below into the
 * absolute URL that link previews require.
 *
 * Production always advertises https://mortgagepunk.com; see src/lib/siteUrl.ts
 * for why it must never fall back to the deployment's own vercel.app address
 * (that address is behind Vercel's login, so every share image broke).
 */
const SITE_URL = SITE_ORIGIN;

const TITLE = "Mortgage Punk — Reimagining the American Dream";
const DESCRIPTION =
  "A world-class lending team and a movement to change the Game of Money. Get approved the right way, run your own numbers, or follow the movement.";

/**
 * SHARE CARDS ARE NOT A NICETY ON THIS SITE. Chris's whole model is posting
 * and being shared — Instagram, LinkedIn, a text to a client. Without the tags
 * below, every one of those links renders as a bare grey URL with no image and
 * no description, which is the worst possible first impression for a brand
 * built on looking like nothing else in the industry.
 *
 * og-default.jpg is the approved hero comp cropped to 1200x630: logo,
 * headline, Chris. One image rather than a generated-per-page one, because the
 * brand is the thing being recognised in a feed, not the page title.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    /* A page that sets its own title gets "<page> — Mortgage Punk" rather
       than repeating the full tagline on every tab and every share. */
    template: "%s — Mortgage Punk",
  },
  description: DESCRIPTION,
  applicationName: "Mortgage Punk",
  openGraph: {
    type: "website",
    siteName: "Mortgage Punk",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/brand/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Mortgage Punk — Reimagining the American Dream. Chris Waipa.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/brand/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Props typed inline rather than with Next's generated `LayoutProps<"/">`.
 *
 * That helper is generated from the route tree, so its accepted union changes
 * whenever the app directory does — and it broke the build with:
 *
 *   Type '"/"' does not satisfy the constraint '"/backstage"'
 *
 * because the generated union had collapsed to the one nested layout. The root
 * layout's props are simply `{ children }` and always will be, so declaring
 * that directly removes a build-time dependency on generated types that have
 * no reason to be in the critical path.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivoBlack.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Fixed launcher, so it rides every page. The question someone has
            usually arrives while they're reading something else. */}
        <ChatLauncher />
      </body>
    </html>
  );
}
