import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";

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

export const metadata: Metadata = {
  title: {
    default: "YASIR PLAYBOX — Two games, 200 levels",
    template: "%s · YASIR PLAYBOX",
  },
  description:
    "Zip and Maze Paint: two focused single-player puzzles with 100 verified levels each. No account, no noise, local progress.",
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
    title: "YASIR PLAYBOX — Two games, 200 levels",
    description:
      "Zip and Maze Paint. Two polished puzzle games with 200 levels and local progress.",
    siteName: "YASIR PLAYBOX",
  },
  twitter: {
    card: "summary",
    title: "YASIR PLAYBOX — Two games, 200 levels",
    description:
      "Zip and Maze Paint. Two polished puzzle games with 200 levels and local progress.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070a14",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
