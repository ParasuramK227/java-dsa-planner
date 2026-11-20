-- Table-level privileges for PostgREST roles.
-- RLS policies still control which rows are visible/writable; these grants only
-- allow the `authenticated` role to reach the tables at all.
--
-- Run this in the Supabase SQL Editor for existing projects. Fresh projects get
-- the same block appended to 0001_initial.sql.

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
