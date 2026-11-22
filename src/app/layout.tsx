import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { AuthProvider } from "@/components/auth-provider";
import { ProgressSync } from "@/components/progress-sync";
import { SplashScreen } from "@/components/splash-screen";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yasir's Play-Box",
    template: "%s · Yasir's Play-Box",
  },
  description: "Two puzzles by Yasir. Zip and Maze Paint, 200 levels each.",
  applicationName: "Yasir's Play-Box",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Yasir's Play-Box",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Yasir's Play-Box",
    description: "Zip and Maze Paint. 200 levels each.",
    siteName: "Yasir's Play-Box",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e1013",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${chakra.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <ProgressSync />
            <SplashScreen />
            <AppShell>
              <AuthGate>{children}</AuthGate>
            </AppShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
