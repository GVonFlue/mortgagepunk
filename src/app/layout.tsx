import type { Metadata } from "next";
import { Anton, Archivo_Black, Inter } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/chat/ChatWidget";

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

export const metadata: Metadata = {
  title: "Mortgage Punk — Reimagining the American Dream",
  description:
    "A world-class lending team and a movement to change the Game of Money. Get approved the right way, run your own numbers, or follow the movement.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivoBlack.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Fixed launcher, so it rides every page. The question someone has
            usually arrives while they're reading something else. */}
        <ChatWidget />
      </body>
    </html>
  );
}
