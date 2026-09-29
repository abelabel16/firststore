-- ============================================================
-- FirstStore — Supabase schema
-- Run this once in your Supabase project: SQL Editor → paste → Run.
-- Safe to re-run: it drops and recreates its own objects.
-- ============================================================

-- Helper functions reference tables created later in this file; skip body
-- validation during creation (the same technique pg_dump uses).
set check_function_bodies = off;

-- ---------- helpers ----------

-- Current user's email from the JWT (lowercased).
create or replace function public.jwt_email()
returns text language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

-- Is the current user an admin? (security definer avoids RLS recursion)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- Does the current user own a product?
create or replace function public.has_product(p text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.entitlements e
    where e.email = public.jwt_email() and e.product = p
  )
$$;

-- ---------- tables ----------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique check (char_length(email) <= 254),
  name text not null default '' check (char_length(name) <= 100),
  completed_lessons text[] not null default '{}',
  community_access boolean not null default false,
  is_admin boolean not null default false,
  vip_onboarding jsonb,
  admin_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  email text not null,
  product text not null check (product in ('course', 'vip')),
  created_at timestamptz not null default now(),
  primary key (email, product)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tx_ref text not null unique,
  email text not null,
  name text not null default '',
  product text not null check (product in ('course', 'vip')),
  amount_usd numeric not null,
  -- 'confirming' = customer has sent a crypto payment that is awaiting
  -- blockchain confirmation. 'pending' = checkout opened but never paid.
  status text not null default 'pending' check (status in ('pending', 'confirming', 'paid', 'failed')),
  provider text not null default 'chapa',
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.vip_sessions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  number int not null,
  date text not null,
  time text not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'completed')),
  store_url text not null default '' check (char_length(store_url) <= 500),
  product_url text not null default '' check (char_length(product_url) <= 500),
  questions text not null default '' check (char_length(questions) <= 5000),
  action_plan text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) <= 254 and email ~ '^\S+@\S+\.\S+$'),
  name text check (char_length(name) <= 100),
  source text not null check (source in ('contact', 'vip')),
  subject text not null check (char_length(subject) between 1 and 200),
  message text not null check (char_length(message) between 1 and 5000),
  store_url text check (char_length(store_url) <= 500),
  product_url text check (char_length(product_url) <= 500),
  status text not null default 'open' check (status in ('open', 'closed')),
  reply text,
  created_at timestamptz not null default now()
);

-- First-party analytics: anonymous page views (no cookies, no third parties).
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null check (char_length(path) <= 200),
  referrer text check (char_length(referrer) <= 500),
  visitor text check (char_length(visitor) <= 64),
  created_at timestamptz not null default now()
);
create index if not exists page_views_created_idx on public.page_views (created_at desc);

-- Visit detail. Each page view is a 'view' row; when the visitor leaves that
-- page a 'leave' row (same view_id) records time on page and scroll depth;
-- 'event' rows mark actions such as clicking Pay. Everything is anonymous:
-- no IP, no name, only what the browser reports about itself.
alter table public.page_views
  add column if not exists kind text not null default 'view' check (kind in ('view', 'leave', 'event')),
  add column if not exists view_id uuid,
  add column if not exists session text check (char_length(session) <= 64),
  add column if not exists event text check (char_length(event) <= 40),
  add column if not exists duration_ms integer check (duration_ms between 0 and 86400000),
  add column if not exists scroll_pct smallint check (scroll_pct between 0 and 100),
  add column if not exists device text check (char_length(device) <= 20),
  add column if not exists os text check (char_length(os) <= 20),
  add column if not exists browser text check (char_length(browser) <= 20),
  add column if not exists tz text check (char_length(tz) <= 64),
  add column if not exists lang text check (char_length(lang) <= 20),
  add column if not exists utm_source text check (char_length(utm_source) <= 60);

-- ---------- triggers ----------

-- Create a profile row automatically when a user signs up / first logs in.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, lower(new.email), coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Non-admins may edit only their harmless profile columns; privileged
-- columns silently keep their old values.
create or replace function public.protect_profile_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.id := old.id;
    new.email := old.email;
    new.is_admin := old.is_admin;
    new.community_access := old.community_access;
    new.admin_notes := old.admin_notes;
    new.created_at := old.created_at;
  end if;
  return new;
end $$;

drop trigger if exists protect_profile_columns on public.profiles;
create trigger protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- Clients may edit only their session preparation; scheduling and the
-- action plan are controlled by the mentor (admin).
create or replace function public.protect_session_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.id := old.id;
    new.email := old.email;
    new.number := old.number;
    new.date := old.date;
    new.time := old.time;
    new.status := old.status;
    new.action_plan := old.action_plan;
    new.created_at := old.created_at;
  end if;
  return new;
end $$;

drop trigger if exists protect_session_columns on public.vip_sessions;
create trigger protect_session_columns
  before update on public.vip_sessions
  for each row execute function public.protect_session_columns();

-- ---------- row level security ----------

alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.orders enable row level security;
alter table public.vip_sessions enable row level security;
alter table public.tickets enable row level security;

-- profiles: read/update own row; admins read/update everyone.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- entitlements: users see their own; admins see all. Only the payment
-- Edge Functions (service role, bypasses RLS) can write.
drop policy if exists entitlements_select on public.entitlements;
create policy entitlements_select on public.entitlements for select
  using (email = public.jwt_email() or public.is_admin());

-- orders: users see their own paid history; admins see all. Only the
-- payment Edge Functions write.
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders for select
  using (email = public.jwt_email() or public.is_admin());

-- vip_sessions: VIP clients manage their own; admins manage all.
drop policy if exists vip_sessions_select on public.vip_sessions;
create policy vip_sessions_select on public.vip_sessions for select
  using ((email = public.jwt_email() and public.has_product('vip')) or public.is_admin());

drop policy if exists vip_sessions_insert on public.vip_sessions;
create policy vip_sessions_insert on public.vip_sessions for insert
  with check (
    (email = public.jwt_email() and public.has_product('vip') and status = 'upcoming')
    or public.is_admin()
  );

drop policy if exists vip_sessions_update on public.vip_sessions;
create policy vip_sessions_update on public.vip_sessions for update
  using ((email = public.jwt_email() and public.has_product('vip')) or public.is_admin())
  with check ((email = public.jwt_email() and public.has_product('vip')) or public.is_admin());

-- page_views: anyone can record a view; only admins can read them.
alter table public.page_views enable row level security;
drop policy if exists page_views_insert on public.page_views;
create policy page_views_insert on public.page_views for insert with check (true);
drop policy if exists page_views_select on public.page_views;
create policy page_views_select on public.page_views for select using (public.is_admin());

-- tickets: anyone may send a contact message; VIP clients may open VIP
-- tickets; users read their own; only admins reply/close.
drop policy if exists tickets_insert on public.tickets;
create policy tickets_insert on public.tickets for insert
  with check (
    status = 'open' and reply is null and (
      source = 'contact'
      or (source = 'vip' and email = public.jwt_email() and public.has_product('vip'))
    )
  );

drop policy if exists tickets_select on public.tickets;
create policy tickets_select on public.tickets for select
  using (
    (email = public.jwt_email() and public.jwt_email() <> '')
    or public.is_admin()
  );

drop policy if exists tickets_update on public.tickets;
create policy tickets_update on public.tickets for update
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- after running this file ----------
-- 1. Make yourself admin (after your first login on the site):
--      update public.profiles set is_admin = true where email = 'you@example.com';
-- 2. (Optional) grant yourself course+vip access for testing:
--      insert into public.entitlements (email, product) values
--        ('you@example.com', 'course'), ('you@example.com', 'vip')
--      on conflict do nothing;
