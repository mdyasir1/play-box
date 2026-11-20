import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  ...(appUrl ? { metadataBase: new URL(appUrl) } : {}),
  title: {
    default: "YASIR PLAYBOX — Your Personal Arcade",
    template: "%s · YASIR PLAYBOX",
  },
  description:
    "A premium pocket arcade with five single-player games, real level progression, and progress that stays on your device.",
  applicationName: "YASIR PLAYBOX",
  appleWebApp: {
    capable: true,
    title: "YASIR PLAYBOX",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "YASIR PLAYBOX — Your Personal Arcade",
    description:
      "Five focused single-player games, ten levels each, built for one-handed play.",
    siteName: "YASIR PLAYBOX",
  },
  twitter: {
    card: "summary",
    title: "YASIR PLAYBOX — Your Personal Arcade",
    description:
      "Five focused single-player games, ten levels each, built for one-handed play.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070A14",
  colorScheme: "dark",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main
          id="main"
          className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8"
        >
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
