-- Backfill core profiles for Google accounts that already exist in auth.users.
-- Profiles are normally created by the on_auth_user_created trigger. If an
-- account was created before that trigger existed, this creates the missing row.
-- A member who has never signed in has no auth.users row, so they must sign in
-- once before this can create their profile.

insert into public.profiles (
  id, role, email, display_name, avatar_url, roadmap_start_date, target_end_date
)
select
  u.id,
  'core',
  lower(u.email),
  coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data ->> 'avatar_url',
  c.roadmap_start_date,
  c.target_end_date
from auth.users u
join public.core_members cm on lower(cm.email) = lower(u.email)
cross join public.planner_config c
on conflict (id) do update
  set role = 'core',
      email = excluded.email;
