-- =====================================================================
-- CodeChef ABESEC Event Platform - database setup
-- Run this whole file once in: Supabase Dashboard -> SQL Editor -> New query
-- It is safe to re-run (policies are dropped and re-created).
-- =====================================================================

-- ---------- TABLES ----------------------------------------------------

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 120),
  description text,
  category text not null check (category in (
    'Competitive Programming', 'Development', 'Hackathon',
    'Workshop', 'Seminar', 'Community', 'Other')),
  date date not null,
  start_time time,
  end_time time,
  venue text,
  image_url text,
  registration_deadline timestamptz,
  eligibility text,
  rules text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 100),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  college_year text not null check (char_length(trim(college_year)) between 2 and 100),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  created_at timestamptz not null default now()
);

-- One registration per email per event. lower() makes it case-insensitive,
-- so "Asha@x.com" and "asha@x.com" count as the same person.
create unique index if not exists registrations_event_email_unique
  on public.registrations (event_id, lower(email));

create index if not exists registrations_event_id_idx on public.registrations (event_id);
create index if not exists events_date_idx on public.events (date);

-- Only users listed here are admins. Rows are added manually (see README).
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- ---------- HELPERS ---------------------------------------------------

-- Keep events.updated_at fresh on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- "Is the current logged-in user an admin?"
-- security definer lets the function read public.admins even though
-- normal users are not allowed to list that table.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- ROW LEVEL SECURITY ----------------------------------------

alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.admins enable row level security;

-- EVENTS: everyone can read, only admins can write
drop policy if exists "Public can read events" on public.events;
create policy "Public can read events" on public.events
  for select to anon, authenticated using (true);

drop policy if exists "Admins can create events" on public.events;
create policy "Admins can create events" on public.events
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update events" on public.events;
create policy "Admins can update events" on public.events
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete events" on public.events;
create policy "Admins can delete events" on public.events
  for delete to authenticated using (public.is_admin());

-- REGISTRATIONS: students can insert (only while registration is open),
-- admins can read and delete. There is NO update policy, so nobody can edit
-- a registration, and there is NO select policy for students, so nobody
-- can list other people's registrations.
drop policy if exists "Anyone can register for open events" on public.registrations;
create policy "Anyone can register for open events" on public.registrations
  for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.events e
      where e.id = registrations.event_id
        and coalesce(
              e.registration_deadline,
              ((e.date + coalesce(e.start_time, time '23:59:59')) at time zone 'Asia/Kolkata')
            ) > now()
    )
  );

drop policy if exists "Admins can read registrations" on public.registrations;
create policy "Admins can read registrations" on public.registrations
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins can delete registrations" on public.registrations;
create policy "Admins can delete registrations" on public.registrations
  for delete to authenticated using (public.is_admin());

-- ADMINS: a logged-in user may only see their OWN row (used by the app to
-- check admin status). Nobody can list all admins. No insert/update/delete
-- policies, so admins can only be added from the SQL Editor.
drop policy if exists "Users can see their own admin row" on public.admins;
create policy "Users can see their own admin row" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ---------- STORAGE (event banner images) -----------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-images', 'event-images', true, 2097152,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- The bucket is public, so anyone can VIEW images through their URL.
-- Only admins can upload, replace or delete them.
drop policy if exists "Admins can upload event images" on storage.objects;
create policy "Admins can upload event images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'event-images' and public.is_admin());

drop policy if exists "Admins can update event images" on storage.objects;
create policy "Admins can update event images" on storage.objects
  for update to authenticated
  using (bucket_id = 'event-images' and public.is_admin())
  with check (bucket_id = 'event-images' and public.is_admin());

drop policy if exists "Admins can delete event images" on storage.objects;
create policy "Admins can delete event images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'event-images' and public.is_admin());

-- ---------- FIRST ADMIN -----------------------------------------------
-- 1. Create the user in Dashboard -> Authentication -> Users -> Add user.
-- 2. Then run this (replace the email) to make them an admin:
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
