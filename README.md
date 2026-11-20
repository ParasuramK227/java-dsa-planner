# Java DSA Shared Planner

A two-person Java DSA learning and placement planner. Shared 20-week curriculum and roadmap dates, individual tasks and progress, streaks, achievements, private notes and quiet shared accountability.

Design is deliberately monochrome and dark-first. Supabase is the source of truth; the browser stores only theme preference locally.

## What is implemented

- Google-only authentication with fixed **core** accounts and optional private **member** accounts.
- Shared `planner_config` roadmap dates; only core members can change them. Change history is preserved.
- 20-week / 120-topic curriculum with full objectives, subtopics, Java implementation guidance and linked practice problems.
- Deterministic schedule generation across the exact roadmap window, using each person's study days and rest day.
- Individual topic statuses and daily tasks. Missed tasks stay visible; only manual rescheduling is possible.
- 120-minute day split: concept 25m, Java implementation 20m, problems 65m, revision 10m.
- Stopwatch study sessions with pause/discard; only stopped sessions count toward time.
- Problem tracker with private approach and notes; XP and achievement writes are database-trigger-only.
- Streak snapshots derived from real task completions and stopped sessions. Rest days never break a streak.
- Weekly reviews and personal notes are private unless explicitly shared.
- Realtime refresh for activity, notifications, contributions, topic progress and task completions.
- JSON export/import for personal data, CSV export for problems.
- Responsive layout, keyboard focus styles and accessible labels.

## Project structure

```text
src/
  app/               providers, routes, shell, protected route
  components/        UI primitives and shared widgets
  hooks/             React Query data hooks
  lib/
    db/              one Supabase repository module per domain
    dates/           timezone-safe calendar math
    scheduling/      deterministic 20-week scheduler
    streaks/         streak rules and snapshots
    progress/        derived metrics
  pages/             one page per route
supabase/
  migrations/        schema, RLS, triggers, realtime publication
  seed_curriculum.sql
  seed_gamification.sql
```

## Setup

### 1. Install dependencies

```bash
npm install
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

The checked-in `.env` already contains the public publishable key for the project. Never put a `service_role` or `sb_secret_` key in the client.

### 2. Run the SQL (Supabase SQL Editor)

Run these files **in this order**:

```text
supabase/migrations/0001_initial.sql
supabase/seed_curriculum.sql
supabase/seed_gamification.sql
```

They are idempotent (`IF NOT EXISTS` / `ON CONFLICT DO NOTHING`), so rerunning is safe.

### 3. Configure Google auth

In Supabase Dashboard → Authentication → Providers → Google:

- Enable Google.
- Add the Google OAuth client ID and secret.
- Authorized redirect URI:

```text
https://pjwpfszwguivzoqufc.supabase.co/auth/v1/callback
```

In Authentication → URL Configuration:

- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/**`

For production, add the deployed origin to Redirect URLs and publish the Google OAuth app (or add the core accounts as test users).

Core emails are seeded in `public.core_members`:

```text
parasuramk227@gmail.com
navinrajaa02@gmail.com
```

Any other Google account signs up as a `member` with a private workspace.

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:5173`.

## Scripts

```bash
npm run dev      # Vite dev server
npm run build    # typecheck + production build
npm run lint     # oxlint
npx vitest run   # pure logic tests
```

## Privacy model

| Data | Who can read it |
|---|---|
| Profiles | Self; core members can read each other |
| Roadmap, topics, achievements, challenges | All signed-in users |
| Topic progress, tasks, problems, streaks, XP | Self; core members can read each other |
| Daily plan notes, problem approach/notes, session notes, personal notes | Owner only |
| Weekly review | Owner only; explicitly shared reviews are readable by core members |
| Activity feed | Core members only |
| Notifications | Owner only |

Client code cannot write XP, achievements or activity feed rows directly. Those are written by database triggers.

## Design tokens

All colours are greyscale CSS variables in `src/index.css`. `[data-theme='dark']` is the default; `[data-theme='light']` is the opt-in alternate. No brand colours are used anywhere.
