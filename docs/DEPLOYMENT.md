# Deployment — YASIR PLAYBOX

> Status: **not deployed.** No GitHub remote, Vercel project, or Supabase project exists. A local production build (`next build` + `next start`) passed route and header smoke tests on 2026-11-21; that is not a deployment. This document is the runbook for Phase 10 and Phase 13. Do not mark deployment complete until every production verification item has been executed.

## 1. Prerequisites

| Item | Status | Notes |
|---|---|---|
| Node.js ≥ 20.9 (v22.13.1 verified) | Available | Local development |
| npm 10.9.2 | Available | Only installed package manager |
| Git 2.47.1 | Available | Repo initialized; no commit/remote yet |
| Supabase account + project | **Pending** | Phase 10 |
| GitHub account + remote | **Pending** | Phase 13 |
| Vercel account (Hobby) | **Pending** | Confirm eligibility; Hobby is for non-commercial use |
| Supabase CLI / Vercel CLI / gh | Not installed | Use `npx` or the web dashboards; no global installs required |

Zero-budget rule: no paid plan may be enabled without explicit approval.

## 2. Environment variables

Create `.env.local` (git-ignored) from this table. Never commit values.

| Variable | Exposure | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Phase 10+ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Phase 10+ | RLS-bound anon key for RPCs |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only** | Phase 10+ (daily route) | Server route access to `daily_words`; never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_APP_URL` | Public | Optional | Canonical URL for metadata/share |

`.env.example` contains names only. A runtime guard must throw if the service-role client is imported into a client component.

## 3. Supabase setup (Free)

1. Create a project in the desired free-tier region; record the project URL and keys in a password manager.
2. Keep the service-role key out of the client and repo.
3. Apply migrations from `supabase/migrations/` in order using the SQL editor (or `npx supabase db push` if the CLI is linked).
4. Seed `game_definitions`, `achievements`, and `daily_words` via the provided migration/seed SQL.
5. Verify RLS:
   - all tables have RLS enabled;
   - no policies for `anon`/`authenticated`;
   - table grants revoked;
   - only `get_progress` and `submit_result` executable by anon.
6. Run the `SECURITY.md` §9 probes with the anon key.
7. Record migration versions applied in `DATABASE.md`.

Database migration rules:

- Forward-only; never edit an applied migration.
- Take a logical backup/export before destructive maintenance.
- The free plan does not guarantee point-in-time recovery; do not claim it.

## 4. GitHub setup

1. Create an empty repository (no auto-generated files).
2. Add the remote and push the default branch.
3. Confirm ignored files are not tracked: `.env.local`, `.next`, `node_modules`, coverage, test reports.
4. Enable branch protection if available; at minimum, require a passing build before merging to the deploy branch.
5. Record the repository URL in `CHANGELOG.md` when created.

Commands (when accounts exist):

```bash
git add .
git commit -m "chore: phase 0 documentation and project baseline"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

The commit is made only with explicit approval.

## 5. Vercel configuration

- Import the GitHub repository.
- Framework preset: Next.js. Build: `npm run build`. Install: `npm install`.
- Node runtime: 22.x (project setting).
- Add environment variables from §2 to Production and Preview. Client vars may be present in Preview; restrict the service-role key to Production/Preview as appropriate and never expose it publicly.
- Region: closest to the primary audience, within the free plan.
- Deploy from `main`; use preview deployments for QA.
- Confirm Hobby plan eligibility (non-commercial). Commercial use requires approval and possibly a paid plan — do not upgrade without consent.

## 6. PWA verification

After deployment:

1. `manifest.webmanifest` resolves with correct name, icons, display, theme, start URL.
2. Service worker registers and controls the page after reload.
3. Offline relaunch works after one successful online visit (do not claim first-visit offline).
4. Game assets cached; `/api/*` and Supabase responses not cached.
5. Update prompt appears after a new deployment; a running game is not interrupted.
6. Lighthouse PWA/installability checks pass.
7. iOS Safari: add to Home Screen, standalone launch, safe-area layout.
8. Android Chrome: install prompt/instructions, standalone launch, offline relaunch.

## 7. Production verification checklist

Must be executed against the real URL and recorded in `TESTING_AND_QA.md`:

- [ ] Home loads with no console errors.
- [ ] All five games start, play, and reach a result.
- [ ] A level completion unlocks the next level.
- [ ] A loss does not unlock.
- [ ] Refresh retains level and best score.
- [ ] Completion while offline is saved locally and syncs after reconnect.
- [ ] RLS/RPC probes pass in production.
- [ ] No service-role key or future daily answers in the client bundle.
- [ ] Daily challenge works and resets at 00:00 UTC.
- [ ] Mobile layouts at 320–430 px have no overflow.
- [ ] Keyboard controls work on desktop.
- [ ] Reduced motion respected.
- [ ] Install and offline relaunch verified on Android and iOS.
- [ ] Lighthouse mobile results recorded.
- [ ] Sync status displays correctly for online/offline/pending.

## 8. Rollback

- **App:** in Vercel, promote the previous successful deployment (Deployments → previous → Promote). Verify the production URL and games after rollback.
- **Service worker:** if a bad cache is released, deploy a fix that versions the cache and cleans old caches; never instruct users to clear all site data (that deletes progress).
- **Database:** migrations are forward-only. For a bad migration, write a new corrective migration; restore data from the pre-migration export if necessary. Document the incident.
- **Secrets:** rotate the exposed key in Supabase, update Vercel env vars, redeploy, invalidate the old key.

## 9. Free-tier monitoring

- Supabase dashboard: database size, egress, MAU (no auth in Phase 1), project pauses after inactivity on free plans.
- Vercel dashboard: function invocations, bandwidth, build minutes.
- No polling endpoints; sync is event-driven.
- If limits approach, reduce payload/retention first; enabling paid features requires explicit approval.

## 10. Deployment record

| Item | Value |
|---|---|
| GitHub repository | Not created |
| Vercel project | Not created |
| Production URL | Not deployed |
| First production deploy date | — |
| Migrations applied | None |
| Local production build verification | PASS 2026-11-21 (12 static pages; routes 200/404; headers present) |
| Deployment verification | NOT RUN |

Update this table only with verified facts.
