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
import { notifySessionChange, setGuestMode } from "@/lib/session";

type AuthResult = { error: string | null; needsConfirmation?: boolean };
type UpdateResult = { error: string | null; message?: string };

type AuthUser = {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  authReady: boolean;
  isGuest: boolean;
  guestMode: boolean;
  fullName: string;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  updateProfile: (firstName: string, lastName: string) => Promise<UpdateResult>;
  changePassword: (password: string) => Promise<UpdateResult>;
};

const DEMO_USER_KEY = "playbox.demo.user";
const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): AuthUser {
  const metadata = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email,
    firstName:
      typeof metadata.first_name === "string" ? metadata.first_name : "",
    lastName: typeof metadata.last_name === "string" ? metadata.last_name : "",
  };
}

function readDemoUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(DEMO_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    return {
      id: parsed.id ?? "local-demo-user",
      email: parsed.email,
      firstName: parsed.firstName ?? "",
      lastName: parsed.lastName ?? "",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [guestModeState, setGuestModeState] = useState(false);
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
      setUser(sessionUser ? mapUser(sessionUser) : null);
      setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const sessionUser = session?.user;
      setUser(sessionUser ? mapUser(sessionUser) : null);
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
      const existing = readDemoUser();
      const demoUser: AuthUser = {
        id: "local-demo-user",
        email: email.trim(),
        firstName: existing?.firstName ?? "Player",
        lastName: existing?.lastName ?? "One",
      };
      window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      setGuestMode(false);
      setGuestModeState(false);
      notifySessionChange();
      setUser(demoUser);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      setGuestMode(false);
      setGuestModeState(false);
      notifySessionChange();
    }
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const supabase = getSupabaseBrowserClient();
      if (!firstName.trim() || !lastName.trim()) {
        return { error: "First and last name are required." };
      }
      if (!supabase) {
        if (!email.trim() || password.length < 6) {
          return { error: "Enter a valid email and a password of at least 6 characters." };
        }
        const demoUser: AuthUser = {
          id: "local-demo-user",
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        };
        window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
        setGuestMode(false);
        setGuestModeState(false);
        notifySessionChange();
        setUser(demoUser);
        return { error: null };
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { first_name: firstName.trim(), last_name: lastName.trim() },
        },
      });
      if (error) return { error: error.message };
      if (!data.session) return { error: null, needsConfirmation: true };
      setGuestMode(false);
      setGuestModeState(false);
      notifySessionChange();
      return { error: null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    window.localStorage.removeItem(DEMO_USER_KEY);
    setGuestMode(false);
    setGuestModeState(false);
    notifySessionChange();
    setUser(null);
  }, []);

  const continueAsGuest = useCallback(() => {
    setGuestMode(true);
    setGuestModeState(true);
    notifySessionChange();
    setUser({ id: "guest-session", firstName: "Guest", lastName: "Player" });
  }, []);

  const updateProfile = useCallback(
    async (firstName: string, lastName: string) => {
      if (!firstName.trim() || !lastName.trim()) {
        return { error: "First and last name are required." };
      }
      const supabase = getSupabaseBrowserClient();
      if (guestModeState) {
        setUser({
          id: "guest-session",
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
        return { error: null, message: "Guest name updated for this session." };
      }
      if (!supabase) {
        const next: AuthUser = {
          id: user?.id ?? "local-demo-user",
          email: user?.email,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        };
        window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(next));
        setUser(next);
        return { error: null, message: "Profile updated." };
      }
      const { data, error } = await supabase.auth.updateUser({
        data: { first_name: firstName.trim(), last_name: lastName.trim() },
      });
      if (error) return { error: error.message };
      if (data.user) setUser(mapUser(data.user));
      return { error: null, message: "Profile updated." };
    },
    [user, guestModeState],
  );

  const changePassword = useCallback(async (password: string) => {
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }
    if (guestModeState) {
      return { error: "Guest sessions don't have a password." };
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return { error: "Password changes require Supabase Auth." };
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };
    return { error: null, message: "Password updated." };
  }, [guestModeState]);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        isGuest: authReady && (!user || guestModeState),
        guestMode: guestModeState,
        fullName,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
        updateProfile,
        changePassword,
      }}
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
