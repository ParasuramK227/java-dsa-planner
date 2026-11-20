# Supabase setup

Run these files in the Supabase SQL Editor, in order:

1. `migrations/0001_initial.sql` — tables, RLS, role helpers, provisioning trigger, XP/achievement/activity triggers, realtime publication.
2. `seed_curriculum.sql` — 20 weeks and 120 topics.
3. `seed_gamification.sql` — 20 achievements and 20 weekly challenges.

All three are safe to rerun.

After running them, sign in once with each core Google account so the auth trigger provisions a profile with `role = 'core'` (emails are seeded in `public.core_members`).

If a profile already exists with the wrong role, update it manually in the `profiles` table before continuing.
