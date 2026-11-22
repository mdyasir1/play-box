# Database — Yasir's Play-Box

## Current design

The app is local-first and supports optional Supabase cloud sync.

- **Guest / unconfigured mode:** progress is stored in browser localStorage at
  `playbox.v4.progress`.
- **Configured mode:** Supabase Auth handles email/password login, and Prisma
  writes one `progress` row per user per game.
- **No credentials are committed.** Values live only in `.env.local`.

## Credentials status

`DATABASE_URL` and `DIRECT_URL` are configured in the gitignored `.env.local`,
and the Prisma migration has been applied. `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` are still blank, so the app currently uses the
local demo login. Real Supabase Auth activates once those two values are added.

## Credentials needed from you

Copy `.env.example` to `.env.local` and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<public anon key>
DATABASE_URL=postgresql://postgres.nosopvjkiocugukavowd:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.nosopvjkiocugukavowd:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres
```

You only need to provide the **database password** for the project user shown in
your template, plus the project URL and anon key. The service-role key is not
used by this app.

## Schema

Prisma schema: `prisma/schema.prisma`.
SQL migration: `prisma/migrations/20261122_init/migration.sql` and
`supabase/migrations/20261122_init.sql`.

```prisma
model Progress {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId       String   @db.Uuid
  game         String
  currentLevel Int      @default(1)
  completed    Int[]    @default([])
  bestScores   Json     @default(dbgenerated("'{}'::jsonb"))
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([userId, game])
  @@index([userId])
  @@map("progress")
}
```

## Apply the migration

With `.env.local` filled:

```bash
npx prisma migrate deploy
npx prisma generate
```

Or paste `supabase/migrations/20261122_init.sql` into the Supabase SQL editor.

## Row Level Security

The migration enables RLS and creates:

```sql
CREATE POLICY "users_manage_own_progress" ON "progress"
  FOR ALL
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");
```

Server-side Prisma uses the Postgres connection and validates the user from the
Supabase session before reading or writing.

## Auth setup

In Supabase dashboard:

1. Authentication → Providers → Email: enabled.
2. For local testing, disable "Confirm email" or use the confirmation flow.
3. Add your site URL to Authentication → URL Configuration.

## Sync behavior

- On sign-in, remote progress is merged with local progress.
- Completed levels union; best scores keep the minimum; current level keeps the
  highest unlocked value.
- After remote load, local changes are pushed to Supabase.
- If Supabase is not configured, the app uses a local demo login and keeps
  everything in localStorage.
