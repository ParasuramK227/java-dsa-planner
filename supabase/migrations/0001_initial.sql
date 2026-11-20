-- Java DSA Planner — initial schema
-- Run this file in the Supabase SQL Editor before running the seed files.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT where relevant.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Access control tables
-- ---------------------------------------------------------------------------

create table if not exists public.core_members (
  email text primary key,
  note text,
  added_at timestamptz not null default now()
);

insert into public.core_members (email, note)
values
  ('parasuramk227@gmail.com', 'Core member'),
  ('navinrajaa02@gmail.com', 'Core member')
on conflict (email) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('core', 'member')),
  email text not null,
  display_name text not null default '',
  avatar_url text,
  bio text not null default '',
  timezone text not null default 'Asia/Kolkata',
  daily_goal_minutes integer not null default 120 check (daily_goal_minutes > 0),
  study_days integer[] not null default '{1,2,3,4,5,6}',
  rest_day integer not null default 0 check (rest_day between 0 and 6),
  roadmap_start_date date not null default current_date,
  target_end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_email_key on public.profiles (lower(email));

create table if not exists public.planner_config (
  id boolean primary key default true check (id),
  roadmap_start_date date not null default current_date,
  target_end_date date not null default (current_date + interval '5 months')::date,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.planner_config (id)
values (true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Shared curriculum
-- ---------------------------------------------------------------------------

create table if not exists public.roadmap_weeks (
  week_no integer primary key check (week_no between 1 and 20),
  month_no integer not null check (month_no between 1 and 5),
  title text not null,
  milestone text not null
);

create table if not exists public.roadmap_topics (
  id text primary key,
  week_no integer not null references public.roadmap_weeks(week_no) on delete cascade,
  order_index integer not null,
  name text not null,
  description text not null,
  objectives jsonb not null default '[]'::jsonb,
  subtopics jsonb not null default '[]'::jsonb,
  java_requirements text not null default '',
  recommended_problems integer not null default 0,
  related_problems jsonb not null default '[]'::jsonb,
  unique (week_no, order_index)
);

-- ---------------------------------------------------------------------------
-- Individual progress
-- ---------------------------------------------------------------------------

create table if not exists public.topic_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic_id text not null references public.roadmap_topics(id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started','in_progress','completed','needs_revision')),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

create table if not exists public.daily_plans (
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_date date not null,
  notes text not null default '',
  is_complete boolean not null default false,
  primary key (user_id, plan_date)
);

create table if not exists public.user_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_date date not null,
  original_date date not null,
  topic_id text references public.roadmap_topics(id) on delete set null,
  activity_type text not null
    check (activity_type in ('concept','implementation','problems','revision','custom')),
  title text not null,
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  is_custom boolean not null default false,
  status text not null default 'pending' check (status in ('pending','completed')),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists user_tasks_unique
  on public.user_tasks (user_id, plan_date, coalesce(topic_id, ''), activity_type, title);
create index if not exists user_tasks_user_date_idx on public.user_tasks (user_id, plan_date);
create index if not exists user_tasks_overdue_idx on public.user_tasks (user_id, status, plan_date);

create table if not exists public.task_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid not null references public.user_tasks(id) on delete cascade,
  activity_type text not null,
  completion_date date not null,
  minutes integer not null default 0 check (minutes >= 0),
  created_at timestamptz not null default now(),
  unique (task_id, completion_date)
);
create index if not exists task_completions_user_date_idx
  on public.task_completions (user_id, completion_date);

-- ---------------------------------------------------------------------------
-- Problem tracker (shared-safe core + private details)
-- ---------------------------------------------------------------------------

create table if not exists public.problems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  platform text not null check (platform in ('leetcode','neetcode','hackerrank','custom')),
  topic_id text references public.roadmap_topics(id) on delete set null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  url text,
  status text not null default 'not_started'
    check (status in ('not_started','attempted','solved','needs_revision')),
  attempts integer not null default 0 check (attempts >= 0),
  time_minutes integer not null default 0 check (time_minutes >= 0),
  attempted_at timestamptz,
  solved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name, platform)
);
create index if not exists problems_user_status_idx on public.problems (user_id, status);
create index if not exists problems_user_topic_idx on public.problems (user_id, topic_id);

create table if not exists public.problem_details (
  problem_id uuid primary key references public.problems(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  approach text not null default '',
  notes text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Study sessions (shared-safe core + private details)
-- ---------------------------------------------------------------------------

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic_id text references public.roadmap_topics(id) on delete set null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists study_sessions_user_time_idx
  on public.study_sessions (user_id, started_at desc);

create table if not exists public.session_details (
  session_id uuid primary key references public.study_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  notes text not null default ''
);

-- ---------------------------------------------------------------------------
-- Streaks, achievements, XP
-- ---------------------------------------------------------------------------

create table if not exists public.streak_records (
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_date date not null,
  study_minutes integer not null default 0 check (study_minutes >= 0),
  tasks_completed integer not null default 0 check (tasks_completed >= 0),
  active_day boolean not null default false,
  is_rest_day boolean not null default false,
  goal_minutes_snapshot integer not null default 120,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, activity_date)
);
create index if not exists streak_records_user_date_idx
  on public.streak_records (user_id, activity_date desc);

create table if not exists public.achievements (
  code text primary key,
  category text not null check (category in ('consistency','problems','learning','difficulty')),
  name text not null,
  description text not null,
  criteria jsonb not null,
  icon text not null
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_code text not null references public.achievements(code) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, achievement_code)
);

create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_type text not null,
  source_id text not null,
  points integer not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, source_type, source_id)
);
create index if not exists xp_transactions_user_idx on public.xp_transactions (user_id);

-- ---------------------------------------------------------------------------
-- Private reflections and notes
-- ---------------------------------------------------------------------------

create table if not exists public.weekly_reviews (
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_no integer not null references public.roadmap_weeks(week_no) on delete cascade,
  topics_completed integer not null default 0,
  problems_solved integer not null default 0,
  study_minutes integer not null default 0,
  completion_pct numeric not null default 0,
  difficult_concepts text not null default '',
  revision_topics text not null default '',
  observations text not null default '',
  is_shared boolean not null default false,
  shared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, week_no)
);

create table if not exists public.personal_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entity_type text not null check (entity_type in ('topic','problem','week','general')),
  entity_id text,
  title text not null default '',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists personal_notes_user_idx on public.personal_notes (user_id, entity_type);

-- ---------------------------------------------------------------------------
-- Shared challenges, activity and notifications
-- ---------------------------------------------------------------------------

create table if not exists public.weekly_challenges (
  id uuid primary key default gen_random_uuid(),
  week_no integer not null unique references public.roadmap_weeks(week_no) on delete cascade,
  title text not null,
  description text not null,
  metric text not null check (metric in ('problems','minutes','topics','medium_problems')),
  target_value integer not null check (target_value > 0)
);

create table if not exists public.challenge_contributions (
  challenge_id uuid not null references public.weekly_challenges(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value integer not null default 0 check (value >= 0),
  updated_at timestamptz not null default now(),
  primary key (challenge_id, user_id)
);

create table if not exists public.activity_feed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_type text not null,
  topic_id text,
  problem_id uuid,
  title text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists activity_feed_created_idx on public.activity_feed (created_at desc);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  notification_type text not null,
  title text not null,
  body text not null default '',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications (user_id, is_read, created_at desc);

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p.role from public.profiles p where p.id = auth.uid();
$$;

create or replace function public.current_email()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p.email from public.profiles p where p.id = auth.uid();
$$;

create or replace function public.is_core_user()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'core'
  );
$$;

create or replace function public.is_core_user_id(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles p where p.id = p_user_id and p.role = 'core'
  );
$$;

create or replace function public.can_read_user(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select auth.uid() = p_user_id
    or (
      public.is_core_user()
      and public.is_core_user_id(p_user_id)
    );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- New-user provisioning (no rejection: any Google account may sign up)
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_role text;
  v_name text;
  v_avatar text;
  v_start date;
  v_end date;
begin
  select case when exists (
    select 1 from public.core_members cm where cm.email = lower(new.email)
  ) then 'core' else 'member' end into v_role;

  v_name := coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1));
  v_avatar := new.raw_user_meta_data ->> 'avatar_url';
  select roadmap_start_date, target_end_date into v_start, v_end
  from public.planner_config where id = true;

  insert into public.profiles (
    id, role, email, display_name, avatar_url, roadmap_start_date, target_end_date
  )
  values (
    new.id, v_role, lower(new.email), v_name, v_avatar, v_start, v_end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Timestamp triggers
-- ---------------------------------------------------------------------------

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_planner_config_updated on public.planner_config;
create trigger trg_planner_config_updated before update on public.planner_config
  for each row execute function public.set_updated_at();

drop trigger if exists trg_topic_progress_updated on public.topic_progress;
create trigger trg_topic_progress_updated before update on public.topic_progress
  for each row execute function public.set_updated_at();

drop trigger if exists trg_problems_updated on public.problems;
create trigger trg_problems_updated before update on public.problems
  for each row execute function public.set_updated_at();

drop trigger if exists trg_problem_details_updated on public.problem_details;
create trigger trg_problem_details_updated before update on public.problem_details
  for each row execute function public.set_updated_at();

drop trigger if exists trg_streak_records_updated on public.streak_records;
create trigger trg_streak_records_updated before update on public.streak_records
  for each row execute function public.set_updated_at();

drop trigger if exists trg_weekly_reviews_updated on public.weekly_reviews;
create trigger trg_weekly_reviews_updated before update on public.weekly_reviews
  for each row execute function public.set_updated_at();

drop trigger if exists trg_personal_notes_updated on public.personal_notes;
create trigger trg_personal_notes_updated before update on public.personal_notes
  for each row execute function public.set_updated_at();

drop trigger if exists trg_challenge_contributions_updated on public.challenge_contributions;
create trigger trg_challenge_contributions_updated before update on public.challenge_contributions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Notification + achievement helper
-- ---------------------------------------------------------------------------

create or replace function public.notify_user(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text default ''
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.notifications (user_id, notification_type, title, body)
  values (p_user_id, p_type, p_title, p_body);
end;
$$;

create or replace function public.log_activity(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_detail text default '',
  p_topic_id text default null,
  p_problem_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.activity_feed (user_id, activity_type, title, detail, topic_id, problem_id)
  values (p_user_id, p_type, p_title, p_detail, p_topic_id, p_problem_id);
end;
$$;

create or replace function public.evaluate_achievements(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  r record;
  v_value integer;
  v_award boolean;
begin
  for r in select * from public.achievements loop
    v_award := false;
    v_value := coalesce((r.criteria ->> 'count')::integer, (r.criteria ->> 'days')::integer, 0);

    case r.criteria ->> 'type'
      when 'active_days' then
        select count(*) into v_value from public.streak_records
          where user_id = p_user_id and active_day = true;
        v_award := v_value >= coalesce((r.criteria ->> 'count')::integer, 1);
      when 'streak' then
        select coalesce(max(longest_streak), 0) into v_value from public.streak_records
          where user_id = p_user_id;
        v_award := v_value >= coalesce((r.criteria ->> 'days')::integer, 0);
      when 'problems_solved' then
        select count(*) into v_value from public.problems
          where user_id = p_user_id and status = 'solved';
        v_award := v_value >= coalesce((r.criteria ->> 'count')::integer, 0);
      when 'medium_solved' then
        select count(*) into v_value from public.problems
          where user_id = p_user_id and status = 'solved' and difficulty = 'medium';
        v_award := v_value >= coalesce((r.criteria ->> 'count')::integer, 0);
      when 'hard_solved' then
        select count(*) into v_value from public.problems
          where user_id = p_user_id and status = 'solved' and difficulty = 'hard';
        v_award := v_value >= coalesce((r.criteria ->> 'count')::integer, 0);
      when 'topics_completed' then
        select count(*) into v_value from public.topic_progress
          where user_id = p_user_id and status = 'completed';
        v_award := v_value >= coalesce((r.criteria ->> 'count')::integer, 0);
      when 'weeks_completed' then
        select count(*) into v_value from (
          select week_no from public.topic_progress tp
          join public.roadmap_topics rt on rt.id = tp.topic_id
          where tp.user_id = p_user_id and tp.status = 'completed'
          group by week_no
          having count(*) = (select count(*) from public.roadmap_topics where week_no = tp.week_no)
        ) w;
        v_award := v_value >= coalesce((r.criteria ->> 'count')::integer, 0);
      when 'months_completed' then
        select count(*) into v_value from (
          select rw.month_no from public.topic_progress tp
          join public.roadmap_topics rt on rt.id = tp.topic_id
          join public.roadmap_weeks rw on rw.week_no = rt.week_no
          where tp.user_id = p_user_id and tp.status = 'completed'
          group by rw.month_no
          having count(*) = (select count(*) from public.roadmap_topics t
                             join public.roadmap_weeks w on w.week_no = t.week_no
                             where w.month_no = rw.month_no)
        ) m;
        v_award := v_value >= coalesce((r.criteria ->> 'count')::integer, 0);
      when 'roadmap_completed' then
        select count(*) into v_value from public.topic_progress
          where user_id = p_user_id and status = 'completed';
        v_award := v_value >= (select count(*) from public.roadmap_topics);
      else
        v_award := false;
    end case;

    if v_award then
      insert into public.user_achievements (user_id, achievement_code)
      values (p_user_id, r.code)
      on conflict do nothing;

      if found then
        perform public.log_activity(p_user_id, 'achievement', r.name, 'Earned an achievement');
        perform public.notify_user(p_user_id, 'achievement', 'Achievement unlocked', r.name);
      end if;
    end if;
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Event triggers: XP, activity and achievements
-- ---------------------------------------------------------------------------

create or replace function public.stamp_problem_solved()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'solved' and new.solved_at is null then
    new.solved_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_problem_stamp on public.problems;
create trigger trg_problem_stamp before insert or update of status on public.problems
  for each row execute function public.stamp_problem_solved();

create or replace function public.on_problem_solved()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_points integer;
  v_changed boolean;
begin
  if tg_op = 'INSERT' then
    v_changed := true;
  else
    v_changed := old.status is distinct from new.status;
  end if;

  if new.status = 'solved' and v_changed then
    v_points := case new.difficulty when 'easy' then 10 when 'medium' then 25 else 50 end;

    insert into public.xp_transactions (user_id, source_type, source_id, points, description)
    values (new.user_id, 'problem', new.id::text, v_points, 'Solved ' || new.difficulty || ' problem')
    on conflict do nothing;

    perform public.log_activity(
      new.user_id, 'problem_solved', 'Solved a ' || new.difficulty || ' problem',
      new.name, null, new.id
    );
    perform public.evaluate_achievements(new.user_id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_problem_solved on public.problems;
create trigger trg_problem_solved after insert or update of status on public.problems
  for each row execute function public.on_problem_solved();

create or replace function public.stamp_topic_completed()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed' and new.completed_at is null then
    new.completed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_topic_stamp on public.topic_progress;
create trigger trg_topic_stamp before insert or update of status on public.topic_progress
  for each row execute function public.stamp_topic_completed();

create or replace function public.on_topic_completed()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_week integer;
  v_month integer;
  v_remaining integer;
  v_changed boolean;
begin
  if tg_op = 'INSERT' then
    v_changed := true;
  else
    v_changed := old.status is distinct from new.status;
  end if;

  if new.status = 'completed' and v_changed then
    perform public.log_activity(
      new.user_id, 'topic_completed', 'Completed a topic',
      (select name from public.roadmap_topics where id = new.topic_id), new.topic_id, null
    );

    select week_no into v_week from public.roadmap_topics where id = new.topic_id;
    select count(*) into v_remaining from public.roadmap_topics t
      left join public.topic_progress p
        on p.topic_id = t.id and p.user_id = new.user_id and p.status = 'completed'
      where t.week_no = v_week and t.id <> new.topic_id and p.topic_id is null;

    if v_remaining = 0 then
      insert into public.xp_transactions (user_id, source_type, source_id, points, description)
      values (new.user_id, 'week_milestone', 'w' || v_week, 50, 'Completed week ' || v_week)
      on conflict do nothing;
      perform public.log_activity(
        new.user_id, 'week_milestone', 'Completed week ' || v_week || ' milestone', ''
      );
      perform public.notify_user(
        new.user_id, 'week_milestone', 'Weekly milestone completed', 'Week ' || v_week || ' is done.'
      );
    end if;

    select month_no into v_month from public.roadmap_weeks where week_no = v_week;
    select count(*) into v_remaining from public.roadmap_topics t
      join public.roadmap_weeks w on w.week_no = t.week_no
      left join public.topic_progress p
        on p.topic_id = t.id and p.user_id = new.user_id and p.status = 'completed'
      where w.month_no = v_month and t.id <> new.topic_id and p.topic_id is null;

    if v_remaining = 0 then
      insert into public.xp_transactions (user_id, source_type, source_id, points, description)
      values (new.user_id, 'month_milestone', 'm' || v_month, 150, 'Completed month ' || v_month)
      on conflict do nothing;
      perform public.log_activity(
        new.user_id, 'month_milestone', 'Completed month ' || v_month || ' milestone', ''
      );
    end if;

    perform public.evaluate_achievements(new.user_id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_topic_completed on public.topic_progress;
create trigger trg_topic_completed after insert or update of status on public.topic_progress
  for each row execute function public.on_topic_completed();

create or replace function public.on_streak_changed()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_newly_active boolean;
begin
  if tg_op = 'INSERT' then
    v_newly_active := new.active_day;
  else
    v_newly_active := new.active_day and not old.active_day;
  end if;

  if v_newly_active then
    perform public.evaluate_achievements(new.user_id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_streak_changed on public.streak_records;
create trigger trg_streak_changed after insert or update of active_day on public.streak_records
  for each row execute function public.on_streak_changed();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.core_members enable row level security;
alter table public.profiles enable row level security;
alter table public.planner_config enable row level security;
alter table public.roadmap_weeks enable row level security;
alter table public.roadmap_topics enable row level security;
alter table public.topic_progress enable row level security;
alter table public.daily_plans enable row level security;
alter table public.user_tasks enable row level security;
alter table public.task_completions enable row level security;
alter table public.problems enable row level security;
alter table public.problem_details enable row level security;
alter table public.study_sessions enable row level security;
alter table public.session_details enable row level security;
alter table public.streak_records enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.personal_notes enable row level security;
alter table public.weekly_challenges enable row level security;
alter table public.challenge_contributions enable row level security;
alter table public.activity_feed enable row level security;
alter table public.notifications enable row level security;

-- core_members
drop policy if exists "core members read own list" on public.core_members;
create policy "core members read own list" on public.core_members
  for select to authenticated using (public.is_core_user());

-- profiles
drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles
  for select to authenticated
  using (auth.uid() = id or (public.is_core_user() and public.is_core_user_id(id)));

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = public.current_role()
    and email = public.current_email()
  );

-- planner_config
drop policy if exists "planner config readable" on public.planner_config;
create policy "planner config readable" on public.planner_config
  for select to authenticated using (true);

drop policy if exists "core updates planner config" on public.planner_config;
create policy "core updates planner config" on public.planner_config
  for update to authenticated using (public.is_core_user()) with check (public.is_core_user());

-- curriculum
drop policy if exists "curriculum readable" on public.roadmap_weeks;
create policy "curriculum readable" on public.roadmap_weeks
  for select to authenticated using (true);
drop policy if exists "curriculum readable" on public.roadmap_topics;
create policy "curriculum readable" on public.roadmap_topics
  for select to authenticated using (true);
drop policy if exists "achievements readable" on public.achievements;
create policy "achievements readable" on public.achievements
  for select to authenticated using (true);
drop policy if exists "challenges readable" on public.weekly_challenges;
create policy "challenges readable" on public.weekly_challenges
  for select to authenticated using (true);

-- topic progress
drop policy if exists "topic progress readable" on public.topic_progress;
create policy "topic progress readable" on public.topic_progress
  for select to authenticated using (public.can_read_user(user_id));
drop policy if exists "topic progress self write" on public.topic_progress;
create policy "topic progress self write" on public.topic_progress
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- daily plans (private notes)
drop policy if exists "daily plans owner only" on public.daily_plans;
create policy "daily plans owner only" on public.daily_plans
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user tasks
drop policy if exists "tasks readable" on public.user_tasks;
create policy "tasks readable" on public.user_tasks
  for select to authenticated using (public.can_read_user(user_id));
drop policy if exists "tasks self write" on public.user_tasks;
create policy "tasks self write" on public.user_tasks
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- task completions: insert/update by owner, readable per can_read_user
drop policy if exists "completions readable" on public.task_completions;
create policy "completions readable" on public.task_completions
  for select to authenticated using (public.can_read_user(user_id));
drop policy if exists "completions self insert" on public.task_completions;
create policy "completions self insert" on public.task_completions
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "completions self delete" on public.task_completions;
create policy "completions self delete" on public.task_completions
  for delete to authenticated using (auth.uid() = user_id);

-- problems
drop policy if exists "problems readable" on public.problems;
create policy "problems readable" on public.problems
  for select to authenticated using (public.can_read_user(user_id));
drop policy if exists "problems self write" on public.problems;
create policy "problems self write" on public.problems
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- private details
drop policy if exists "problem details owner" on public.problem_details;
create policy "problem details owner" on public.problem_details
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "session details owner" on public.session_details;
create policy "session details owner" on public.session_details
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "personal notes owner" on public.personal_notes;
create policy "personal notes owner" on public.personal_notes
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "weekly review readable" on public.weekly_reviews;
create policy "weekly review readable" on public.weekly_reviews
  for select to authenticated
  using (
    auth.uid() = user_id or (
      is_shared and public.is_core_user() and public.is_core_user_id(user_id)
    )
  );

drop policy if exists "weekly review insert" on public.weekly_reviews;
create policy "weekly review insert" on public.weekly_reviews
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "weekly review update" on public.weekly_reviews;
create policy "weekly review update" on public.weekly_reviews
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "weekly review delete" on public.weekly_reviews;
create policy "weekly review delete" on public.weekly_reviews
  for delete to authenticated using (auth.uid() = user_id);

-- study sessions
drop policy if exists "sessions readable" on public.study_sessions;
create policy "sessions readable" on public.study_sessions
  for select to authenticated using (public.can_read_user(user_id));
drop policy if exists "sessions self write" on public.study_sessions;
create policy "sessions self write" on public.study_sessions
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- streak records
drop policy if exists "streaks readable" on public.streak_records;
create policy "streaks readable" on public.streak_records
  for select to authenticated using (public.can_read_user(user_id));
drop policy if exists "streaks self write" on public.streak_records;
create policy "streaks self write" on public.streak_records
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- achievements / xp (trigger-written only)
drop policy if exists "user achievements readable" on public.user_achievements;
create policy "user achievements readable" on public.user_achievements
  for select to authenticated using (public.can_read_user(user_id));
drop policy if exists "xp readable" on public.xp_transactions;
create policy "xp readable" on public.xp_transactions
  for select to authenticated using (public.can_read_user(user_id));

-- challenge contributions
drop policy if exists "contributions readable" on public.challenge_contributions;
create policy "contributions readable" on public.challenge_contributions
  for select to authenticated using (public.can_read_user(user_id));
drop policy if exists "core contributes" on public.challenge_contributions;
create policy "core contributes" on public.challenge_contributions
  for all to authenticated
  using (auth.uid() = user_id and public.is_core_user())
  with check (auth.uid() = user_id and public.is_core_user());

-- activity feed (core only, trigger-written)
drop policy if exists "activity core readable" on public.activity_feed;
create policy "activity core readable" on public.activity_feed
  for select to authenticated using (public.is_core_user());

-- notifications (trigger-written)
drop policy if exists "notifications owner read" on public.notifications;
create policy "notifications owner read" on public.notifications
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "notifications owner update" on public.notifications;
create policy "notifications owner update" on public.notifications
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Realtime publication
-- ---------------------------------------------------------------------------

do $$
begin
  alter publication supabase_realtime add table public.activity_feed;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.challenge_contributions;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.topic_progress;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.task_completions;
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Table-level privileges for PostgREST roles.
-- RLS still enforces row access; these grants only allow access to the tables.
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

grant usage, select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to anon, authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select on tables to anon;
alter default privileges in schema public
  grant execute on functions to anon, authenticated;
