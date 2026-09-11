-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- Create the applications table
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  company text not null,
  role text not null,
  stage text not null default 'Saved' check (stage in ('Saved', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected')),
  priority text not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  source text not null default 'LinkedIn' check (source in ('LinkedIn', 'Referral', 'Company Site', 'Recruiter', 'Other')),
  applied_date date,
  compensation text,
  contact text,
  job_link text,
  next_step text,
  next_step_date date,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security (each user can only see their own data)
alter table public.applications enable row level security;

-- Policy: users can see only their own applications
create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own applications
create policy "Users can insert own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

-- Policy: users can update their own applications
create policy "Users can update own applications"
  on public.applications for update
  using (auth.uid() = user_id);

-- Policy: users can delete their own applications
create policy "Users can delete own applications"
  on public.applications for delete
  using (auth.uid() = user_id);
