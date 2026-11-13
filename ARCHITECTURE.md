# BASS BIN — stack and architecture

Living brief for this repo. **Update this file in the same change** as any new dependency, route, folder, data source, or data-model field. If the code and this file disagree, fix this file before you finish.

Planned work stays under **Planned** until the code is in the repo. Then move it to **Current**.

## What this is

Community radio station. One bin. Everyone hears the same moment.

The app is a single Next.js site. Pages are server components. Interactive pieces (search, forms, like/drop) are client components. There is no API, database, auth server, or file storage yet. Tracks and picks are dummy data in `src/data`.

## Current status

**Phase 0 + Phase 1** — static UI. Dummy tracks and picks. Upload, login, admin, and votes do not persist.

## Tech stack (in the repo)

| Layer | Choice | Where |
|---|---|---|
| App | Next.js 15 (App Router), React 19 | `package.json`, `src/app` |
| Language | TypeScript, `strict` | `tsconfig.json` |
| Styling | Global tokens in `src/app/globals.css`, CSS modules next to components | `src/**/*.module.css` |
| Font | Anton via `next/font` | `src/app/layout.tsx` |
| Imports | `@/*` maps to `src/*` | `tsconfig.json` |
| Lint | ESLint 9 + `eslint-config-next` | `eslint.config.mjs` |
| Run | `npm install` then `npm run dev` → http://localhost:3000 | `README.md` |

No Tailwind, no component library, no state library, no ORM. `next.config.ts` stays host-independent (no Vercel-only features). Production builds skip ESLint because OneDrive can corrupt those deps on Windows.

`finance-desk/` is a separate Next.js app in this folder. It is not the station. Do not treat its stack as BASS BIN’s.

## Architecture

```
Browser
  └─ Next.js App Router (server pages in src/app)
       ├─ src/data          dummy tracks and picks (the only data source today)
       ├─ src/types.ts      Track, Pick, and related types
       ├─ src/config.ts     vote thresholds and takedown email (edit here only)
       ├─ src/lib           small helpers (slug, waveform, pick display)
       └─ src/components    UI; "use client" only where the page needs state
```

A page loads dummy data on the server and passes it into a component. Example: `src/app/page.tsx` passes `DUMMY_TRACKS` into `BinBrowser`, which filters and sorts in the browser. Forms such as upload validate locally and stop with a Phase 1 message. They do not call a server.

The shell is `src/app/layout.tsx`: top bar, page, takedown footer, now-playing strip. The strip uses `getOnAirTrack()` from dummy data. The listener count shown there is a placeholder.

Design tokens live on `:root` in `globals.css` (`--bg`, `--text`, `--muted`, `--line`, `--green`). New UI should use those variables.

## Routes

| Path | Page | Data |
|---|---|---|
| `/` | Dumpster diving (bin grid) | `src/data/dummy-tracks.ts` |
| `/ranking` | Monthly leaderboard | same tracks |
| `/ranking/archive` | Past months | placeholder |
| `/mix/[code]` | Track split view | lookup by code; 404 if missing |
| `/artist/[slug]` | Artist page | tracks for that slug |
| `/upload` | Upload form | client-only; not sent |
| `/waste` | Waste-management picks | `src/data/dummy-picks.ts` |
| `/waste/[id]` | One pick | lookup by id |
| `/login` | Owner / manager login | UI only |
| `/admin` | Owner tools | lists dummy tracks and picks |

## Data model (current types)

Defined in `src/types.ts`. These shapes are what Phase 2 tables should match.

- **Track** — id, code, title, description, feeling, credit, artist slug, cover, duration, waveform, download flag, status (`active` | `binned` | `removed`), likes, drops, likes this month, created at.
- **Pick** — id, source (`BIN` | `SPOTIFY` | `APPLE`), track id, external url, title, artist, cover, note, picked by, created at.

Vote rules in `src/config.ts` (change the numbers there only):

- 10 likes → keeper
- 5 drops, or a 0.6 drop ratio → remove
- Takedown contact: `takedown@bassbin.local` (reports are not wired)

## Planned (not built)

| Phase | Work | Lands as |
|---|---|---|
| 2 | Real tracks | Supabase tables matching `Track` / `Pick`; Cloudflare R2 for audio and covers. Replace `src/data` reads with a data layer. Keep pages passing data into the same components. |
| later | Login, admin actions, votes, rankings, takedown reports | Server actions or route handlers. Do not call Supabase from random components. |

When Phase 2 starts, add the client packages here, name the new folders (for example `src/lib/db`), and move those rows into **Current**.

## Decisions already made

- One Next.js app at the repo root. Pages stay thin. Shared types stay in `src/types.ts`.
- Vote numbers and the takedown email have one home: `src/config.ts`.
- Interactive UI is a client component. Data loading stays in the server page until a real backend exists.
- Covers in Phase 1 are inline SVG data URLs, not image files.

## Changelog

| Date | What changed |
|---|---|
| 2026-11-13 | Created from the Phase 0 + Phase 1 tree. |
