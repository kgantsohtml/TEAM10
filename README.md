# BASS BIN

Community radio station. One bin. Everyone hears the same moment.

This repo follows the project brief. Build order is Phase 0 → Phase 6.

Stack, folders, routes, and data flow live in [ARCHITECTURE.md](ARCHITECTURE.md). Update that file in the same change as any structural work.

## Current status

**Phase 0 + Phase 1** — static UI with dummy tracks (no Supabase / R2 yet).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Page |
|---|---|
| `/` | Dumpster diving (bin grid) |
| `/ranking` | Monthly leaderboard |
| `/ranking/archive` | Past months |
| `/mix/MX-007` | Track split view |
| `/artist/green-room` | Artist page |
| `/upload` | Upload form |
| `/waste` | Waste management picks |
| `/login` | Owner / manager login |
| `/admin` | Owner tools |

## Next (Phase 2)

Supabase tables + Cloudflare R2 uploads. Real tracks replace dummy data.
