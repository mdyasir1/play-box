"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthResult = { error: string | null; needsConfirmation?: boolean };
type AuthUser = { id: string; email?: string };

type AuthContextValue = {
  user: AuthUser | null;
  authReady: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const DEMO_USER_KEY = "playbox.demo.user";
const AuthContext = createContext<AuthContextValue | null>(null);

function readDemoUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(DEMO_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setUser(readDemoUser());
      setAuthReady(true);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const sessionUser = data.session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email } : null);
      setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const sessionUser = session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email } : null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      if (!email.trim() || password.length < 6) {
        return { error: "Enter a valid email and a password of at least 6 characters." };
      }
      const demoUser = { id: "local-demo-user", email: email.trim() };
      window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      if (!email.trim() || password.length < 6) {
        return { error: "Enter a valid email and a password of at least 6 characters." };
      }
      const demoUser = { id: "local-demo-user", email: email.trim() };
      window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return { error: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) return { error: error.message };
    if (!data.session) return { error: null, needsConfirmation: true };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    window.localStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, authReady, isGuest: authReady && !user, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
