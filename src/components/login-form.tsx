"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { YgMark } from "@/components/yg-mark";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);
    const result = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsConfirmation) {
      setMessage("Check your email to confirm, then sign in.");
      return;
    }
    router.replace("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex min-h-[70dvh] max-w-sm flex-col justify-center"
    >
      <div className="paper-edge rounded-lg border border-border bg-surface p-6">
        <YgMark className="size-10" />
        <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-xs text-text-muted">Sign in to continue to Play-Box.</p>

        <div className="mt-5 flex gap-2 border-b border-border">
          {(["signin", "signup"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setError(null);
                setMessage(null);
              }}
              className={`-mb-px border-b-2 pb-2 text-xs font-medium transition ${
                mode === value
                  ? "border-text text-text"
                  : "border-transparent text-text-muted"
              }`}
            >
              {value === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <label className="block">
            <span className="text-xs text-text-muted">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:border-border-strong"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="text-xs text-text-muted">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:border-border-strong"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </label>

          {error ? <p className="text-xs text-danger">{error}</p> : null}
          {message ? <p className="text-xs text-success">{message}</p> : null}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

      </div>
    </motion.div>
  );
}
