"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { YgMark } from "@/components/yg-mark";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const { user, signIn, signUp, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    const result =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password, firstName, lastName);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsConfirmation) {
      setMessage("Check your email. The bouncer is verifying you.");
      return;
    }
    router.replace("/");
  };

  const inputClass =
    "mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none transition focus:border-border-strong";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="mx-auto flex min-h-[72dvh] w-full max-w-md flex-col justify-center"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-display text-[0.65rem] tracking-[0.3em] text-hot">
            PLAYER ENTRY
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Join the arcade"}
          </h1>
        </div>
        <YgMark className="h-12 w-auto" />
      </div>

      <div className="paper-edge rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex gap-2 border-b border-border">
          {(["signin", "signup"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setError(null);
                setMessage(null);
              }}
              className={`-mb-px border-b-2 pb-2 text-xs font-semibold tracking-wide transition ${
                mode === value
                  ? "border-hot text-text"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {value === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3">
          {mode === "signup" ? (
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-text-muted">First name</span>
                <input
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className={inputClass}
                  autoComplete="given-name"
                  placeholder="Yasir"
                />
              </label>
              <label className="block">
                <span className="text-xs text-text-muted">Last name</span>
                <input
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className={inputClass}
                  autoComplete="family-name"
                  placeholder="Khan"
                />
              </label>
            </div>
          ) : null}

          <label className="block">
            <span className="text-xs text-text-muted">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              autoComplete="email"
              placeholder="you@playbox.com"
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
              className={inputClass}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="At least 6 characters"
            />
          </label>

          {error ? <p className="text-xs text-danger">{error}</p> : null}
          {message ? <p className="text-xs text-success">{message}</p> : null}

          <Button type="submit" className="mt-1 w-full justify-between" disabled={busy}>
            {busy
              ? "Checking your story…"
              : mode === "signin"
                ? "Enter the box"
                : "Create player"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="font-display text-[0.6rem] uppercase tracking-widest text-text-muted">
            or be reckless
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          onClick={() => {
            continueAsGuest();
            router.replace("/");
          }}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border text-xs font-semibold text-text-secondary transition hover:border-border-strong hover:text-text"
        >
          Continue as guest
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
        <p className="mt-2 text-center text-[0.65rem] text-text-muted">
          Guest progress vanishes when you leave. Like it never happened.
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-[0.65rem] text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3 text-success" aria-hidden="true" />
          Progress follows your account
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="size-3 text-hot" aria-hidden="true" />
          No capes required
        </span>
      </div>
    </motion.div>
  );
}
