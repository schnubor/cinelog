-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Create the log_entries table
create table if not exists public.log_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  tmdb_id integer not null,
  movie_data jsonb not null,
  rating numeric(3,1) not null check (rating >= 1.0 and rating <= 10.0),
  comment text default '',
  rating_partner numeric(3,1) check (rating_partner >= 1.0 and rating_partner <= 10.0),
  comment_partner text default '',
  watched_at date,
  logged_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table public.log_entries enable row level security;

-- 3. Anyone can read all entries (public movie log)
create policy "Public read access"
  on public.log_entries
  for select
  using (true);

-- 4. Only authenticated owner can insert
create policy "Owner can insert"
  on public.log_entries
  for insert
  with check (auth.uid() = user_id);

-- 5. Only authenticated owner can delete their entries
create policy "Owner can delete"
  on public.log_entries
  for delete
  using (auth.uid() = user_id);

-- 6. Only authenticated owner can update their entries
create policy "Owner can update"
  on public.log_entries
  for update
  using (auth.uid() = user_id);

-- 7. Index for fast lookups
create index if not exists idx_log_entries_logged_at on public.log_entries (logged_at desc);
create index if not exists idx_log_entries_user_id on public.log_entries (user_id);
