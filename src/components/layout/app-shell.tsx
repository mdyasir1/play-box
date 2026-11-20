import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileBottomNav, MobileTopBar } from "@/components/layout/mobile-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Sidebar />

      <div className="flex min-h-dvh flex-col lg:pl-60">
        <MobileTopBar />

        <main
          id="main"
          className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10"
        >
          {children}
        </main>

        <div className="pb-[calc(4.75rem+env(safe-area-inset-bottom))] lg:pb-0">
          <SiteFooter />
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}