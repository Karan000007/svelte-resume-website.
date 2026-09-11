-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- Create user_settings table for storing Google Calendar tokens
create table public.user_settings (
  user_id uuid references auth.users(id) on delete cascade primary key,
  google_access_token text,
  google_refresh_token text,
  google_token_expiry timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.user_settings enable row level security;

-- Each user can only access their own settings
create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);
