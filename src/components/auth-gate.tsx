"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/auth-provider";
import { Logo } from "@/components/logo";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, authReady } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const onLogin = pathname.startsWith("/login");

  useEffect(() => {
    if (!authReady) return;
    if (!user && !onLogin) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user && onLogin) {
      router.replace("/");
    }
  }, [authReady, user, onLogin, pathname, router]);

  if (!authReady || (!user && !onLogin) || (user && onLogin)) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <Logo className="size-10 animate-pulse" />
      </div>
    );
  }

  return <>{children}</>;
}
