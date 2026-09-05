import type { Metadata } from "next";
import { Anton, Archivo_Black, Inter } from "next/font/google";
import "./globals.css";

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
  title: "Mortgage Punk",
  description: "Mortgage Punk",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivoBlack.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
