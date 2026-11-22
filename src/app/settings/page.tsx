"use client";

import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Save, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-1 h-11 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none transition focus:border-border-strong";

type ProfileFormProps = {
  user: ReturnType<typeof useAuth>["user"];
  firstName: string;
  lastName: string;
};

function ProfileForm({ user, firstName: initialFirst, lastName: initialLast }: ProfileFormProps) {
  const { updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const result = await updateProfile(firstName, lastName);
    setBusy(false);
    setMessage(result.error ?? result.message ?? "Saved.");
  };

  return (
    <form
      onSubmit={save}
      className="paper-edge rounded-xl border border-border bg-surface p-5 sm:col-span-2"
    >
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-md bg-zip-soft text-zip">
          <UserRound className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold">Player name</h2>
          <p className="text-xs text-text-muted">
            {user?.email ?? "Signed in"} · Shown across the arcade.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs text-text-muted">First name</span>
          <input
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={inputClass}
            autoComplete="given-name"
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
          />
        </label>
      </div>

      {message ? <p className="mt-3 text-xs text-text-secondary">{message}</p> : null}

      <Button type="submit" className="mt-4" disabled={busy}>
        <Save className="size-4" aria-hidden="true" />
        Save profile
      </Button>
    </form>
  );
}

function PasswordForm() {
  const { changePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const result = await changePassword(password);
    setBusy(false);
    if (result.error) {
      setMessage(result.error);
      return;
    }
    setPassword("");
    setMessage(result.message ?? "Password updated.");
  };

  return (
    <form
      onSubmit={save}
      className="paper-edge rounded-xl border border-border bg-surface p-5 sm:col-span-2"
    >
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-md bg-maze-soft text-maze">
          <KeyRound className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold">Password</h2>
          <p className="text-xs text-text-muted">Use something harder than level one.</p>
        </div>
      </div>

      <label className="mt-5 block">
        <span className="text-xs text-text-muted">New password</span>
        <input
          type="password"
          minLength={6}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass}
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />
      </label>

      {message ? <p className="mt-3 text-xs text-text-secondary">{message}</p> : null}

      <Button type="submit" className="mt-4" disabled={busy}>
        <KeyRound className="size-4" aria-hidden="true" />
        Update password
      </Button>
    </form>
  );
}

export default function SettingsPage() {
  const { user, fullName } = useAuth();
  const profileKey = user?.id ?? "loading";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-text-muted transition hover:text-text"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to the box
      </Link>

      <p className="mt-5 font-display text-[0.65rem] tracking-[0.3em] text-hot">
        PLAYER CONTROL
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Settings
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        {fullName || "Player"}, rename yourself. We won&apos;t tell the leaderboard.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ProfileForm
          key={profileKey}
          user={user}
          firstName={user?.firstName ?? ""}
          lastName={user?.lastName ?? ""}
        />
        <PasswordForm />
      </div>
    </motion.div>
  );
}
