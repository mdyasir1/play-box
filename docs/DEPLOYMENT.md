# Deployment — YASIR PLAYBOX

> Local-first two-game build. No database, secrets, or required environment
> variables.

## 1. Requirements

- Node.js 20.9 or newer (developed on Node 22).
- npm.
- No Supabase account, database, API key, or service-role key.
- No `.env.local` is required.

## 2. Local development

```bash
npm install
npm run dev
```

Open the URL printed by Next.js, normally `http://localhost:3000`.

## 3. Production locally

```bash
npm run build
npm start
```

The build prerenders:

- `/`
- `/games/zip`
- `/games/maze-paint`
- `/icon.svg`
- `/_not-found`

## 4. Verification before release

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm audit
```

All six commands must pass. Playwright starts its own production server on
`http://127.0.0.1:3100`.

## 5. Environment variables

None. `.env.example` is documentation only. If a future feature adds a service,
add blank variable names to `.env.example` and real values only to `.env.local`.

## 6. Hosting options

Because all routes are static and there is no server data, the app can be hosted
on any platform that supports Next.js 16 static output. A Node-capable host may
still be used to run `next start`.

No account or deployment has been created. The project owner controls Git and
all remote services.

## 7. Optional Vercel path (not executed)

1. Owner imports the repository into their own Vercel account.
2. Framework preset: Next.js.
3. Build command: `npm run build`.
4. Output: default Next.js.
5. No environment variables.
6. No database integration.

This path is optional and was not performed by the agent.

## 8. Rollback

- Redeploy the previous successful build.
- No database migrations or remote state exist to reverse.
- Player progress lives in each browser and is unaffected by redeployment.

## 9. Post-deploy smoke (when deployed)

1. Load `/` and both game routes.
2. Complete Zip level 1 and confirm the result dialog.
3. Reload and confirm the current level.
4. Complete Maze Paint level 1 with the keyboard.
5. Open both level pickers and select level 100.
6. Resize to 320 px and confirm no horizontal scroll.
7. Confirm no console errors and no failed network requests.

## 10. Security headers

`next.config.ts` applies CSP, nosniff, frame denial, referrer policy,
permissions policy, cross-origin policies, and production HSTS. Supabase origins
are not allowed because the app does not contact Supabase.
